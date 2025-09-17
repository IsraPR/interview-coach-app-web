// src/components/common/GlobalNotification.tsx
import { useEffect } from 'react';
import { useNotificationStore } from '@/store/slices/notificationSlice';
import NotificationBanner from './NotificationBanner';
import { useShallow } from 'zustand/react/shallow';
import styles from './GlobalNotification.module.css';

const GlobalNotification = () => {
  const { isVisible, message, type, hideNotification } = useNotificationStore(
    useShallow((state) => ({
      isVisible: state.isVisible,
      message: state.message,
      type: state.type,
      hideNotification: state.hideNotification,
    }))
  );

  // This effect manages the auto-hide timer
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        hideNotification();
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, hideNotification]);

  if (!isVisible || !message) {
    return null;
  }

  return (
    <div className={styles.notificationContainer}>
      <NotificationBanner
        message={message}
        type={type}
        onClose={hideNotification}
      />
    </div>
  );
};

export default GlobalNotification;