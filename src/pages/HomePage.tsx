import { useEffect } from 'react';
import { useNotificationStore } from '@/store/slices/notificationSlice';
import NotificationBanner from '@/components/common/NotificationBanner';
import { useShallow } from 'zustand/react/shallow';

const HomePage = () => {
  // Subscribe to the notification store
  const { isVisible, message, type, hideNotification } = useNotificationStore(
    useShallow((state) => ({
      isVisible: state.isVisible,
      message: state.message,
      type: state.type,
      hideNotification: state.hideNotification,
    }))
  );

  // This effect manages the 10-second timer
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        hideNotification();
      }, 10000); // 10 seconds

      // This is a cleanup function. It runs if the component unmounts
      // before the timer finishes, preventing memory leaks.
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isVisible, hideNotification]);

  return (
    <div>
      {/* Conditionally render the banner at the top of the page */}
      {isVisible && message && (
        <NotificationBanner
          message={message}
          type={type}
          onClose={hideNotification} // Wire up the manual close button
        />
      )}

      <h1>Welcome to the Home Page!</h1>
      <p>This is your protected content.</p>
    </div>
  );
};

export default HomePage;