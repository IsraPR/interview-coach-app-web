import { create } from 'zustand';
import { login as loginService } from '@/services/authService'; // We will create this next
import { LoginCredentials } from '@/types'; // And this too

// Define the shape of our state
interface AuthState {
  token: string | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  hydrateAuth: () => void;
  successMessage: string | null; // 👈 Add this
}

export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  token: null,
  status: 'idle',
  error: null,
  successMessage: null, // 👈 Add initial state

  // Action to handle login
  login: async (credentials) => {
    set({ status: 'loading', error: null, successMessage: null }); 
    try {
      const { token } = await loginService(credentials);
      set({ token, status: 'success', successMessage: 'Login successful! Redirecting...' });
      // In a real app, you'd also save the token to localStorage here
      localStorage.setItem('authToken', token);
    } catch (error: any) {
      const errorMessage = error.message || 'An unknown error occurred';
      set({ status: 'error', error: errorMessage });
    }
  },

  // Action to handle logout
  logout: () => {
    set({ token: null, status: 'idle' });
    localStorage.removeItem('authToken');
  },
  hydrateAuth: () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      set({ token, status: 'success' });
      console.log('Auth state hydrated from localStorage.');
    }
  },
}));