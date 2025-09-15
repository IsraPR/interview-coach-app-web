import { create } from 'zustand';
import { login as loginService } from '@/services/authService';
import type { LoginCredentials } from '@/types';
import { useNotificationStore } from './notificationSlice';

interface AuthState {
  token: string | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  hydrateAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  status: 'idle',

  login: async (credentials) => {
    set({ status: 'loading' });
    try {
      const response = await loginService(credentials);
      const accessToken = response.access;

      if (!accessToken) {
        throw new Error('Login failed: No access token received.');
      }
      
      set({ token: accessToken, status: 'success' });
      localStorage.setItem('authToken', accessToken);

      // 👇 TRIGGER the notification in the other store
      useNotificationStore.getState().showNotification('Login successful!', 'success');

    } catch (error: any) {
      const errorMessage = error.message || 'An unknown error occurred';
      set({ status: 'error' });
      
      // 👇 TRIGGER an error notification
      useNotificationStore.getState().showNotification(errorMessage, 'error');
    }
  },

  logout: () => {
    set({ token: null, status: 'idle' });
    localStorage.removeItem('authToken');
  },

  hydrateAuth: () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      set({ token, status: 'success' });
    }
  },
}));