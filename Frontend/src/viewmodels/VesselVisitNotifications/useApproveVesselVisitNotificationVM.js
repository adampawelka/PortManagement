import { useState, useEffect } from 'react';
import { useApi } from '../../services/api';
import { approveVesselVisitNotification, getVesselVisitNotifications } from '../../services/vesselVisitNotificationService';
import { getDocks } from '../../services/dockService';
import { useNotification } from '../../hooks/useNotification';
import { useFormAutoSave } from '../../hooks/useFormAutoSave';

const initialFormState = {
  notificationId: '',
  dockID: '',
};

export const useApproveVesselVisitNotificationVM = () => {
  const { apiFetch } = useApi();
  const { showSuccess } = useNotification();

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [docks, setDocks] = useState([]);

  // Auto-save form data
  const { clearSavedData } = useFormAutoSave('approve-notification-form', formData, setFormData, initialFormState);

  // Load notifications and docks
  useEffect(() => {
    const loadData = async () => {
      try {
        const [notificationsData, docksData] = await Promise.all([
          getVesselVisitNotifications(apiFetch),
          getDocks(apiFetch),
        ]);

        setNotifications((notificationsData || []).filter(n => n.status === 'Submitted'));
        setDocks(docksData || []);
      } catch (err) {
        setMessage({ type: 'error', text: 'Failed to load notifications or docks.' });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [apiFetch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleApprove = async (e) => {
    e.preventDefault();

    if (!formData.notificationId) {
      setMessage({ type: 'error', text: 'Notification is required.' });
      return;
    }
    if (!formData.dockID) {
      setMessage({ type: 'error', text: 'Dock is required.' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    const updateDto = { status: 'Approved', DockId: formData.dockID };

    try {
      await approveVesselVisitNotification(apiFetch, formData.notificationId, updateDto);
      setMessage({ type: 'success', text: `Notification approved successfully!` });
      showSuccess(`Notification ${formData.notificationId} approved successfully!`);
      setFormData(initialFormState);
      clearSavedData();

      // Reload notifications
      const updatedNotifications = await getVesselVisitNotifications(apiFetch);
      setNotifications((updatedNotifications || []).filter(n => n.status === 'Submitted'));
    } catch (err) {
      setMessage({ type: 'error', text: `Approval failed: ${err.message}` });
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
    docks,
    handleChange,
    handleApprove,
  };
};
