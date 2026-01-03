import { useState, useEffect } from 'react';
import { submitVesselVisitNotification, getVesselVisitNotifications } from '../../services/vesselVisitNotificationService'; 
import { useApi } from '../../services/api';

export const useSubmitVesselVisitNotificationVM = () => {
  const { apiFetch } = useApi();
  const [notificationId, setNotificationId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const notificationsData = await getVesselVisitNotifications(apiFetch);
        // Filter notifications with "Draft" or "InProgress" status (can only submit those)
        const eligibleNotifications = (notificationsData || []).filter(
          n => n.status === 'Draft' || n.status === 'InProgress'
        );
        setNotifications(eligibleNotifications);
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to load notifications.' });
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [apiFetch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!notificationId) {
      setMessage({ type: 'error', text: 'Notification is required.' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const response = await submitVesselVisitNotification(apiFetch, notificationId); 

      if (response) {
        setMessage({ type: 'success', text: `Notification submitted successfully!` });
        setNotificationId('');
        // Reload notifications
        const updatedNotifications = await getVesselVisitNotifications(apiFetch);
        const eligibleNotifications = (updatedNotifications || []).filter(
          n => n.status === 'Draft' || n.status === 'InProgress'
        );
        setNotifications(eligibleNotifications);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Error while submitting notification.' });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    notificationId,
    loading,
    submitting,
    message,
    notifications,
    setNotificationId,
    handleSubmit,
  };
};
