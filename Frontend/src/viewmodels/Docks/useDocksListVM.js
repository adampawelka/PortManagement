import { useState, useEffect } from 'react';
import { useApi } from '../../services/api';
import { getDocks } from '../../services/dockService';

export const useDocksVM = () => {
  const { apiFetch } = useApi();

  const [docks, setDocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDocks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDocks(apiFetch);
      setDocks(Array.isArray(data) ? data : data ? [data] : []);
    } catch (err) {
      console.error('Error fetching docks:', err);
      setError(err.message || 'Failed to load docks');
      setDocks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocks();
  }, []);

  // Helper to render allowed vessel types
  const renderAllowedVesselTypes = (types) => {
    if (!types || types.length === 0) return 'No restrictions';
    return types.map((type) => type.name || 'Unknown Type').join(', ');
  };

  return {
    docks,
    loading,
    error,
    renderAllowedVesselTypes,
    reload: loadDocks,
  };
};
