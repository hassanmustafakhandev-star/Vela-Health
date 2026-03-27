import axios from 'axios';
import useAuthStore from '@/store/authStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000, // 15s timeout for production stability
});

api.interceptors.request.use(
  async (config) => {
    // OFFLINE PREVENTION
    if (typeof window !== 'undefined' && !window.navigator.onLine) {
      return Promise.reject(new Error('OFFLINE: No secure uplink available.'));
    }

    let token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        const newToken = await useAuthStore.getState().refreshToken();
        if (newToken) {
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return api(error.config);
        }
      } catch (e) {
        console.error('API Refresh failed:', e);
        useAuthStore.getState().logout();
      }
    } else if (error.response?.status >= 500 || error.code === 'ECONNABORTED' || !error.response) {
      // EXPONENTIAL BACKOFF RETRY LOGIC (Max 3 retries)
      const config = error.config;
      config.retryCount = config.retryCount || 0;
      
      const MAX_RETRIES = 3;
      if (config.retryCount < MAX_RETRIES) {
        config.retryCount += 1;
        const delay = Math.pow(2, config.retryCount) * 500; // 1s, 2s, 4s
        console.warn(`[Network Degraded] Retrying request... Attempt ${config.retryCount}/${MAX_RETRIES} in ${delay}ms`);
        
        return new Promise((resolve) => {
          setTimeout(() => resolve(axios(config)), delay);
        });
      }
      
      console.error('Server side error occurred after maximum retries:', error.response?.data || error.message);
      // Let the consumer handle or show toast independently
    }
    return Promise.reject(error);
  }
);

export const get = (url, params) => api.get(url, { params });
export const post = (url, data) => api.post(url, data);
export const put = (url, data) => api.put(url, data);
export const del = (url) => api.delete(url);

export default api;
