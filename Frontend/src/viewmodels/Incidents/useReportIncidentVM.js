import { useState, useEffect, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useApiOEM } from "../../services/api";
import * as IncidentService from "../../services/incidentService";
import * as IncidentTypeService from "../../services/incidentTypeService";

export const useReportIncidentVM = () => {
  const { apiOemFetch } = useApiOEM();
  const { user } = useAuth0();

  const [incident, setIncident] = useState({
    incidentTypeId: "",
    startTime: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:mm
    endTime: "",
    severity: "",
    description: "",
    createdBy: user?.sub || "",
  });

  const [incidentTypes, setIncidentTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch incident types for dropdown
  const fetchIncidentTypes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await IncidentTypeService.getIncidentTypes(apiOemFetch);
      setIncidentTypes(data);
    } catch (e) {
      console.error(e);
      setError("Failed to fetch incident types");
    } finally {
      setLoading(false);
    }
  }, [apiOemFetch]);

  useEffect(() => {
    fetchIncidentTypes();
    // Update createdBy when user becomes available
    if (user?.sub) {
      setIncident(prev => ({ ...prev, createdBy: user.sub }));
    }
  }, [fetchIncidentTypes, user]);

  const updateField = (field, value) => {
    setIncident(prev => ({ ...prev, [field]: value }));
  };

  const createIncident = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Prepare DTO - convert startTime/endTime to ISO string if needed
      const incidentDto = {
        incidentTypeId: incident.incidentTypeId,
        startTime: new Date(incident.startTime).toISOString(),
        endTime: incident.endTime ? new Date(incident.endTime).toISOString() : undefined,
        severity: incident.severity,
        description: incident.description,
        createdBy: incident.createdBy || user?.sub || "",
      };

      await IncidentService.createIncident(apiOemFetch, incidentDto);
      setSuccess("Incident reported successfully!");
      
      // Reset form
      setIncident({
        incidentTypeId: "",
        startTime: new Date().toISOString().slice(0, 16),
        endTime: "",
        severity: "",
        description: "",
        createdBy: user?.sub || "",
      });
    } catch (e) {
      console.error(e);
      setError(e?.message || "Failed to report incident");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    incident,
    setIncident,
    updateField,
    incidentTypes,
    loading,
    error,
    success,
    createIncident,
  };
};

