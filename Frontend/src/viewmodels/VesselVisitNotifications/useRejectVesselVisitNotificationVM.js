import { useState, useEffect } from 'react';
import { useApi } from '../../services/api';
import { getVesselVisitNotifications, rejectVesselVisitNotification } from '../../services/vesselVisitNotificationService';
import { useNotification } from '../../hooks/useNotification';
import { useFormAutoSave } from '../../hooks/useFormAutoSave';

const initialFormState = {
  notificationId: '',
  rejectionReason: '',
};

export const useRejectVesselVisitNotificationVM = () => {
  const { apiFetch } = useApi();
  const { showSuccess } = useNotification();

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Auto-save form
  const { clearSavedData } = useFormAutoSave(
    'reject-notification-form',
    formData,
    setFormData,
    initialFormState
  );

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const notificationsData = await getVesselVisitNotifications(apiFetch);
        const submittedNotifications = (notificationsData || []).filter(
          n => n.status === 'Submitted'
        );
        setNotifications(submittedNotifications);
      } catch (err) {
        setMessage({ type: 'error', text: 'Failed to load notifications.' });
      } finally {
        setLoading(false);
      }
    };
    loadNotifications();
  }, [apiFetch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleReject = async (e) => {
    e.preventDefault();

    if (!formData.notificationId || !formData.rejectionReason) {
      setMessage({ type: 'error', text: 'Notification and Reason are required.' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const rejectBodyDto = { Reason: formData.rejectionReason };
      await rejectVesselVisitNotification(apiFetch, formData.notificationId, rejectBodyDto);

      showSuccess(`Notification rejected successfully!`);
      setMessage({ type: 'success', text: 'Notification rejected successfully!' });
      setFormData(initialFormState);
      clearSavedData();

      // Reload notifications
      const updatedNotifications = await getVesselVisitNotifications(apiFetch);
      setNotifications((updatedNotifications || []).filter(n => n.status === 'Submitted'));
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Error while rejecting notification.' });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    loading,
    submitting,
    message,
    notifications,
    handleChange,
    handleReject,
  };
};
