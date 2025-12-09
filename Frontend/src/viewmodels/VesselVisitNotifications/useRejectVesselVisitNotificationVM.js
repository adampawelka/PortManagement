import { useState } from 'react';
import { rejectVesselVisitNotification } from '../../services/vesselVisitNotificationService'; 
import { useApi } from '../../services/api';
export const useRejectVesselVisitNotificationVM = () => {
  const { apiFetch } = useApi();
  const [notificationId, setNotificationId] = useState('');
  const [rejectionReason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleReject = async (e) => {
    e.preventDefault();

    if (!notificationId || !rejectionReason) {
      setMessage({ type: 'error', text: 'Notification ID and Reason are required.' });
      return;
    }

    setLoading(true);
    setMessage(null);



    try {
      const rejectBodyDto = { 
        Reason: rejectionReason // El string simple que se mapea a RejectNotificationDto
      };
      const response = await rejectVesselVisitNotification(apiFetch, notificationId, rejectBodyDto); 

      if (response) {
        setMessage({ type: 'success', text: `Notification ${notificationId} rejected successfully!` });
        setNotificationId('');
        setReason('');
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Error while rejecting notification.' });
    } finally {
      setLoading(false);
    }
  };

  return {
    notificationId,
    rejectionReason,
    loading,
    message,
    setNotificationId,
    setReason,
    handleReject,
  };
};
