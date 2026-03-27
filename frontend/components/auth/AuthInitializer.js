'use client';
import { useEffect } from 'react';
import useAuthStore from '@/store/authStore';

export default function AuthInitializer() {
  useEffect(() => {
    // Initializing auth once on client mount
    useAuthStore.getState().initAuth();
  }, []);

  return null;
}
