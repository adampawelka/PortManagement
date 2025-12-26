import { useState, useCallback, useMemo, useEffect } from "react";
import { generateMockOperationalPlans } from "../../services/operationalPlanService";
import { useApiOEM } from "../../services/api";
import { useApi } from "../../services/api";
import { getVesselVisitNotifications } from "../../services/vesselVisitNotificationService";
import { getVessels } from "../../services/vesselService";

export const useOperationalPlanSearchVM = () => {
  const { apiOemFetch } = useApiOEM();
  const { apiFetch } = useApi();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterQuery, setFilterQuery] = useState("");
  const [filterField, setFilterField] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [allVessels, setAllVessels] = useState([]);

  // Fetch all vessels once
  const fetchAllVessels = useCallback(async () => {
    try {
      const vessels = await getVessels(apiFetch);
      setAllVessels(vessels);
    } catch (err) {
      console.error("Failed to fetch vessels", err);
    }
  }, [apiFetch]);

  useEffect(() => {
    fetchAllVessels();
  }, [fetchAllVessels]);

  // Map vvnId to vesselName
  const mapIdToVVNName = useCallback(async (plans) => {
    try {
      const vvnData = await getVesselVisitNotifications(apiFetch);
      const vvnMap = {};
      vvnData.forEach(vvn => {
        vvnMap[vvn.vvnId] = vvn.vesselName;
      });

      return plans.map(plan => ({
        ...plan,
        vesselName: vvnMap[plan.vvnId] || "Unknown Vessel"
      }));
    } catch (err) {
      console.error("Failed to map VVN names", err);
      return plans;
    }
  }, [apiFetch]);

  // Search plans
  const search = useCallback(async ({ dateStart, dateEnd } = {}) => {
    setLoading(true);
    setError(null);
    setPlans([]);
    try {
      const data = generateMockOperationalPlans(8);
      const mapped = await mapIdToVVNName(data);
      setPlans(Array.isArray(mapped) ? mapped : []);
    } catch (err) {
      setError(err.message || "Failed to search operational plans");
    } finally {
      setLoading(false);
    }
  }, [mapIdToVVNName]);

  // Compute filtered & sorted plans
  const filteredPlans = useMemo(() => {
    let result = [...plans];

    // Filter
    if (filterField && filterQuery) {
      result = result.filter(plan => {
        if (filterField === "vesselName") return plan.vesselName === filterQuery;
        return plan.operations.some(op => {
          if (filterField === "start") return op.start === filterQuery;
          if (filterField === "expectedDelay") return op.expectedDelay === filterQuery;
          return true;
        });
      }).map(plan => ({
        ...plan,
        operations: plan.operations.filter(op => {
          if (!filterField || filterField === "vesselName") return true;
          if (filterField === "start") return op.start === filterQuery;
          if (filterField === "expectedDelay") return op.expectedDelay === filterQuery;
          return true;
        })
      }));
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
  }, [plans, filterField, filterQuery, sortField, sortDirection]);

  // Compute filter options for dropdown
const filterOptions = useMemo(() => {
  if (!filterField) return [];

  if (filterField === "vesselName") {
    // Use correct property name from your API response
    return allVessels.map(v => v.vesselName || v.name).sort();
  }

  const values = new Set();
  plans.forEach(plan => {
    plan.operations.forEach(op => {
      if (filterField === "start") values.add(op.start);
      if (filterField === "expectedDelay" && op.expectedDelay != null) values.add(op.expectedDelay);
    });
  });
  return Array.from(values).sort();
}, [plans, allVessels, filterField]);


  const setSort = (field) => {
    if (!plans.length) return;
    if (field === sortField) setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return {
    plans: filteredPlans,
    loading,
    error,
    search,
    filterQuery,
    setFilterQuery,
    filterField,
    setFilterField,
    sortField,
    sortDirection,
    setSort,
    filterOptions,
    allVessels
  };
};
