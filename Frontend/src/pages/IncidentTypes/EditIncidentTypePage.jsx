import { useState, useEffect, useCallback } from "react";
import { useApiOEM } from "../../services/api";
import * as IncidentTypeService from "../../services/incidentTypeService";

export const useEditIncidentTypeVM = (id) => {
  const { apiOemFetch } = useApiOEM();

  const [incidentType, setIncidentType] = useState({
    code: "",
    name: "",
    description: "",
    severity: "",
    parentId: null,
  });

  const [parentOptions, setParentOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchIncidentType = useCallback(
    async (incidentId = id) => {
      if (!incidentId) return;

      setLoading(true);
      setError(null);

      try {
        const data = await IncidentTypeService.getIncidentTypeById(
          apiOemFetch,
          incidentId
        );

        setIncidentType({
          code: data.code,
          name: data.name,
          description: data.description,
          severity: data.severity,
          parentId: data.parent?.id || null,
        });
      } catch (e) {
        console.error(e);
        setError(e?.message || "Failed to fetch incident type");
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [apiOemFetch, id]
  );

  const fetchParentOptions = useCallback(async () => {
    try {
      const data = await IncidentTypeService.getIncidentTypes(apiOemFetch);
      setParentOptions(data.filter((t) => t.id !== id));
    } catch (e) {
      console.error(e);
      // celowo bez setError – to nie blokuje edycji
    }
  }, [apiOemFetch, id]);

  const saveIncidentType = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await IncidentTypeService.updateIncidentType(
        apiOemFetch,
        id,
        incidentType
      );
    } catch (e) {
      console.error(e);
      setError(e?.message || "Failed to save incident type");
      throw e;
    } finally {
      setLoading(false);
    }
  }, [apiOemFetch, id, incidentType]);

  useEffect(() => {
    fetchParentOptions();
    if (id) {
      fetchIncidentType(id);
    }
  }, [id, fetchIncidentType, fetchParentOptions]);

  return {
    incidentType,
    setIncidentType,
    parentOptions,
    loading,
    error,
    fetchIncidentType,
    saveIncidentType,
  };
};
