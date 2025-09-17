import { restClient } from '@/lib/axios';
import type { User } from '@/types';
import axios from 'axios';

export const getProfile = async (): Promise<User> => {
  try {
    // Our Axios instance (`restClient`) automatically adds the auth token
    // from localStorage, so this request will be authenticated.
    const response = await restClient.get<User>('/api/users/profile');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Handle cases like token expiration (e.g., 401 Unauthorized)
      throw new Error(error.response.data?.detail || 'Could not fetch user profile.');
    }
    throw new Error('An unexpected error occurred while fetching the profile.');
  }
};