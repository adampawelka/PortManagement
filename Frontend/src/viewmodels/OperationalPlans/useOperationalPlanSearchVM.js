import { useApiOEM } from "../../services/api";
import { searchOperationalPlans } from "../../services/operationalPlanService";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useApi } from "../../services/api";
import { getVessels } from "../../services/vesselService";

export const useOperationalPlanSearchVM = () => {
  const { apiOemFetch } = useApiOEM();
  const { apiFetch } = useApi();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterQuery, setFilterQuery] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [allVessels, setAllVessels] = useState([]);

  // Fetch all vessels once for filtering dropdown
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const vessels = await getVessels(apiFetch);
        setAllVessels(vessels);
      } catch (err) {
        console.error("Failed to fetch vessels", err);
      }
    };
    fetchAll();
  }, [apiFetch]);

  // Transform API response to match UI structure
  const transformApiResponse = useCallback((apiPlans) => {
    if (!Array.isArray(apiPlans)) return [];
    
    return apiPlans.map(plan => {
      // Get vesselName from first schedule item (API provides it there)
      const vesselName = plan.schedule && plan.schedule.length > 0 
        ? plan.schedule[0].vesselName 
        : "Unknown Vessel";
      
      // Transform schedule array to operations array
      const operations = (plan.schedule || []).map(op => ({
        start: op.start, // Already ISO string from API
        end: op.end,     // Already ISO string from API
        expectedDelay: op.delay || 0, // Map 'delay' to 'expectedDelay'
        dock: op.dock || "N/A",
        crane: (op.cranes && op.cranes.length > 0) ? op.cranes[0] : "N/A", // UI shows single crane
        staff: op.staff || []
      }));
      
      return {
        id: plan.id,
        vvnId: plan.vvnId,
        vesselName: vesselName,
        createdAt: plan.createdAt,
        createdBy: plan.createdBy,
        algorithmUsed: plan.algorithmUsed,
        operations: operations
      };
    });
  }, []);

  const search = useCallback(async ({ dateStart, dateEnd } = {}) => {
    setLoading(true);
    setError(null);
    setPlans([]);
    try {
      // Convert dates to ISO format if they're in YYYY-MM-DD format
      const isoDateStart = dateStart ? new Date(dateStart + 'T00:00:00').toISOString() : undefined;
      const isoDateEnd = dateEnd ? new Date(dateEnd + 'T23:59:59').toISOString() : undefined;
      
      // Call the real API - use operationDateStart/operationDateEnd to filter by vessel visit dates
      // (when operations are scheduled), not creation dates
      const apiData = await searchOperationalPlans(apiOemFetch, { 
        operationDateStart: isoDateStart, 
        operationDateEnd: isoDateEnd 
      });
      
      // Transform API response to UI format
      const transformedPlans = transformApiResponse(apiData);
      setPlans(transformedPlans);
    } catch (err) {
      setError(err.message || "Failed to search operational plans");
    } finally {
      setLoading(false);
    }
  }, [apiOemFetch, transformApiResponse]);

  // Filter by vesselName only
  const filteredPlans = useMemo(() => {
    let result = [...plans];
    if (filterQuery) {
      result = result.filter(plan => plan.vesselName === filterQuery);
    }

    // Sort
    if (sortField) {
      result.sort((a, b) => {
        let aValue, bValue;
        if (sortField === "vesselName") {
          aValue = a.vesselName.toLowerCase();
          bValue = b.vesselName.toLowerCase();
        } else if (sortField === "start") {
          aValue = a.operations[0]?.start || "";
          bValue = b.operations[0]?.start || "";
        } else if (sortField === "expectedDelay") {
          aValue = a.operations[0]?.expectedDelay || 0;
          bValue = b.operations[0]?.expectedDelay || 0;
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [plans, filterQuery, sortField, sortDirection]);

  const setSort = (field) => {
    if (!plans.length) return;
    if (field === sortField) setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter options for dropdown: vessel names only
  const filterOptions = useMemo(() => {
    return allVessels.map(v => v.vesselName || v.name).sort();
  }, [allVessels]);

  return {
    plans: filteredPlans,
    loading,
    error,
    search,
    filterQuery,
    setFilterQuery,
    sortField,
    sortDirection,
    setSort,
    filterOptions,
    allVessels
  };
};
