import { useState, useEffect, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useApiOEM } from "../../services/api";
import * as IncidentService from "../../services/incidentService";
import * as IncidentTypeService from "../../services/incidentTypeService";

export const useUpdateIncidentVM = (id) => {
  const { apiOemFetch } = useApiOEM();
  const { user } = useAuth0();

  const [incident, setIncident] = useState({
    incidentTypeId: "",
    startTime: "",
    endTime: "",
    severity: "",
    description: "",
    createdBy: "",
  });

  const [incidentTypes, setIncidentTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch incident types for dropdown
  const fetchIncidentTypes = useCallback(async () => {
    try {
      const data = await IncidentTypeService.getIncidentTypes(apiOemFetch);
      setIncidentTypes(data);
    } catch (e) {
      console.error(e);
      setError("Failed to fetch incident types");
    }
  }, [apiOemFetch]);

  // Fetch incident by ID
  const fetchIncident = useCallback(async (incidentId = id) => {
    if (!incidentId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await IncidentService.getIncidentById(apiOemFetch, incidentId);
      
      // Convert ISO strings to local datetime format for input fields
      setIncident({
        incidentTypeId: data.incidentTypeId || "",
        startTime: data.startTime ? new Date(data.startTime).toISOString().slice(0, 16) : "",
        endTime: data.endTime ? new Date(data.endTime).toISOString().slice(0, 16) : "",
        severity: data.severity || "",
        description: data.description || "",
        createdBy: data.createdBy || "",
      });
    } catch (e) {
      console.error(e);
      setError(e?.message || "Failed to fetch incident");
      throw e;
    } finally {
      setLoading(false);
    }
  }, [apiOemFetch, id]);

  useEffect(() => {
    fetchIncidentTypes();
    if (id) {
      fetchIncident(id);
    }
  }, [id, fetchIncident, fetchIncidentTypes]);

  const updateField = (field, value) => {
    setIncident(prev => ({ ...prev, [field]: value }));
  };

  const updateIncident = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Prepare DTO - only include changed fields
      const incidentDto = {
        incidentTypeId: incident.incidentTypeId,
        startTime: incident.startTime ? new Date(incident.startTime).toISOString() : undefined,
        endTime: incident.endTime ? new Date(incident.endTime).toISOString() : undefined,
        severity: incident.severity,
        description: incident.description,
      };

      await IncidentService.updateIncident(apiOemFetch, id, incidentDto);
      setSuccess("Incident updated successfully!");
    } catch (e) {
      console.error(e);
      setError(e?.message || "Failed to update incident");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Helper to mark incident as resolved (set endTime to now)
  const markAsResolved = () => {
    const now = new Date().toISOString().slice(0, 16);
    updateField("endTime", now);
  };

  return {
    incident,
    setIncident,
    updateField,
    incidentTypes,
    loading,
    error,
    success,
    updateIncident,
    fetchIncident,
    markAsResolved,
  };
};

