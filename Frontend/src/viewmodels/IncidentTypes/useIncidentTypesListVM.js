import { useState, useEffect, useCallback } from "react";
import { useApiOEM } from "../../services/api";
import * as IncidentTypeService from "../../services/incidentTypeService";

export const useIncidentTypesListVM = () => {
  const { apiOemFetch } = useApiOEM();

  const [incidentTypes, setIncidentTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterParent, setFilterParent] = useState("");

  const fetchIncidentTypes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await IncidentTypeService.getIncidentTypes(apiOemFetch);
      setIncidentTypes(data);
    } catch (e) {
      console.error(e);

      setError(
        e?.message
          ? `${e.message},  using mock data`
          : "Failed to fetch incident types,  using mock data"
      );

      setIncidentTypes(
        IncidentTypeService.generateMockIncidentTypes(15)
      );
    }
    finally {
      setLoading(false);
    }
  }, [apiOemFetch]);

  const filteredIncidentTypes = filterParent
    ? incidentTypes.filter((t) => t.parent?.name === filterParent)
    : incidentTypes;

  useEffect(() => {
    fetchIncidentTypes();
  }, [fetchIncidentTypes]);

  return {
    incidentTypes: filteredIncidentTypes,
    loading,
    error,
    fetchIncidentTypes,
    filterParent,
    setFilterParent,
    allParents: Array.from(
      new Set(incidentTypes.map((t) => t.parent?.name).filter(Boolean))
    ),
  };
};
