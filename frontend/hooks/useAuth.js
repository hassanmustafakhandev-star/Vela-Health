import { useEffect } from 'react';
import useAuthStore from '@/store/authStore';

export default function useAuth() {
  const { user, token, loading, logout, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return { 
    user, 
    token, 
    loading, 
    logout, 
    isAuthenticated: user !== null 
  };
}
