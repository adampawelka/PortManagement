import { useCallback } from 'react';
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
  const showSuccess = useCallback((message, duration = 5000) => {
    return addNotification(NOTIFICATION_TYPES.SUCCESS, message, duration);
  }, [addNotification]);

  /**
   * Show an error notification
   * @param {string} message - The message to display
   * @param {number} duration - Duration in milliseconds (default: 0 = no auto-dismiss)
   */
  const showError = useCallback((message, duration = 0) => {
    return addNotification(NOTIFICATION_TYPES.ERROR, message, duration);
  }, [addNotification]);

  /**
   * Show a warning notification
   * @param {string} message - The message to display
   * @param {number} duration - Duration in milliseconds (default: 5000)
   */
  const showWarning = useCallback((message, duration = 5000) => {
    return addNotification(NOTIFICATION_TYPES.WARNING, message, duration);
  }, [addNotification]);

  /**
   * Show an info notification
   * @param {string} message - The message to display
   * @param {number} duration - Duration in milliseconds (default: 5000)
   */
  const showInfo = useCallback((message, duration = 5000) => {
    return addNotification(NOTIFICATION_TYPES.INFO, message, duration);
  }, [addNotification]);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};