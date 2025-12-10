import { useState } from "react";
import { useSchedulingService } from "../../services/schedulingService";
import { useApi } from "../../services/api";
import { getVesselVisitNotifications } from "../../services/vesselVisitNotificationService";

export const useOptimalScheduleVM = () => {
    const { calculateSchedule } = useSchedulingService();   // backend 5107
    const { apiFetch } = useApi();                          // backend 5000

    const [targetDate, setTargetDate] = useState("");
    const [scheduleResults, setScheduleResults] = useState([]);
    const [vesselNotifications, setVesselNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [executionTime, setExecutionTime] = useState(null);

    // --- Helpers ---
    const slotToTime = (slot) => {
        const n = parseInt(slot);
        if (isNaN(n)) return slot;
        const hours = n % 24;
        const days = Math.floor(n / 24);
        return days > 0
            ? `${hours.toString().padStart(2, "0")}:00 (+${days}d)`
            : `${hours.toString().padStart(2, "0")}:00`;
    };

    const extractExecutionTime = (raw) => {
        const patterns = [
            /Execution Time:\s*([\d.e-]+)/i,
            /Brute Force Execution Time:\s*([\d.e-]+)/i
        ];
        for (const p of patterns) {
            const m = raw.match(p);
            if (m) return parseFloat(m[1]);
        }
        return null;
    };

    const parsePrologResult = (raw) => {
        if (!raw) return [];

        let cleaned = raw
            .replace(/Execution Time:.*?\n/i, "")
            .replace(/Brute Force Execution Time:.*?\n/i, "")
            .replace(/\[|\]/g, "")
            .trim();

        if (!cleaned) return [];

        return cleaned.split(/\),/).map((item) => {
            const p = item.replace(/[()]/g, "").split(",");

            const startSlot = p[1]?.trim();
            const endSlot = p[2]?.trim();

            return {
                vessel: p[0]?.trim() || "",
                start: slotToTime(startSlot),
                end: slotToTime(endSlot),
                dock: p[3]?.trim() || "Unknown",
                crane: p[4]?.trim() || "Unassigned",
                staff: "Auto",
                area: p[5]?.trim() || "Unassigned",
            };
        });
    };

    // --- Generate Schedule ---
    const generateSchedule = async () => {
        setError("");

        if (!targetDate) {
            setError("Please select a date");
            return;
        }

        const isoDate = new Date(targetDate).toISOString().split("T")[0];

        setLoading(true);
        setScheduleResults([]);
        setExecutionTime(null);

        try {
            // --- 1. fetch VVN using useApi + pure service function ---
            const allNotifs = await getVesselVisitNotifications(apiFetch);

            const filtered = allNotifs.filter(
                (n) =>
                    n.status === "Approved" &&
                    new Date(n.eta).toISOString().split("T")[0] === isoDate
            );

            setVesselNotifications(filtered);

            // --- 2. fetch schedule via SchedulingService ---
            const raw = await calculateSchedule(isoDate, "bruteforce");

            const exec = extractExecutionTime(raw);
            if (exec) setExecutionTime(exec);

            const json = JSON.parse(raw);

            const parsed = Object.values(json).flatMap((dockInfo) =>
                parsePrologResult(dockInfo.schedule)
            );

            setScheduleResults(parsed);

        } catch (err) {
            console.error(err);
            setError(`Scheduling failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return {
        targetDate,
        setTargetDate,
        scheduleResults,
        vesselNotifications,
        loading,
        error,
        executionTime,
        generateSchedule,
    };
};
