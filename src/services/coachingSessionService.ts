import { restClient } from '@/lib/axios';
import  type {
  SessionSetup,
  SessionSetupPayload,
  SessionData,
  CreateSessionForProfilePayload,
} from '@/types';
import axios from 'axios';

// A helper function for consistent error handling
const handleApiError = (error: any, context: string): never => {
  if (axios.isAxiosError(error) && error.response) {
    const errorMessage = error.response.data?.detail || error.response.data?.message || `Failed to ${context}.`;
    throw new Error(errorMessage);
  }
  throw new Error(`An unexpected error occurred while trying to ${context}.`);
};

/**
 * Creates the initial setup configuration for an interview session.
 * @param payload - The setup data (interviewer name, attitude, etc.).
 * @returns The created SessionSetup object, including its ID.
 */
export const createSessionSetup = async (payload: SessionSetupPayload): Promise<SessionSetup> => {
  try {
    const response = await restClient.post<SessionSetup>('/api/coaching/session-setup', payload);
    return response.data;
  } catch (error) {
    handleApiError(error, 'create session setup');
  }
};

/**
 * Creates the final session for a specific job profile, using a setup ID.
 * This fetches the dynamic configuration for the Nova Sonic WebSocket session.
 * @param profileId - The ID of the job profile to use.
 * @param payload - The object containing the session_setup_id.
 * @returns The final SessionData object with all the required prompts and configs.
 */
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