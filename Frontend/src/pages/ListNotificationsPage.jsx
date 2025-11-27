import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

// Ajusta esta URL si tu API corre en un puerto diferente
const API_URL = 'http://localhost:5000/api'; 

const ListNotificationsPage = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const token = await getAccessTokenSilently();
      
      // Llama a la API con el filtro ?status=Pending
      const response = await fetch(`${API_URL}/VesselVisitNotifications`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      // alert('Failed to load pending notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading Notifications...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Vessel Visit Notifications ({notifications.length})</h1>
      {/* Tabla o Lista de Notificaciones */}
      <pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
        {notifications.length > 0 ? JSON.stringify(notifications.slice(0, 5), null, 2) : "No notifications found."}
      </pre>
    </div>
  );
};

export default ListNotificationsPage;