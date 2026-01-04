import { useState, useEffect } from 'react';
import { submitVesselVisitNotification, getVesselVisitNotifications } from '../../services/vesselVisitNotificationService';
import { useApi } from '../../services/api';
import { useFormAutoSave } from '../../hooks/useFormAutoSave';

const initialFormState = {
  notificationId: '',
};

export const useSubmitVesselVisitNotificationVM = () => {
  const { apiFetch } = useApi();
  const [formData, setFormData] = useState(initialFormState);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  // Auto-save form
  const { clearSavedData } = useFormAutoSave(
    'submit-notification-form',
    formData,
    setFormData,
    initialFormState
  );

  // Load notifications (Draft or InProgress)
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const notificationsData = await getVesselVisitNotifications(apiFetch);
        const eligible = (notificationsData || []).filter(
          n => n.status === 'Draft' || n.status === 'InProgress'
        );
        setNotifications(eligible);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.notificationId) {
      setMessage({ type: 'error', text: 'Notification is required.' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      await submitVesselVisitNotification(apiFetch, formData.notificationId);
      setMessage({ type: 'success', text: 'Notification submitted successfully!' });
      setFormData(initialFormState);

      // Reload notifications
      const updatedNotifications = await getVesselVisitNotifications(apiFetch);
      const eligible = (updatedNotifications || []).filter(
        n => n.status === 'Draft' || n.status === 'InProgress'
      );
      setNotifications(eligible);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Error submitting notification.' });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    notifications,
    loading,
    submitting,
    message,
  };
};
