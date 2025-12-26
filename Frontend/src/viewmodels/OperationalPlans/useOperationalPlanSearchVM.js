import { useState, useCallback, useMemo, useEffect } from "react";
import { generateMockOperationalPlans } from "../../services/operationalPlanService";
import { useApi } from "../../services/api";
import { getVesselVisitNotifications } from "../../services/vesselVisitNotificationService";
import { getVessels } from "../../services/vesselService";

export const useOperationalPlanSearchVM = () => {
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

  // Map vvnId → vesselName
  const mapIdToVVNName = useCallback(async (plans) => {
    try {
      const vvnData = await getVesselVisitNotifications(apiFetch);
      const vvnMap = Object.fromEntries(vvnData.map(vvn => [vvn.vvnId, vvn.vesselName]));
      return plans.map(plan => ({
        ...plan,
        vesselName: vvnMap[plan.vvnId] || "Unknown Vessel"
      }));
    } catch (err) {
      console.error("Failed to map VVN names", err);
      return plans;
    }
  }, [apiFetch]);

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
