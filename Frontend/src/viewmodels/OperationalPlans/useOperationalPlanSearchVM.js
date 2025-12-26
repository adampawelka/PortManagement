import { useState, useCallback, useMemo } from "react";
import { searchOperationalPlans } from "../../services/operationalPlanService";
import { useApiOEM } from "../../services/api";

import { generateMockOperationalPlans } from "../../services/operationalPlanService";

export const useOperationalPlanSearchVM = () => {
    const { apiOemFetch } = useApiOEM();

    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filterQuery, setFilterQuery] = useState("");
    const [sortField, setSortField] = useState(""); // "vesselName", "start", "expectedDelay"
    const [sortDirection, setSortDirection] = useState("asc"); // "asc" | "desc"

    const search = useCallback(async ({ dateStart, dateEnd } = {}) => {
        setLoading(true);
        setError(null);
        setPlans([]);

        try {
            const data = generateMockOperationalPlans(8); // await searchOperationalPlans(apiOemFetch, { dateStart, dateEnd });
            setPlans(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Failed to search operational plans");
        } finally {
            setLoading(false);
        }
    }, [apiOemFetch]);

    // Filtered plans based on search query
    const filteredPlans = useMemo(() => {
        let filtered = plans;

        if (filterQuery) {
            const q = filterQuery.toLowerCase();
            filtered = filtered.filter(plan =>
                plan.vesselName.toLowerCase().includes(q) ||
                plan.operations.some(op =>
                    op.start.toLowerCase().includes(q) ||
                    (op.expectedDelay && op.expectedDelay.toString().toLowerCase().includes(q))
                )
            );
        }

        // Sorting
        if (sortField && filtered.length > 0) {
            filtered = [...filtered].sort((a, b) => {
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

        return filtered;
    }, [plans, filterQuery, sortField, sortDirection]);

    const setSort = (field) => {
        if (plans.length === 0) return; // only allow sorting if there are results
        if (field === sortField) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc"); // toggle direction
        } else {
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
        sortField,
        sortDirection,
        setSort
    };
};
