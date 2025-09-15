import React from 'react';
import styles from './NotificationBanner.module.css'; // We will create this next

interface NotificationBannerProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ message, type, onClose }) => {
  // The `banner` class is always applied.
  // The `styles[type]` applies a class named 'success', 'error', or 'info'
  // based on the type prop.
  const bannerClasses = `${styles.banner} ${styles[type]}`;

  return (
    <div className={bannerClasses}>
      <span>{message}</span>
      <button onClick={onClose} className={styles.closeButton}>
        &times; 
      </button>
    </div>
  );
};

export default NotificationBanner;