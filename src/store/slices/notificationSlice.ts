import { create } from 'zustand';

type NotificationType = 'success' | 'error' | 'info';

interface NotificationState {
  message: string | null;
  type: NotificationType;
  isVisible: boolean;
  showNotification: (message: string, type?: NotificationType) => void;
  hideNotification: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  message: null,
  type: 'info',
  isVisible: false,

  showNotification: (message, type = 'info') => {
    set({ message, type, isVisible: true });
  },

  hideNotification: () => {
    set({ message: null, isVisible: false });
  },
}));