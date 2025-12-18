import React from 'react';
import { Snackbar, Alert, AlertTitle } from '@mui/material';
import { useNotifications } from '../../contexts/NotificationContext';

const NotificationToast = () => {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) {
    return null; // Don't render anything if no notifications
  }

  return (
    <>
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={notification.duration}
          onClose={() => removeNotification(notification.id)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{
            '&:not(:last-child)': {
              marginBottom: '8px'
            }
          }}
        >
          <Alert
            severity={notification.type}
            onClose={() => removeNotification(notification.id)}
            sx={{ width: '100%' }}
            aria-live={notification.type === 'error' ? 'assertive' : 'polite'}
            role={notification.type === 'error' ? 'alert' : 'status'}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default NotificationToast;