// src/services/coachingSessionService.ts

import { restClient } from '@/lib/axios';
import type {
  SessionSetup,
  SessionSetupPayload,
  SessionData,
  CreateSessionForProfilePayload,
  SessionSummary, // 👈 Import new types
  SessionDetail,
} from '@/types';
import axios from 'axios';

const handleApiError = (error: any, context: string): never => {
  if (axios.isAxiosError(error) && error.response) {
    const errorMessage = error.response.data?.detail || error.response.data?.message || `Failed to ${context}.`;
    throw new Error(errorMessage);
  }
  throw new Error(`An unexpected error occurred while trying to ${context}.`);
};

export const createSessionSetup = async (payload: SessionSetupPayload): Promise<SessionSetup> => {
  try {
    const response = await restClient.post<SessionSetup>('/api/coaching/session-setup', payload);
    return response.data;
  } catch (error) {
    handleApiError(error, 'create session setup');
  }
};

export const createSessionForProfile = async (
  profileId: number,
  payload: CreateSessionForProfilePayload
): Promise<SessionData> => {
  try {
    const response = await restClient.post<SessionData>(
      `/api/coaching/job-profiles/${profileId}/sessions`,
      payload
    );
    return response.data;
  } catch (error) {
    handleApiError(error, 'create session for profile');
  }
};

// --- NEW FEEDBACK FUNCTIONS ---

/**
 * Fetches all completed session summaries for a given job profile.
 * @param profileId - The ID of the job profile.
 * @returns An array of session summaries.
 */
export const getCompletedSessions = async (profileId: number): Promise<SessionSummary[]> => {
  try {
    const response = await restClient.get<SessionSummary[]>(
      `/api/coaching/job-profiles/${profileId}/sessions?status=COMPLETED`
    );
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch completed sessions');
  }
};

/**
 * Fetches the full details (including transcript) for a single session.
 * @param profileId - The ID of the job profile.
 * @param sessionId - The ID of the session.
 * @returns The full session detail object.
 */
export const getSessionDetail = async (profileId: number, sessionId: number): Promise<SessionDetail> => {
  try {
    const response = await restClient.get<SessionDetail>(
      `/api/coaching/job-profiles/${profileId}/sessions/${sessionId}`
    );
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch session detail');
  }
};