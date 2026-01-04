import { useState, useEffect, useCallback } from "react";
import { useApiOEM } from "../../services/api";
import * as IncidentService from "../../services/incidentService";

export const useIncidentListVM = () => {
  const { apiOemFetch } = useApiOEM();

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filter state
  const [filters, setFilters] = useState({
    vesselName: "",
    dateStart: "",
    dateEnd: "",
    severity: "",
    status: "", // "active" or "resolved"
  });

  const fetchIncidents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Build filter object (only include non-empty filters)
      const filterParams = {};
      if (filters.vesselName) filterParams.vesselName = filters.vesselName;
      if (filters.dateStart) filterParams.dateStart = filters.dateStart;
      if (filters.dateEnd) filterParams.dateEnd = filters.dateEnd;
      if (filters.severity) filterParams.severity = filters.severity;
      if (filters.status) filterParams.status = filters.status;

      const data = await IncidentService.getIncidents(apiOemFetch, filterParams);
      setIncidents(data);
    } catch (e) {
      console.error(e);
      setError(e?.message || "Failed to fetch incidents");
    } finally {
      setLoading(false);
    }
  }, [apiOemFetch, filters]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  // Helper to check if incident is active (no endTime)
  const isActive = (incident) => !incident.endTime;

  // Helper to calculate duration (if resolved)
  const getDuration = (incident) => {
    if (!incident.endTime) return null;
    const start = new Date(incident.startTime);
    const end = new Date(incident.endTime);
    const diffMs = end - start;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return { hours: diffHours, minutes: diffMinutes };
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      vesselName: "",
      dateStart: "",
      dateEnd: "",
      severity: "",
      status: "",
    });
  };

  return {
    incidents,
    loading,
    error,
    filters,
    updateFilter,
    clearFilters,
    fetchIncidents,
    isActive,
    getDuration,
  };
};

