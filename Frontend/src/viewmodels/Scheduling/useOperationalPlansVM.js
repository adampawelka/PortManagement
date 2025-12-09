import { useState } from "react";
import { useSchedulingService } from "../../services/schedulingService";
import { getVesselVisitNotifications } from "../../services/vesselVisitNotificationService";
import { useApi } from "../../services/api";

export const useOperationalPlansVM = () => {
    const { apiFetch } = useApi();
    const { calculateSchedule, calculateMultiCraneSchedule } = useSchedulingService();

    // state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [plans, setPlans] = useState([]);
    const [executionTime, setExecutionTime] = useState(null);

    const [date, setDate] = useState("");
    const [mode, setMode] = useState("single");     // "single" | "multi"
    const [algorithm, setAlgorithm] = useState(""); // only for single-crane

    // --- helpers ----------------------------------------------

    const extractExecutionTime = (txt) => {
        const patterns = [
            /Execution Time:\s*([\d.e-]+)/i,
            /Heuristic Execution Time:\s*([\d.e-]+)/i,
            /Brute Force Execution Time:\s*([\d.e-]+)/i,
            /Genetic Execution Time:\s*([\d.e-]+)/i,
        ];

        for (const p of patterns) {
            const match = txt.match(p);
            if (match) return parseFloat(match[1]);
        }
        return null;
    };

    const parsePlans = (jsonText) => {
        const parsed = JSON.parse(jsonText);
        const rows = [];

        for (const key in parsed) {
            const info = parsed[key];

            let scheduleText = info.schedule
                .replace(/^\s*\[|\]\s*$/g, "")
                .replace(/\[|\]/g, "")
                .trim();

            // extract exec time
            const exec = extractExecutionTime(scheduleText);
            if (exec) setExecutionTime(exec);

            // remove execution time line
            scheduleText = scheduleText.replace(/Execution Time:.*\n?/i, "");

            const operations =
                scheduleText
                    .split("),")
                    .map(line => line.replace(/[\(\)]/g, "").trim())
                    .map(clean => clean.split(",").map(x => x.trim()))
                    .filter(parts => parts.length >= 3)
                    .map(parts => ({
                        vessel: parts[0],
                        start: parts[1],
                        end: parts[2],
                    }));

            rows.push({
                vvnId: info.vvnId || key,
                vesselName: info.vesselName,
                dock: info.dock,
                crane: info.crane,
                area: info.area,
                operations,
                metadata: {
                    generatedAt: new Date().toISOString(),
                    algorithm: mode === "single" ? algorithm : "multi-crane",
                    mode,
                },
            });
        }

        return rows;
    };

    // --- main action -------------------------------------------

    const generate = async () => {
        setLoading(true);
        setError("");
        setPlans([]);
        setExecutionTime(null);

        try {
            if (!date) throw new Error("Please select a date.");
            if (mode === "single" && !algorithm)
                throw new Error("Please select an algorithm.");

            // fetch VVN
            const allVVN = await getVesselVisitNotifications(apiFetch);

            const filtered = allVVN.filter(v =>
                v.status === "Approved" &&
                v.eta.split("T")[0] === date
            );

            if (filtered.length === 0)
                throw new Error("No approved Vessel Visit Notifications found for this date.");

            // schedule selection
            let scheduleResponse;
            if (mode === "single") {
                scheduleResponse = await calculateSchedule(date, algorithm);
            } else {
                scheduleResponse = await calculateMultiCraneSchedule(date);
            }

            // parse
            const parsed = parsePlans(scheduleResponse);
            setPlans(parsed);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // --- return API to component -------------------------------

    return {
        loading,
        error,
        plans,
        executionTime,

        date,
        setDate,

        mode,
        setMode,

        algorithm,
        setAlgorithm,

        generate
    };
};
