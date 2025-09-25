// src/store/slices/sessionHistorySlice.ts

import { create } from 'zustand';
import type { SessionSummary, SessionDetail } from '@/types';
import * as coachingSessionService from '@/services/coachingSessionService';
import { useNotificationStore } from './notificationSlice';

// Define the possible statuses for our async operations
type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

// Define the shape of our state and actions
interface SessionHistoryState {
  sessions: SessionSummary[];
  selectedSessionDetail: SessionDetail | null;
  listStatus: ApiStatus;
  detailStatus: ApiStatus;
  fetchSessions: (profileId: number) => Promise<void>;
  fetchSessionDetail: (profileId: number, sessionId: number) => Promise<void>;
  clearSelectedSession: () => void;
}

export const useSessionHistoryStore = create<SessionHistoryState>((set) => ({
  // --- INITIAL STATE ---
  sessions: [],
  selectedSessionDetail: null,
  listStatus: 'idle',
  detailStatus: 'idle',

  // --- ACTIONS ---

  /**
   * Fetches the list of completed session summaries for a given profile.
   */
  fetchSessions: async (profileId: number) => {
    set({ listStatus: 'loading', sessions: [] }); // Clear old sessions while loading
    try {
      const sessions = await coachingSessionService.getCompletedSessions(profileId);
      set({ sessions, listStatus: 'success' });
    } catch (error: any) {
      set({ listStatus: 'error' });
      useNotificationStore.getState().showNotification(error.message, 'error');
    }
  },

  /**
   * Fetches the full details of a single selected session.
   */
  fetchSessionDetail: async (profileId: number, sessionId: number) => {
    set({ detailStatus: 'loading', selectedSessionDetail: null });
    try {
      const sessionDetail = await coachingSessionService.getSessionDetail(profileId, sessionId);
      set({ selectedSessionDetail: sessionDetail, detailStatus: 'success' });
    } catch (error: any) {
      set({ detailStatus: 'error' });
      useNotificationStore.getState().showNotification(error.message, 'error');
    }
  },

  /**
   * Clears the currently selected session detail.
   * Useful when the user deselects an item or navigates away.
   */
  clearSelectedSession: () => {
    set({ selectedSessionDetail: null, detailStatus: 'idle' });
  },
}));