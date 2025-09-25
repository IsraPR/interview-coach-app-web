import { restClient } from '@/lib/axios';
import type { User, Resume, ResumePayload } from '@/types';
import axios from 'axios';

export const getProfile = async (): Promise<User> => {
  try {
    const response = await restClient.get<User>('/api/users/profile');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.detail || 'Could not fetch user profile.');
    }
    throw new Error('An unexpected error occurred while fetching the profile.');
  }
};

export const getResume = async (): Promise<Resume | null> => {
  try {
    const response = await restClient.get<Resume>('/api/user/resume');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      // It's not an error if the user simply hasn't created a resume yet.
      return null;
    }
    // For all other errors, we throw.
    throw new Error('Failed to fetch resume.');
  }
};


export const createResume = async (payload: ResumePayload): Promise<Resume> => {
  try {
    const response = await restClient.post<Resume>('/api/user/resume', payload);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create resume.');
  }
};

export const updateResume = async (payload: ResumePayload): Promise<Resume> => {
  try {
    const response = await restClient.put<Resume>('/api/user/resume', payload);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update resume.');
  }
};