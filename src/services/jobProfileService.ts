import { restClient } from '@/lib/axios';
import type { JobProfile, CreateJobProfilePayload, UpdateJobProfilePayload } from '@/types';
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
 * Fetches all job profiles for the current user.
 */
export const getProfiles = async (): Promise<JobProfile[]> => {
  try {
    const response = await restClient.get<JobProfile[]>('/api/coaching/job-profiles');
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch job profiles');
  }
};

/**
 * Fetches a single job profile by its ID.
 */
export const getProfileById = async (profileId: number): Promise<JobProfile> => {
  try {
    const response = await restClient.get<JobProfile>(`/api/coaching/job-profiles/${profileId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch job profile');
  }
};

/**
 * Creates a new job profile.
 */
export const createProfile = async (payload: CreateJobProfilePayload): Promise<JobProfile> => {
  try {
    const response = await restClient.post<JobProfile>('/api/coaching/job-profiles', payload);
    return response.data;
  } catch (error) {
    handleApiError(error, 'create job profile');
  }
};

/**
 * Updates an existing job profile.
 */
export const updateProfile = async (profileId: number, payload: UpdateJobProfilePayload): Promise<JobProfile> => {
  try {
    const response = await restClient.put<JobProfile>(`/api/coaching/job-profiles/${profileId}`, payload);
    return response.data;
  } catch (error) {
    handleApiError(error, 'update job profile');
  }
};

/**
 * Deletes a job profile by its ID.
 * The DELETE request might not return a body, so the promise is of type void.
 */
export const deleteProfile = async (profileId: number): Promise<void> => {
  try {
    await restClient.delete(`/api/coaching/job-profiles/${profileId}`);
  } catch (error) {
    handleApi-error(error, 'delete job profile');
  }
};