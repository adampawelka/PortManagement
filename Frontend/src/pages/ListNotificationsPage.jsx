import React, { useState, useEffect } from 'react';
import { useApi } from '../services/api';

const ListNotificationsPage = () => {
  const { apiFetch } = useApi();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [apiFetch]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const response = await apiFetch('/api/VesselVisitNotifications');
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching data:', error);
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