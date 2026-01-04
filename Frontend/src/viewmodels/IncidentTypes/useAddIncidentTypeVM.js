import { useState, useEffect } from "react";
import * as IncidentTypeService from "../../services/incidentTypeService";

export const useIncidentTypeAddVM = () => {
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

  const fetchParentOptions = async () => {
    try {
      const data = await IncidentTypeService.getIncidentTypes(fetch);
      setParentOptions(data);
    } catch (e) {
      console.error(e);
    }
  };

  const addIncidentType = async () => {
    setLoading(true);
    setError(null);
    try {
      await IncidentTypeService.addIncidentType(fetch, incidentType);
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParentOptions();
  }, []);

  return { incidentType, setIncidentType, parentOptions, loading, error, addIncidentType };
};
