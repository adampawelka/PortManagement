import { useNotifications } from '../contexts/NotificationContext';
import { NOTIFICATION_TYPES } from '../contexts/NotificationContext';

/**
 * Custom hook for easy notification management
 * Provides simple functions to show different types of notifications
 * 
 * @returns {Object} Object with showSuccess, showError, showWarning, showInfo functions
 */
export const useNotification = () => {
  const { addNotification } = useNotifications();

  /**
   * Show a success notification
   * @param {string} message - The message to display
   * @param {number} duration - Duration in milliseconds (default: 5000)
   */
  const showSuccess = (message, duration = 5000) => {
    return addNotification(NOTIFICATION_TYPES.SUCCESS, message, duration);
  };

  /**
   * Show an error notification
   * @param {string} message - The message to display
   * @param {number} duration - Duration in milliseconds (default: 0 = no auto-dismiss)
   */
  const showError = (message, duration = 0) => {
    return addNotification(NOTIFICATION_TYPES.ERROR, message, duration);
  };

  /**
   * Show a warning notification
   * @param {string} message - The message to display
   * @param {number} duration - Duration in milliseconds (default: 5000)
   */
  const showWarning = (message, duration = 5000) => {
    return addNotification(NOTIFICATION_TYPES.WARNING, message, duration);
  };

  /**
   * Show an info notification
   * @param {string} message - The message to display
   * @param {number} duration - Duration in milliseconds (default: 5000)
   */
  const showInfo = (message, duration = 5000) => {
    return addNotification(NOTIFICATION_TYPES.INFO, message, duration);
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};