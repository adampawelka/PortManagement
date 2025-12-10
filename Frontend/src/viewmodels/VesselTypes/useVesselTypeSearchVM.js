import { useState } from 'react';
import { useApi } from '../../services/api';
import { searchVesselTypes } from '../../services/vesselTypeService';

export const useVesselTypeSearchVM = () => {
  const { apiFetch } = useApi();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSearch = async ({ name, description, minCapacity, maxCapacity } = {}) => {
    setLoading(true);
    setMessage(null);
    setResults([]);

    const hasName = name?.trim().length > 0;
    const hasDescription = description?.trim().length > 0;
    const hasMinCapacity = minCapacity !== undefined && minCapacity !== null;
    const hasMaxCapacity = maxCapacity !== undefined && maxCapacity !== null;

    if (!hasName && !hasDescription && !hasMinCapacity && !hasMaxCapacity) {
      setMessage({ type: 'warning', text: 'Please provide at least one search criteria.' });
      setLoading(false);
      return;
    }

    try {
      const data = await searchVesselTypes(apiFetch, { 
        name: hasName ? name.trim() : undefined,
        description: hasDescription ? description.trim() : undefined,
        minCapacity: hasMinCapacity ? minCapacity : undefined,
        maxCapacity: hasMaxCapacity ? maxCapacity : undefined,
      });

      if (!data || data.length === 0) {
        setMessage({ type: 'info', text: 'No vessels found matching your criteria.' });
      }

      setResults(data);
    } catch (err) {
      console.error('Search Error:', err);
      setMessage({ type: 'error', text: `Search failed: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  return {
    results,
    loading,
    message,
    handleSearch,
  };
};
