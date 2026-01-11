import { useState, useEffect } from 'react';
import { useApiOEM } from '../../services/api';
import { getComplementaryTaskCategoryById, editComplementaryTaskCategory } from '../../services/complementaryTaskCategoryService';

export const useEditComplementaryTaskCategoryVM = (categoryId) => {
  const { apiOemFetch } = useApiOEM();
  const [formData, setFormData] = useState({ code: '', name: '', description: '', defaultDuration: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
  const fetchCategory = async () => {
    if (!categoryId || categoryId === 'undefined') {
      setLoading(false);
      return; 
    }

    setLoading(true);
    try {
      const data = await getComplementaryTaskCategoryById(apiOemFetch, categoryId);
      setFormData({
        code: data.code || '',
        name: data.name || '',
        description: data.description || '',
        defaultDuration: data.defaultDuration || '',
      });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to fetch category data.' });
    } finally {
      setLoading(false);
    }
  };

  fetchCategory();
}, [apiOemFetch, categoryId]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      await editComplementaryTaskCategory(apiOemFetch, categoryId, formData);
      setMessage({ type: 'success', text: 'Category updated successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update category' });
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = formData.code && formData.name && formData.description;

  return {
    formData,
    handleChange,
    handleSubmit,
    loading,
    submitting,
    message,
    isFormValid,
  };
};
