import { useState, useEffect } from "react";
import * as IncidentTypeService from "../../services/incidentTypeService";

export const useEditIncidentTypeVM = (id) => {
  const [incidentType, setIncidentType] = useState({
    code: "",
    name: "",
    description: "",
    severity: "",
    parentId: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [parentOptions, setParentOptions] = useState([]);

  const fetchIncidentType = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await IncidentTypeService.getIncidentTypeById(fetch, id);
      setIncidentType({
        code: data.code,
        name: data.name,
        description: data.description,
        severity: data.severity,
        parentId: data.parent?.id || null
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchParentOptions = async () => {
    try {
      const data = await IncidentTypeService.getIncidentTypes(fetch);
      setParentOptions(data.filter(t => t.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const saveIncidentType = async () => {
    setLoading(true);
    setError(null);
    try {
      await IncidentTypeService.updateIncidentType(fetch, id, incidentType);
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParentOptions();
    fetchIncidentType();
  }, [id]);

  return { incidentType, setIncidentType, parentOptions, loading, error, saveIncidentType };
};
