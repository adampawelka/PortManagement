import { useState } from 'react';
import { submitVesselVisitNotification } from '../../services/vesselVisitNotificationService'; 
import { useApi } from '../../services/api';

export const useSubmitVesselVisitNotificationVM = () => {
  const { apiFetch } = useApi();
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
