import { useState, useEffect } from 'react';
import { useApi } from '../services/api';
import { getVesselVisitNotifications } from '../services/vesselVisitNotificationService';  

export const useVesselVisitNotificationsVM = () => {
  const { apiFetch } = useApi();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getVesselVisitNotifications(apiFetch);
        setNotifications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch vessel visit notifications:', err);
        setError(`Failed to load notifications: ${err.message}`);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [apiFetch]);

  return { notifications, loading, error };
};
