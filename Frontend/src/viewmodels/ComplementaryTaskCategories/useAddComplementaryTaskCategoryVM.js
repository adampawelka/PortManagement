import { useState } from 'react';
import { addComplementaryTaskCategory } from '../../services/complementaryTaskCategoryService';

export const useAddComplementaryTaskCategoryVM = () => {
  const [formData, setFormData] = useState({ code: '', name: '', description: '' });
  const [loading, setLoading] = useState(false);
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
      await addComplementaryTaskCategory(fetch, formData);
      setMessage({ type: 'success', text: 'Category created successfully' });
      setFormData({ code: '', name: '', description: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return { formData, handleChange, handleSubmit, loading, submitting, message, criticalError };
};
