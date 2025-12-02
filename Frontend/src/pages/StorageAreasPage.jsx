import React, { useState, useEffect } from 'react';
import { useApi } from '../services/api';

const StorageAreasPage = () => {
  const { apiFetch } = useApi();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [apiFetch]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const response = await apiFetch('/api/StorageAreas');
      
      if (!response.ok) {
        throw new Error('Failed to fetch storage areas');
      }
      
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading Storage Areas...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Storage Areas List ({data.length})</h1>
      <pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
        {data.length > 0 ? JSON.stringify(data.slice(0, 5), null, 2) : "No Storage Areas found."}
      </pre>
    </div>
  );
};

export default StorageAreasPage;