import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, LinearProgress } from '@mui/material';
import { useNotifications } from '../../contexts/NotificationContext';

// Component to display countdown progress bar
const NotificationProgressBar = ({ notification }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // If duration is 0 (error notifications), don't show progress bar
    if (notification.duration === 0) {
      return;
    }

    const updateProgress = () => {
      const elapsed = Date.now() - notification.createdAt;
      const remaining = Math.max(0, notification.duration - elapsed);
      const progressPercent = (remaining / notification.duration) * 100;
      setProgress(Math.max(0, Math.min(100, progressPercent)));
    };

    // Update immediately
    updateProgress();

    // Update frequently for smooth animation (every 50ms)
    const interval = setInterval(updateProgress, 50);

    return () => clearInterval(interval);
  }, [notification.duration, notification.createdAt]);

  // Don't show progress bar for error notifications (duration = 0)
  if (notification.duration === 0) {
    return null;
  }

  // Map notification type to progress bar color
  const getProgressBarColor = (type) => {
    switch (type) {
      case 'success':
        return '#4caf50'; // Green
      case 'error':
        return '#f44336'; // Red
      case 'warning':
        return '#ff9800'; // Orange
      case 'info':
        return '#2196f3'; // Blue
      default:
        return '#2196f3'; // Default to blue
    }
  };

  const barColor = getProgressBarColor(notification.type);

  return (
    <LinearProgress
      variant="determinate"
      value={progress}
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '3px',
        borderRadius: '0 0 4px 4px',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        '& .MuiLinearProgress-bar': {
          borderRadius: '0 0 4px 4px',
          backgroundColor: barColor,
        },
      }}
    />
  );
};

const NotificationToast = () => {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) {
    return null; // Don't render anything if no notifications
  }

  // Calculate bottom position for stacking (each notification is ~70px tall + 8px gap)
  const NOTIFICATION_HEIGHT = 70;
  const GAP = 8;
  const BASE_BOTTOM = 24; // Base distance from bottom

  return (
    <>
      {notifications.map((notification, index) => {
        // Calculate bottom position: newer notifications appear higher
        // Reverse index so newest (last in array) appears at the bottom
        const bottomPosition = BASE_BOTTOM + (notifications.length - 1 - index) * (NOTIFICATION_HEIGHT + GAP);
        
        return (
          <Snackbar
            key={notification.id}
            open={true}
            autoHideDuration={notification.duration > 0 ? notification.duration : null}
            onClose={(event, reason) => {
              // Don't close on clickaway (clicking outside) or escape key
              // Only close on timeout (handled by autoHideDuration)
              if (reason === 'clickaway' || reason === 'escapeKeyDown') {
                return;
              }
              removeNotification(notification.id);
            }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            sx={{
              bottom: `${bottomPosition}px !important`,
              position: 'fixed',
            }}
          >
            <Alert
              severity={notification.type}
              onClose={(event) => {
                event.stopPropagation(); // Prevent Snackbar from handling the event
                removeNotification(notification.id);
              }}
              sx={{ 
                width: '100%',
                minWidth: '300px',
                maxWidth: '500px',
                position: 'relative',
                overflow: 'hidden',
              }}
              aria-live={notification.type === 'error' ? 'assertive' : 'polite'}
              role={notification.type === 'error' ? 'alert' : 'status'}
            >
              {notification.message}
              <NotificationProgressBar notification={notification} />
            </Alert>
          </Snackbar>
        );
      })}
    </>
  );
};

export default NotificationToast;