import { create } from 'zustand';
import type { User } from '@/types';
import { getProfile } from '@/services/userService';

interface UserState {
  user: User | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  fetchUserProfile: () => Promise<void>;
  clearUserProfile: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  status: 'idle',

  fetchUserProfile: async () => {
    set({ status: 'loading' });
    try {
      const userData = await getProfile();
      set({ user: userData, status: 'success' });
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      set({ status: 'error' });
      // Optional: Handle token expiration error by logging the user out
    }
  },

  clearUserProfile: () => {
    set({ user: null, status: 'idle' });
  },
}));