import { create } from 'zustand';
import type { JobProfile, CreateJobProfilePayload } from '@/types';
import * as jobProfileService from '@/services/jobProfileService';
import { useNotificationStore } from './notificationSlice';

// Define the possible statuses for our async operations
type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

// Define the shape of our state and actions
interface JobProfileState {
  profiles: JobProfile[];
  currentProfileId: number | null;
  status: ApiStatus;
  fetchProfiles: () => Promise<void>;
  createProfile: (payload: CreateJobProfilePayload) => Promise<void>;
  deleteProfile: (profileId: number) => Promise<void>;
  setCurrentProfile: (profileId: number) => void;
}

export const useJobProfileStore = create<JobProfileState>((set, get) => ({
  // --- INITIAL STATE ---
  profiles: [],
  currentProfileId: null,
  status: 'idle',

  // --- ACTIONS ---

  /**
   * Fetches all job profiles from the API and updates the state.
   */
  fetchProfiles: async () => {
    set({ status: 'loading' });
    try {
      const profiles = await jobProfileService.getProfiles();
      set({ profiles, status: 'success' });

      // Logic to ensure a `currentProfileId` is always set if possible
      const { currentProfileId } = get();
      const isCurrentProfileStillValid = profiles.some(p => p.id === currentProfileId);

      if (!isCurrentProfileStillValid && profiles.length > 0) {
        // If the old current profile was deleted or is no longer valid,
        // default to the first one in the list.
        set({ currentProfileId: profiles[0].id });
      } else if (profiles.length === 0) {
        // If there are no profiles, ensure currentProfileId is null.
        set({ currentProfileId: null });
      }
    } catch (error: any) {
      set({ status: 'error' });
      useNotificationStore.getState().showNotification(error.message, 'error');
    }
  },

  /**
   * Creates a new job profile and then re-fetches the entire list for consistency.
   */
  createProfile: async (payload) => {
    // We don't need a loading state here, as the UI will likely have its own
    // loading indicator on the form submission button.
    try {
      await jobProfileService.createProfile(payload);
      useNotificationStore.getState().showNotification('Job profile created successfully!', 'success');
      // Re-fetch the list to get the new item and ensure state is consistent.
      await get().fetchProfiles();
    } catch (error: any) {
      useNotificationStore.getState().showNotification(error.message, 'error');
      // Re-throw the error so the form component knows the submission failed
      throw error;
    }
  },

  /**
   * Deletes a job profile and then re-fetches the list.
   */
  deleteProfile: async (profileId) => {
    try {
      await jobProfileService.deleteProfile(profileId);
      useNotificationStore.getState().showNotification('Job profile deleted.', 'info');
      // Re-fetch the list to remove the item and update the current profile if needed.
      await get().fetchProfiles();
    } catch (error: any) {
      useNotificationStore.getState().showNotification(error.message, 'error');
    }
  },

  /**
   * Sets the currently active profile for the live interview.
   */
  setCurrentProfile: (profileId) => {
    set({ currentProfileId: profileId });
    // Optionally, show a success message to confirm the change
    const profile = get().profiles.find(p => p.id === profileId);
    if (profile) {
      useNotificationStore.getState().showNotification(`"${profile.profile_name}" is now set for the live interview.`, 'success');
    }
  },
}));