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

        return await res.json();
    };

    const slotToTime = (slot) => {
        const n = parseInt(slot);
        if (isNaN(n)) return slot;
        const hours = n % 24;
        const days = Math.floor(n / 24);
        return days > 0
            ? `${hours.toString().padStart(2, "0")}:00 (+${days}d)`
            : `${hours.toString().padStart(2, "0")}:00`;
    };

    const parsePrologResult = (raw, vessels, dockName, craneCode, staff, areas) => {
        if (!raw) return [];

        let cleaned = raw
            .replace(/Heuristic Execution Time:.*?\n/i, "")
            .replace(/Execution Time:.*?\n/i, "")
            .replace(/Brute Force Execution Time:.*?\n/i, "")
            .replace(/\[|\]/g, "")
            .trim();

        if (!cleaned) return [];

        return cleaned.split(/\),/).map(token => {
            const parts = token.replace(/[()]/g, "").split(",");

            const vesselName = parts[0]?.trim();
            const startSlot = parseInt(parts[1]?.trim(), 10);
            const endSlot = parseInt(parts[2]?.trim(), 10);

            const v = vessels.find(x => x.vesselName?.toLowerCase() === vesselName?.toLowerCase());

            return {
                vessel: vesselName,
                vesselId: v?.vesselId || null,
                startSlot,
                endSlot,
                start: slotToTime(startSlot),
                end: slotToTime(endSlot),
                dock: dockName,
                crane: craneCode,
                staff: staff,
                areas: areas,
            };
        });
    };




    return {
        calculateSchedule,
        parsePrologResult,
        calculateMultiCraneSchedule,
    };
};



// add something for persisting the data