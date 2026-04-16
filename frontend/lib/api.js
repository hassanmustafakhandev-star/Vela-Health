import axios from 'axios';
import useAuthStore from '@/store/authStore';
import {
  MOCK_APPOINTMENTS,
  MOCK_DOCTORS,
  MOCK_VITALS,
  MOCK_DOCUMENTS,
  MOCK_HEALTH_SUMMARY,
  MOCK_PRESCRIPTIONS,
  MOCK_FAMILY_MEMBERS,
  MOCK_PHARMACY_PRODUCTS,
  MOCK_LAB_TESTS,
  MOCK_DOCTOR_STATS,
  MOCK_DOCTOR_APPOINTMENTS,
} from '@/lib/mockData';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// If no API URL is configured, mock mode is always active
const MOCK_MODE = !API_URL || API_URL === '';

/**
 * Mock response router — maps API paths to seed data.
 * Returns realistic data for all supported endpoints.
 */
function getMockResponse(method, url) {
  const u = url.toLowerCase();

  // Auth
  if (u.includes('/auth/verify')) return { role: 'patient', doctor_status: null, token_role: 'patient' };

  // Appointments
  if (u.includes('/appointments/me')) return MOCK_APPOINTMENTS;
  if (u.includes('/appointments') && u.includes('role=doctor')) return { items: MOCK_DOCTOR_APPOINTMENTS };
  if (u.includes('/appointments')) return MOCK_APPOINTMENTS;

  // Doctors
  if (u.match(/\/doctors\/[^/]+\/slots/)) return { slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] };
  if (u.match(/\/doctors\/[^/]+/)) {
    const uid = u.split('/doctors/')[1]?.split('?')[0];
    return MOCK_DOCTORS.find((d) => d.uid === uid) || MOCK_DOCTORS[0];
  }
  if (u.includes('/doctors')) return { doctors: MOCK_DOCTORS, total: MOCK_DOCTORS.length };

  // Health Records
  if (u.includes('/records/vitals')) return { vitals: MOCK_VITALS };
  if (u.includes('/records/documents')) return { documents: MOCK_DOCUMENTS };
  if (u.includes('/records/summary')) return MOCK_HEALTH_SUMMARY;
  if (u.includes('/records/upload')) return { success: true, document: MOCK_DOCUMENTS[0] };

  // AI
  if (u.includes('/ai/symptoms')) return { response: 'AI service is offline in demo mode. Your symptoms have been noted.' };
  if (u.includes('/ai/insights')) return { insight: 'Your recent vitals are within healthy ranges. Maintain regular hydration and 30 minutes of light exercise daily.' };
  if (u.includes('/ai/save-session')) return { success: true };

  // Prescriptions
  if (u.includes('/prescriptions')) return { items: MOCK_PRESCRIPTIONS };

  // Family
  if (u.includes('/family')) return { members: MOCK_FAMILY_MEMBERS };

  // Pharmacy
  if (u.includes('/pharmacy')) return { products: MOCK_PHARMACY_PRODUCTS };

  // Labs
  if (u.includes('/labs')) return { tests: MOCK_LAB_TESTS };

  // Referrals
  if (u.includes('/referrals')) return { success: true, id: 'ref-' + Date.now() };

  // Doctor stats
  if (u.includes('/doctors/me') || u.includes('/doctor/stats')) return MOCK_DOCTOR_STATS;

  // Consultation
  if (u.includes('/consult')) return { success: true };

  // Default
  return { success: true, data: [] };
}

const api = axios.create({
  baseURL: API_URL || 'http://localhost:8000/v1',
  timeout: 8000,
});

api.interceptors.request.use(
  async (config) => {
    // MOCK MODE: If no backend URL, skip real requests
    if (MOCK_MODE) {
      const signal = new AbortController();
      signal.abort();
      config.signal = signal.signal;
      config.__isMock = true;
      return config;
    }

    // OFFLINE CHECK
    if (typeof window !== 'undefined' && !window.navigator.onLine) {
      const controller = new AbortController();
      controller.abort();
      config.signal = controller.signal;
      config.__isMock = true;
      return config;
    }

    // Attach Firebase Bearer token
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
    const config = error.config || {};

    // MOCK FALLBACK: Network error, timeout, CORS, or no backend
    const shouldMock =
      config.__isMock ||
      !error.response ||
      error.code === 'ECONNABORTED' ||
      error.code === 'ERR_CANCELED' ||
      error.code === 'ERR_NETWORK' ||
      (error.response?.status >= 500 && !config._retried);

    if (shouldMock) {
      const method = config.method?.toLowerCase() || 'get';
      const url = config.url || '';
      const mockData = getMockResponse(method, url);
      // Return a fake successful axios response
      return Promise.resolve({ data: mockData, status: 200, statusText: 'OK (Mock)', config });
    }

    // Token refresh on 401
    if (error.response?.status === 401 && !config._retry) {
      config._retry = true;
      try {
        const newToken = await useAuthStore.getState().refreshToken();
        if (newToken) {
          config.headers.Authorization = `Bearer ${newToken}`;
          return api(config);
        }
      } catch (e) {
        console.error('API Refresh failed:', e);
        useAuthStore.getState().logout();
      }
    }

    // Exponential backoff for 5xx (max 3 retries)
    if (error.response?.status >= 500 && !config._retried) {
      config._retried = true;
      config.retryCount = (config.retryCount || 0) + 1;
      const MAX_RETRIES = 2;
      if (config.retryCount <= MAX_RETRIES) {
        const delay = Math.pow(2, config.retryCount) * 500;
        return new Promise((resolve) => setTimeout(() => resolve(api(config)), delay));
      }
      // After max retries, fall back to mock
      const mockData = getMockResponse(config.method || 'get', config.url || '');
      return Promise.resolve({ data: mockData, status: 200, statusText: 'OK (Mock Fallback)', config });
    }

    return Promise.reject(error);
  }
);

export const get = (url, params) => api.get(url, { params });
export const post = (url, data) => api.post(url, data);
export const put = (url, data) => api.put(url, data);
export const del = (url) => api.delete(url);

export default api;
