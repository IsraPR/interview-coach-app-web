import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/slices/authSlice';
import ErrorBanner from '@/components/common/ErrorBanner';
import { useShallow } from 'zustand/react/shallow';
import SuccessBanner from '@/components/common/SuccessBanner';

const LoginPage = () => {
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Local state for the form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Get state and actions from our Zustand store
  const { login, status, error, successMessage } = useAuthStore( // 👈 Get successMessage
    useShallow((state) => ({
      login: state.login,
      status: state.status,
      error: state.error,
      successMessage: state.successMessage, // 👈 Select it
    }))
  );
  // Effect to redirect on successful login
  useEffect(() => {
    if (status === 'success') {
      console.log('Login successful, redirecting to home...');
      navigate('/');
    }
  }, [status, navigate]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    login({ email, password });
  };

  const isLoading = status === 'loading';

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        {/* Show error banner if there's an error */}
        <ErrorBanner message={error} />
        <SuccessBanner message={successMessage} />
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="email">Email</label>
          <br />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="password">Password</label>
          <br />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;