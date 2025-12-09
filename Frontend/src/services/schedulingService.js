import { useApi } from "../services/api";

// base URL for scheduling - the other backend
const SCHEDULING_API_URL = "http://localhost:5107";

export const useSchedulingService = () => {
    // API for scheduling (another port)
    const { apiFetch } = useApi(SCHEDULING_API_URL);

    const calculateSchedule = async (date, algorithm) => {
        const query = `?date=${encodeURIComponent(date)}&algorithm=${encodeURIComponent(algorithm)}`;

        const res = await apiFetch(`/api/Scheduling/calculate-schedule${query}`, {
            method: "GET",
        });

        const text = await res.text();

        if (!res.ok) {
            throw new Error(text);
        }

        return text; 
    };

    return {
        calculateSchedule
    };
};
