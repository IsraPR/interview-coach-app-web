import { restClient } from '@/lib/axios';
import type { LoginCredentials, LoginResponse } from '@/types';
import axios from 'axios'; // Import axios to use its type guards

// This is the REAL login function.
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    // Use the restClient to make a POST request to the /api/login endpoint
    const response = await restClient.post<LoginResponse>('/api/login', credentials);
    
    // Axios wraps the response data in a `data` property
    return response.data;

  } catch (error: any) {
    // This is a robust way to handle errors from Axios
    if (axios.isAxiosError(error) && error.response) {
      // The backend likely sent a response with an error message
      // e.g., { message: "Invalid credentials" }
      const errorMessage = error.response.data?.message || 'Invalid credentials.';
      throw new Error(errorMessage);
    } else {
      // This handles network errors or other unexpected issues
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
};