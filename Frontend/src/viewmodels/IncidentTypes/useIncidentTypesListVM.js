import { useState, useEffect } from "react";
import * as IncidentTypeService from "../../services/incidentTypeService";

export const useIncidentTypesListVM = () => {
  const [incidentTypes, setIncidentTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterParent, setFilterParent] = useState("");

  const fetchIncidentTypes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await IncidentTypeService.getIncidentTypes(fetch);
      setIncidentTypes(data);
    } catch (e) {
      console.warn("Failed to fetch from API, using mock data.", e);
      setError("Failed to fetch incident types from server. Displaying mock data.");
      setIncidentTypes(IncidentTypeService.generateMockIncidentTypes(15)); // realistic mock
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

  // Apply parent filter
  const filteredIncidentTypes = filterParent
    ? incidentTypes.filter(t => t.parent?.name === filterParent)
    : incidentTypes;

  useEffect(() => {
    fetchIncidentTypes();
  }, []);

  return {
    incidentTypes: filteredIncidentTypes,
    loading,
    error,
    fetchIncidentTypes,
    deleteIncidentType,
    filterParent,
    setFilterParent,
    allParents: Array.from(new Set(incidentTypes.map(t => t.parent?.name).filter(Boolean)))
  };
};
