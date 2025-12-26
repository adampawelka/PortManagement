import { useState } from 'react';
import { useApi } from '../../services/api'; 
import { addStorageArea } from '../../services/storageAreaService';
import { useNotification } from '../../hooks/useNotification'; 

export const useStorageAreaVM = () => {
  const { apiFetch } = useApi();
  const { showSuccess } = useNotification();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const addNewStorageArea = async (storageAreaDto) => {
    setLoading(true);
    setMessage(null); 

    try {
      const response = await addStorageArea(apiFetch, storageAreaDto);
      // Show success notification toast
      showSuccess('Storage Area created successfully!');
      // Also set message for Alert (optional - can remove later)
      setMessage({ type: 'success', text: 'Storage Area created successfully!' });

      return response;
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to create storage area.' });
      throw err; 
    } finally {
      setLoading(false);
    }
  };

  return { addNewStorageArea, loading, message };
};
