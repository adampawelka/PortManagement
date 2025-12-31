import { useState, useEffect } from 'react';
import { getComplementaryTaskCategoryById, editComplementaryTaskCategory } from '../../services/complementaryTaskCategoryService';

export const useEditComplementaryTaskCategoryVM = (id) => {
  const [formData, setFormData] = useState({ code: '', name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [criticalError, setCriticalError] = useState(false);

  const fetchCategory = async () => {
    setLoading(true);
    try {
      const data = await getComplementaryTaskCategoryById(fetch, id);
      setFormData({ code: data.code, name: data.name, description: data.description });
    } catch (err) {
      setCriticalError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      await editComplementaryTaskCategory(fetch, id, formData);
      setMessage({ type: 'success', text: 'Category edited successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return { formData, handleChange, handleSubmit, loading, submitting, message, criticalError, fetchCategory };
};
