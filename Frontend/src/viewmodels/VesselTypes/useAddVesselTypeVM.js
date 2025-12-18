import { useState } from 'react';
import { useApi } from '../../services/api';
import { addVesselType } from '../../services/vesselTypeService';
import { useNotification } from '../../hooks/useNotification';

const initialFormState = {
  name: '',
  description: '',
  capacity: 0,
  maxRows: 0,
  maxBays: 0,
  maxTiers: 0,
};

export const useAddVesselTypeVM = () => {
  const { apiFetch } = useApi();
  const { showSuccess } = useNotification();

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'capacity' || name.startsWith('max') ? parseInt(value, 10) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!formData.name || !formData.capacity) {
      setMessage({ type: 'error', text: 'Name and Capacity are required.' });
      setLoading(false);
      return;
    }

    const vesselTypeDto = {
      Name: formData.name,
      Description: formData.description,
      Capacity: formData.capacity,
      Constraints: {
        MaxRows: formData.maxRows,
        MaxBays: formData.maxBays,
        MaxTiers: formData.maxTiers,
      }
    };

    try {
      await addVesselType(apiFetch, vesselTypeDto);
      // Show success notification toast
      showSuccess('Vessel Type created successfully!');
      // Also set message for Alert (optional - can remove later)
      setMessage({ type: 'success', text: 'Vessel Type created successfully!' });
      setFormData(initialFormState);
    } catch (err) {
      // Error notifications are already handled by api.js
      setMessage({ type: 'error', text: err.message });
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
