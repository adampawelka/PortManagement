import { useState } from 'react';
import { useApi } from '../services/api';
import { searchVessels } from '../services/vesselService';

export const useVesselsSearchVM = () => {
  const { apiFetch } = useApi();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSearch = async ({ imo, name, ownerId } = {}) => {
    setLoading(true);
    setMessage(null);
    setResults([]);

    // Require at least one search field
    if (!imo && !name && !ownerId) {
      setMessage({ type: 'warning', text: 'Please provide at least one search criteria.' });
      setLoading(false);
      return;
    }

    try {
      const data = await searchVessels(apiFetch, { imo, name, ownerId });

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
