import React, { useState, useEffect } from 'react';
import { useApi } from '../services/api';


const DocksListPage = () => {
  const { apiFetch } = useApi();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [apiFetch]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const response = await apiFetch('/api/Docks');
      
      if (!response.ok) {
        throw new Error('Failed to fetch docks');
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
    return <div style={{ padding: '20px' }}>Loading Docks...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Docks List ({data.length})</h1>
      <pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
        {data.length > 0 ? JSON.stringify(data.slice(0, 5), null, 2) : "No Docks found."}
      </pre>
    </div>
  );
};

export default DocksListPage;