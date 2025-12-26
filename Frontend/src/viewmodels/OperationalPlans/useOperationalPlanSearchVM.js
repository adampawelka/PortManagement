import { useState, useCallback } from "react";
import { searchOperationalPlans } from "../../services/operationalPlanService";
import { useApiOEM } from "../../services/api";

export const useOperationalPlanSearchVM = () => {
    const { apiOemFetch } = useApiOEM(); // <-- use your Auth0 fetch
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const search = useCallback(async ({ dateStart, dateEnd } = {}) => {
        setLoading(true);
        setError(null);
        setPlans([]);

        try {
            const data = await searchOperationalPlans(apiOemFetch, { dateStart, dateEnd });
            setPlans(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Failed to search operational plans");
        } finally {
            setLoading(false);
        }
    }, [apiOemFetch]);

    return { plans, loading, error, search };
};
