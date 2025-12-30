import { useState, useEffect } from "react";
import * as IncidentTypeService from "../../services/incidentTypeService";

export const useIncidentTypesListVM = () => {
  const [incidentTypes, setIncidentTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchIncidentTypes = async () => {
    setLoading(true);
    setError(null);

    try {
      // Try fetching from API using fetch directly
      const data = await IncidentTypeService.getIncidentTypes(fetch);
      setIncidentTypes(data);
    } catch (e) {
      console.warn("Failed to fetch from API, using mock data.", e);
      setError("Failed to fetch incident types from server. Displaying mock data.");

      // Use mock data
      const mockData = IncidentTypeService.generateMockIncidentTypes(10);
      setIncidentTypes(mockData);
    } finally {
      setLoading(false);
    }
  };

  const deleteIncidentType = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/incidentTypes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Failed to delete (status ${res.status})`);

      setIncidentTypes(prev => prev.filter(t => t.id !== id));
    } catch (e) {
      setError("Failed to delete incident type");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidentTypes();
  }, []);

  return { incidentTypes, loading, error, fetchIncidentTypes, deleteIncidentType };
};
