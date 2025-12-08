import { useState, useEffect } from 'react';
import { useApi } from '../../services/api'; 
import { getStorageAreas } from '../../services/storageAreaService'; 

export const useStorageAreasListVM = () => {
  const { apiFetch } = useApi(); 

  const [storageAreas, setStorageAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStorageAreas = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getStorageAreas(apiFetch); 
        setStorageAreas(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch storage areas:', err);
        setError(`Failed to load storage areas: ${err.message}`);
        setStorageAreas([]);
      } finally {
        setLoading(false);
      }
    };

    loadStorageAreas();
  }, [apiFetch]);


  return { storageAreas, loading, error };
};
