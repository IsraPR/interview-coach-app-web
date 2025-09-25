import { create } from 'zustand';
import type { User, Resume, ResumePayload } from '@/types';
import * as userService from '@/services/userService';
import { useNotificationStore } from './notificationSlice';

// Define the possible statuses for our async operations
type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

// Define the updated shape of our state and actions
interface UserState {
  user: User | null;
  status: ApiStatus;
  resume: Resume | null; 
  resumeStatus: ApiStatus; 
  fetchUserProfile: () => Promise<void>;
  fetchResume: () => Promise<void>; 
  saveResume: (payload: ResumePayload) => Promise<void>; 
  clearUserProfile: () => void;
}

// Define the updated initial state
const initialState = {
  user: null,
  status: 'idle' as ApiStatus,
  resume: null,
  resumeStatus: 'idle' as ApiStatus,
};

export const useUserStore = create<UserState>((set, get) => ({
  ...initialState,

  // --- ACTIONS ---

  fetchUserProfile: async () => {
    set({ status: 'loading' });
    try {
      const userData = await userService.getProfile();
      set({ user: userData, status: 'success' });
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      set({ status: 'error' });
      // We don't show a notification here as it might be a common case (e.g., expired token)
    }
  },

  fetchResume: async () => {
    set({ resumeStatus: 'loading' });
    try {
      const resumeData = await userService.getResume(); // This can return null
      set({ resume: resumeData, resumeStatus: 'success' });
    } catch (error: any) {
      set({ resumeStatus: 'error' });
      useNotificationStore.getState().showNotification(error.message, 'error');
    }
  },

  saveResume: async (payload) => {
    const { resume } = get();
    const apiCall = resume ? userService.updateResume : userService.createResume;
    const successMessage = resume ? 'Resume updated successfully!' : 'Resume created successfully!';

    try {
      const updatedResume = await apiCall(payload);
      set({ resume: updatedResume, resumeStatus: 'success' });
      useNotificationStore.getState().showNotification(successMessage, 'success');
    } catch (error: any) {
      useNotificationStore.getState().showNotification(error.message, 'error');
      // Re-throw the error so the UI form knows the submission failed
      throw error;
    }
  },

  clearUserProfile: () => {
    set(initialState);
  },
}));