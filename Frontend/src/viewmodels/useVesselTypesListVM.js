import { useState, useEffect } from 'react';
import { useApi } from '../services/api';
import { getVesselTypes } from '../services/vesselTypeService';

export const useVesselTypesListVM = () => {
  const { apiFetch } = useApi();
  const [vesselTypes, setVesselTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVesselTypes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getVesselTypes(apiFetch); 
        setVesselTypes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch vessel types:', err);
        setError(`Failed to load vessel types: ${err.message}`);
        setVesselTypes([]);
      } finally {
        setLoading(false);
      }
    };

    loadVesselTypes();
  }, [apiFetch]);

  return { vesselTypes, loading, error };
};
