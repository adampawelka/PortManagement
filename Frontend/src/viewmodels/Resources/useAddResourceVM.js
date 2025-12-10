// src/viewmodels/Resources/useAddResourceViewModel.js
import { useState, useEffect } from 'react';
import { useApi } from '../../services/api';  // Assuming apiFetch is from the useApi hook
import { addResource } from '../../services/resourceService';  // Import the service function for adding resources

const initialFormState = {
  code: '',
  description: '',
  type: '',
  capacity: '',
  status: '',
  setupTime: '',
};

export const useAddResourceVM = () => {
  const { apiFetch } = useApi(); 
  const [formData, setFormData] = useState(initialFormState);  
  const [loading, setLoading] = useState(true);  
  const [submitting, setSubmitting] = useState(false);  
  const [message, setMessage] = useState(null);  
  const [criticalError, setCriticalError] = useState(false);  
  
  useEffect(() => {
    const loadInitialData = async () => {
      try {;
      } catch (err) {
        console.error('Failed to fetch critical data:', err);
        setMessage({ type: 'error', text: 'Cannot fetch critical data. Form disabled.' });
        setCriticalError(true);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [apiFetch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (criticalError) return;

    setSubmitting(true);
    setMessage(null);

    if (!formData.code || !formData.type || !formData.capacity) {
      setMessage({ type: 'error', text: 'Code, Type, and Capacity are required.' });
      setSubmitting(false);
      return;
    }

    const resourceDto = {
      Code: formData.code,
      Description: formData.description,
      Type: formData.type,
      Capacity: parseFloat(formData.capacity) || 0,
      Status: formData.status,
      SetupTime: parseInt(formData.setupTime) || 0,
    };

    try {
      await addResource(apiFetch, resourceDto);
      setMessage({ type: 'success', text: 'Resource added successfully!' });
      setFormData(initialFormState);  // Reset form
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to add resource' });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    loading,
    submitting,
    message,
    criticalError,
    handleChange,
    handleSubmit,
  };
};
