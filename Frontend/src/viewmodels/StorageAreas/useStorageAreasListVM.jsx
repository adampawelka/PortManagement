// src/viewmodels/StorageAreas/useStorageAreasListVM.jsx
import { useState, useEffect } from 'react';
import { useApi } from '../../services/api'; // Get the apiFetch function
import { getStorageAreas } from '../../services/storageAreaService'; // Get storage area service

export const useStorageAreasListVM = () => {
  const { apiFetch } = useApi(); // Hook to fetch API

  const [storageAreas, setStorageAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStorageAreas = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getStorageAreas(apiFetch); // Fetch storage areas data
        setStorageAreas(Array.isArray(data) ? data : []); // Ensure data is an array
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

  // You can add additional transformations if needed, like formatting dock distances, etc.

  return { storageAreas, loading, error };
};
