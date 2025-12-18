import { useState } from 'react';
import { submitVesselVisitNotification } from '../../services/vesselVisitNotificationService'; 
import { useApi } from '../../services/api';
import { useNotification } from '../../hooks/useNotification';

export const useSubmitVesselVisitNotificationVM = () => {
  const { apiFetch } = useApi();
  const { showSuccess } = useNotification();
  const [notificationId, setNotificationId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!notificationId) {
      setMessage({ type: 'error', text: 'Notification ID is required.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await submitVesselVisitNotification(apiFetch, notificationId); 

      if (response) {
        // Show success notification toast
        showSuccess(`Notification ${notificationId} submitted successfully!`);
        // Also set message for Alert (optional - can remove later)
        setMessage({ type: 'success', text: `Notification ${notificationId} submitted successfully!` });
        setNotificationId(''); 
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Error while submitting notification.' });
    } finally {
      setLoading(false);
    }
  };

  return {
    notificationId,
    loading,
    message,
    setNotificationId,
    handleSubmit,
  };
};
