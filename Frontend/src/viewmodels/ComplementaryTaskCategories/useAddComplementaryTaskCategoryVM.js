import { useState } from 'react';
import { useApiOEM } from '../../services/api';
import { addComplementaryTaskCategory } from '../../services/complementaryTaskCategoryService';

export const useAddComplementaryTaskCategoryVM = () => {
  const { apiOemFetch } = useApiOEM(); 
  const [formData, setFormData] = useState({ code: '', name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [criticalError, setCriticalError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      await addComplementaryTaskCategory(apiOemFetch, formData); 
      setMessage({ type: 'success', text: 'Category created successfully' });
      setFormData({ code: '', name: '', description: '' });
    } catch (err) {
      if (err.message?.includes('Failed to fetch')) {
        setCriticalError(true); 
      }
      setMessage({ type: 'error', text: err.message || 'Failed to create category' });
    } finally {
      setSubmitting(false);
    }
  };

  return { formData, handleChange, handleSubmit, submitting, message, criticalError };
};
