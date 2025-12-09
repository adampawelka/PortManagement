import { useState } from 'react';
import { useApi } from '../../services/api'; 
import { addStorageArea } from '../../services/storageAreaService'; 

export const useStorageAreaVM = () => {
  const { apiFetch } = useApi();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const addNewStorageArea = async (storageAreaDto) => {
    setLoading(true);
    setMessage(null); 

    try {
      const response = await addStorageArea(apiFetch, storageAreaDto);

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
