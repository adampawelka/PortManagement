import { useApi } from "../services/api";

const SCHEDULING_API_URL = "http://localhost:5107";

export const useSchedulingService = () => {
    const { apiFetch } = useApi(SCHEDULING_API_URL);

    const calculateSchedule = async (date, algorithm) => {
        const query = `?date=${encodeURIComponent(date)}&algorithm=${encodeURIComponent(algorithm)}`;

        const res = await apiFetch(`/api/Scheduling/calculate-schedule${query}`, {
            method: "GET",
        });

        const text = await res.text();
        if (!res.ok) throw new Error(text);

        return text;
    };

   const calculateMultiCraneSchedule = async (date) => {
    const query = `?date=${encodeURIComponent(date)}`;

    const res = await apiFetch(`/api/Scheduling/calculate-schedule-multi-crane${query}`, {
        method: "GET",
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
    }

    return await res.json(); // ← TU JEST FIX
};


    return {
        calculateSchedule,
        calculateMultiCraneSchedule,
    };
};
