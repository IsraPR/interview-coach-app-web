import React, { useState } from 'react';
import { useAuthStore } from '@/store/slices/authSlice';
import { useNotificationStore } from '@/store/slices/notificationSlice';
import NotificationBanner from '@/components/common/NotificationBanner';
import { useShallow } from 'zustand/react/shallow';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, status } = useAuthStore(
    useShallow((state) => ({
      login: state.login,
      status: state.status,
    }))
  );

  // Get the notification state for displaying errors
  const { isVisible, message, type, hideNotification } = useNotificationStore(
    useShallow((state) => ({
      isVisible: state.isVisible,
      message: state.message,
      type: state.type,
      hideNotification: state.hideNotification,
    }))
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login({ email, password });
  };

  const isLoading = status === 'loading';

  return (
    <div className={styles.loginPageContainer}>
      <div className={styles.formWrapper}>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
         {/* Only show the banner if it's an error on the login page */}
          {isVisible && type === 'error' && message && (
            <NotificationBanner
              message={message}
              type={type}
              onClose={hideNotification}
            />
          )}

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <button type="submit" disabled={isLoading} className={styles.submitButton}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;