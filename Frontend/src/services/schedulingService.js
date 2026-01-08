import { useApi } from "../services/api";

const SCHEDULING_API_URL = "http://localhost:5107";

export const useSchedulingService = () => {
    const { apiFetch } = useApi(SCHEDULING_API_URL);

    const calculateSchedule = async (date, algorithm) => {
        const query = `?date=${encodeURIComponent(date)}&algorithm=${encodeURIComponent(algorithm)}`;

        const res = await apiFetch(`/api/Scheduling/calculate-schedule${query}`, {
            method: "GET",
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text);
        }

        return await res.json();
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

        return await res.json();
    };

    const calculateGeneticSchedule = async (date, params = {}) => {
        const queryParams = new URLSearchParams({
            date,
            populationSize: params.populationSize || 30,
            generations: params.generations || 50,
            crossoverRate: params.crossoverRate || 0.8,
            mutationRate: params.mutationRate || 0.2,
            cranes: params.cranes || 1
        });

        const response = await apiFetch(`/api/Scheduling/calculate-schedule-genetic?${queryParams}`);

        // Directly parse JSON once
        if (!response.ok) {
            // We can still try reading JSON for error details
            const errorJson = await response.json().catch(() => null);
            throw new Error(errorJson?.message || "Genetic scheduling failed");
        }

        return await response.json();
    };




    return {
        calculateSchedule,
        calculateMultiCraneSchedule,
        calculateGeneticSchedule,
    };
};
