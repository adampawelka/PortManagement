import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const API_URL = 'http://localhost:5000/api'; 

const VesselTypePage = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const token = await getAccessTokenSilently();
      
      // Llama a la API sin filtro: /VesselTypes
      const response = await fetch(`${API_URL}/VesselTypes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
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
    return <div style={{ padding: '20px' }}>Loading VesselTypes...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Vessel Types List ({data.length})</h1>
      <pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
        {data.length > 0 ? JSON.stringify(data.slice(0, 5), null, 2) : "No VesselTypes found."}
      </pre>
    </div>
  );
};

export default VesselTypePage;