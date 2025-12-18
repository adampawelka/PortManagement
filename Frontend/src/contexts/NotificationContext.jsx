import React, { createContext, useContext, useState, useCallback } from "react";

export const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

// Notification structure 
// { id, type, message, duration, createdAt }

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const MAX_VISIBLE = 5; // Maximum notifications visible at once

    // Remove notification - define first so it can be used in addNotification
    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    // Add new notification with deduplication
    const addNotification = useCallback((type, message, duration = 5000) => {
        const now = Date.now();
        const DEDUPE_WINDOW = 2000; // 2 seconds - ignore duplicates within this window
        const id = now + Math.random(); // Generate ID upfront

        setNotifications(prev => {
            // Check if there's a duplicate notification (same type and message) created recently
            const isDuplicate = prev.some(n => 
                n.type === type && 
                n.message === message && 
                (now - n.createdAt) < DEDUPE_WINDOW
            );

            // If duplicate found, don't add it
            if (isDuplicate) {
                return prev;
            }

            // Create new notification
            const notification = {
                id,
                type,
                message,
                duration,
                createdAt: now // Track when notification was created for timer
            };

            const updated = [...prev, notification];
            // Keep only the last MAX_VISIBLE notifications
            const limited = updated.slice(-MAX_VISIBLE);
            
            // Auto-remove after duration
            if (duration > 0) {
                setTimeout(() => {
                    removeNotification(id);
                }, duration);
            }

            return limited;
        });

        return id;
    }, [removeNotification]);

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
