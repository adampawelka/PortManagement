// src/viewmodels/useRejectVvnPageVM.js
import { useState } from 'react';
import { rejectVesselVisitNotification } from '../services/vesselVisitNotificationService'; // Importujemy serwis

export const useRejectVesselVisitNotificationVM = () => {
  const [notificationId, setNotificationId] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleReject = async (e) => {
    e.preventDefault();

    if (!notificationId || !reason) {
      setMessage({ type: 'error', text: 'Notification ID and Reason are required.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await rejectVesselVisitNotification(notificationId, reason); // Wywołanie serwisu

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
    reason,
    loading,
    message,
    setNotificationId,
    setReason,
    handleReject,
  };
};
