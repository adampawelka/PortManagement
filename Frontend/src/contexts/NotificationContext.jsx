import React, { createContext, useContext, useState, useCallback } from "react";

export const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

// Notification structure 
// { id, type, message, duration }

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const MAX_VISIBLE = 5; // Maximum notifications visible at once

    // Add new notification
    const addNotification = useCallback((type, message, duration = 5000) => {
        const id = Date.now() + Math.random(); // Unique id for notification

        const notification = {
            id,
            type,
            message,
            duration
        };

        setNotifications(prev => {
            const updated = [...prev, notification];
            // Keep only the last MAX_VISIBLE notifications
            return updated.slice(-MAX_VISIBLE);
        });

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }

        return id;
    }, []);

    // Remove notification
    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    // Clear all notifications
    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);
    
    const value = {
        notifications,
        addNotification,
        removeNotification,
        clearAll
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
            </NotificationContext.Provider>
    );
};

// Custom hook to use notifications
export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
      throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
  };
