import { useState } from 'react';
import { rejectVesselVisitNotification } from '../../services/vesselVisitNotificationService'; 
import { useApi } from '../../services/api';
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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Auto-save form data to localStorage
  const { clearSavedData } = useFormAutoSave(
    'reject-notification-form',
    formData,
    setFormData,
    initialFormState
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleReject = async (e) => {
    e.preventDefault();

    if (!formData.notificationId || !formData.rejectionReason) {
      setMessage({ type: 'error', text: 'Notification ID and Reason are required.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const rejectBodyDto = { 
        Reason: formData.rejectionReason // El string simple que se mapea a RejectNotificationDto
      };
      const response = await rejectVesselVisitNotification(apiFetch, formData.notificationId, rejectBodyDto); 

      if (response) {
        // Show success notification toast
        showSuccess(`Notification ${formData.notificationId} rejected successfully!`);
        // Also set message for Alert (optional - can remove later)
        setMessage({ type: 'success', text: `Notification ${formData.notificationId} rejected successfully!` });
        setFormData(initialFormState);
        // Clear saved form data after successful submission
        clearSavedData();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Error while rejecting notification.' });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    message,
    handleChange,
    handleReject,
  };
};
