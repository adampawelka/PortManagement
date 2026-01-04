import { useState, useEffect, useCallback } from "react";
import { useApiOEM } from "../../services/api";
import * as IncidentTypeService from "../../services/incidentTypeService";

export const useIncidentTypeAddVM = () => {
  const { apiOemFetch } = useApiOEM();

  const [incidentType, setIncidentType] = useState({
    code: "",
    name: "",
    description: "",
    severity: "",
    parentId: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [parentOptions, setParentOptions] = useState([]);

  const fetchParentOptions = useCallback(async () => {
    try {
      const data = await IncidentTypeService.getIncidentTypes(apiOemFetch);
      setParentOptions(data);
    } catch (e) {
      console.error(e);
      setError("Failed to fetch parent options");
    }
  }, [apiOemFetch]);

  const addIncidentType = async () => {
    setLoading(true);
    setError(null);
    try {
      await IncidentTypeService.addIncidentType(apiOemFetch, incidentType);
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParentOptions();
  }, [fetchParentOptions]);

  return { incidentType, setIncidentType, parentOptions, loading, error, addIncidentType };
};
