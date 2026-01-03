import { useState, useEffect } from 'react';
import { rejectVesselVisitNotification, getVesselVisitNotifications } from '../../services/vesselVisitNotificationService'; 
import { useApi } from '../../services/api';

export const useRejectVesselVisitNotificationVM = () => {
  const { apiFetch } = useApi();
  const [notificationId, setNotificationId] = useState('');
  const [rejectionReason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const notificationsData = await getVesselVisitNotifications(apiFetch);
        // Filter notifications with "Submitted" status only (can only reject submitted ones)
        const submittedNotifications = (notificationsData || []).filter(
          n => n.status === 'Submitted'
        );
        setNotifications(submittedNotifications);
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to load notifications.' });
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [apiFetch]);

  const handleReject = async (e) => {
    e.preventDefault();

    if (!notificationId || !rejectionReason) {
      setMessage({ type: 'error', text: 'Notification and Reason are required.' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const rejectBodyDto = { 
        Reason: rejectionReason
      };
      const response = await rejectVesselVisitNotification(apiFetch, notificationId, rejectBodyDto); 

      if (response) {
        setMessage({ type: 'success', text: `Notification rejected successfully!` });
        setNotificationId('');
        setReason('');
        // Reload notifications
        const updatedNotifications = await getVesselVisitNotifications(apiFetch);
        const submittedNotifications = (updatedNotifications || []).filter(
          n => n.status === 'Submitted'
        );
        setNotifications(submittedNotifications);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Error while rejecting notification.' });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    notificationId,
    rejectionReason,
    loading,
    submitting,
    message,
    notifications,
    setNotificationId,
    setReason,
    handleReject,
  };
};
