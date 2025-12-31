import { useState, useEffect, useCallback } from "react";
import { useApiOEM } from "../../services/api";
import * as IncidentTypeService from "../../services/incidentTypeService";

export const useIncidentTypesListVM = () => {
  const { apiOemFetch } = useApiOEM();

  const [incidentTypes, setIncidentTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterParentId, setFilterParentId] = useState(null);

  const fetchIncidentTypes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await IncidentTypeService.getIncidentTypes(apiOemFetch, filterParentId);
      setIncidentTypes(data);
    } catch (e) {
      console.error(e);
      setError(e?.message ? `${e.message}, using mock data` : "Failed to fetch incident types, using mock data");
      setIncidentTypes(IncidentTypeService.generateMockIncidentTypes(15));
    } finally {
      setLoading(false);
    }
  }, [apiOemFetch, filterParentId]);

  useEffect(() => {
    fetchIncidentTypes();
  }, [fetchIncidentTypes]);

  // Sortowanie rodzice -> dzieci
  const sortedIncidentTypes = [...incidentTypes].sort((a, b) => {
    if (!a.parentId && b.parentId) return -1;
    if (a.parentId && !b.parentId) return 1;
    return a.name.localeCompare(b.name);
  });

  const allParents = Array.from(
    new Set(incidentTypes.filter(t => t.parentId).map(t => t.parentName).filter(Boolean))
  );

  return {
    incidentTypes: sortedIncidentTypes,
    loading,
    error,
    fetchIncidentTypes,
    filterParentId,
    setFilterParentId,
    allParents,
  };
};
