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

    const calculateGeneticSchedule = async (date, mode = "single", params = {}) => {
        const {
        populationSize = 50,
        generations = 100,
        crossoverRate = 0.8,  // Changed from 80 to 0.8
        mutationRate = 0.1,    // Changed from 10 to 0.1
        maxTime = 10,
        desiredDelay = 0
    } = params;

    const queryParams = new URLSearchParams({
        date: encodeURIComponent(date),
        mode: mode,
        populationSize: populationSize,
        generations: generations,
        crossoverRate: crossoverRate * 100, // Convert to percentage for API
        mutationRate: mutationRate * 100,   // Convert to percentage for API
        maxTime: maxTime,
        desiredDelay: desiredDelay
    });

        const res = await apiFetch(`/api/Scheduling/calculate-schedule-genetic?${queryParams}`, {
            method: "GET",
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text);
        }

        return await res.json();
    };


    return {
        calculateSchedule,
        calculateMultiCraneSchedule,
        calculateGeneticSchedule,
    };
};
