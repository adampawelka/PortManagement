import { useState, useEffect } from 'react';
import { useApi } from '../../services/api';
import { getVessels } from '../../services/vesselService';

export const useVesselsListVM = () => {
  const { apiFetch } = useApi();

  const [vessels, setVessels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVessels = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getVessels(apiFetch);
        setVessels(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch vessels:', err);
        setError(`Failed to load vessels: ${err.message}`);
        setVessels([]);
      } finally {
        setLoading(false);
      }
    };

    loadVessels();
  }, [apiFetch]);

  return { vessels, loading, error };
};
