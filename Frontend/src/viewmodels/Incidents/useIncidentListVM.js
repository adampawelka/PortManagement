import { useState, useEffect, useCallback } from "react";
import { useApiOEM, useApi } from "../../services/api";
import * as IncidentService from "../../services/incidentService";
import { getVessels } from "../../services/vesselService";

export const useIncidentListVM = () => {
  const { apiOemFetch } = useApiOEM();
  const { apiFetch } = useApi();

  const [incidents, setIncidents] = useState([]);
  const [vessels, setVessels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingVessels, setLoadingVessels] = useState(false);
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

  // Fetch vessels for dropdown
  const fetchVessels = useCallback(async () => {
    setLoadingVessels(true);
    try {
      console.log("[useIncidentListVM] Fetching vessels...");
      const data = await getVessels(apiFetch);
      console.log("[useIncidentListVM] Vessels fetched:", data);
      setVessels(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("[useIncidentListVM] Failed to fetch vessels:", e);
      console.error("[useIncidentListVM] Error details:", e.message);
      setVessels([]); // Set empty array on error
      // Don't show error to user - vessel filter is optional
    } finally {
      setLoadingVessels(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    fetchIncidents();
    fetchVessels();
  }, [fetchIncidents, fetchVessels]);

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
    vessels,
    loading,
    loadingVessels,
    error,
    filters,
    updateFilter,
    clearFilters,
    fetchIncidents,
    isActive,
    getDuration,
  };
};

