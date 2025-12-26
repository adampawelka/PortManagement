import { useState } from 'react';
import { submitVesselVisitNotification } from '../../services/vesselVisitNotificationService'; 
import { useApi } from '../../services/api';
import { useNotification } from '../../hooks/useNotification';
import { useFormAutoSave } from '../../hooks/useFormAutoSave';

const initialFormState = {
  notificationId: '',
};

export const useSubmitVesselVisitNotificationVM = () => {
  const { apiFetch } = useApi();
  const { showSuccess } = useNotification();
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Auto-save form data to localStorage
  const { clearSavedData } = useFormAutoSave(
    'submit-notification-form',
    formData,
    setFormData,
    initialFormState
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.notificationId) {
      setMessage({ type: 'error', text: 'Notification ID is required.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await submitVesselVisitNotification(apiFetch, formData.notificationId); 

      if (response) {
        // Show success notification toast
        showSuccess(`Notification ${formData.notificationId} submitted successfully!`);
        // Also set message for Alert (optional - can remove later)
        setMessage({ type: 'success', text: `Notification ${formData.notificationId} submitted successfully!` });
        setFormData(initialFormState);
        // Clear saved form data after successful submission
        clearSavedData();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Error while submitting notification.' });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    message,
    handleChange,
    handleSubmit,
  };
};
