import { useState } from "react";
import { useSchedulingService } from "../../services/schedulingService";
import { getVesselVisitNotifications } from "../../services/vesselVisitNotificationService";
import { useApi } from "../../services/api";

export const useOperationalPlansVM = () => {
    const { apiFetch } = useApi();
    const { calculateSchedule, calculateMultiCraneSchedule } = useSchedulingService();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [plans, setPlans] = useState([]);
    const [executionTime, setExecutionTime] = useState(null);

    const [date, setDate] = useState("");
    const [mode, setMode] = useState("single");
    const [algorithm, setAlgorithm] = useState("");

    const normalizeScheduleName = (str = "") =>
        str
            .replace(/_/g, " ")
            .trim()
            .toLowerCase();

    const normalizeVVNName = (str = "") =>
        str
            .replace(/\s+/g, " ")
            .trim()
            .toLowerCase();

    const extractExecutionTime = (txt = "") => {
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

    const parsePlans = (json, allVVN) => {
        if (!json) return [];

        const parsed =
            typeof json === "string" ? JSON.parse(json) : json;

        const aggregated = {}; 

        for (const key in parsed) {
            const info = parsed[key];
            if (!info?.schedule) continue;

            let scheduleText = info.schedule
                .replace(/^\s*\[|\]\s*$/g, "")
                .replace(/\[|\]/g, "")
                .trim();

            const exec = extractExecutionTime(scheduleText);
            if (exec) setExecutionTime(exec);

            scheduleText = scheduleText.replace(/Execution Time:.*\n?/i, "");

            const operations = scheduleText
                .split("),")
                .map(line => line.replace(/[\(\)]/g, "").trim())
                .map(clean => clean.split(",").map(x => x.trim()))
                .filter(parts => parts.length >= 3)
                .map(parts => {
                    const rawName = parts[0];
                    const start = parts[1];
                    const end = parts[2];

                    const scheduleNorm = normalizeScheduleName(rawName);

                    const matchVVN = allVVN.find(v =>
                        normalizeVVNName(v.vesselName) === scheduleNorm
                    );

                    return {
                        vesselName: matchVVN?.vesselName || rawName,
                        vesselId: matchVVN?.vesselId || null,
                        vvnId: matchVVN?.id || null,
                        start,
                        end,
                    };
                });

            for (const op of operations) {
                if (!op.vvnId) continue; 
                if (!aggregated[op.vvnId]) {
                    aggregated[op.vvnId] = {
                        vvnId: op.vvnId,
                        vesselId: op.vesselId,
                        vesselName: op.vesselName,
                        dock: info.dock,
                        crane: info.crane,
                        area: info.area,
                        operations: [],
                    };
                }

                aggregated[op.vvnId].operations.push({
                    start: op.start,
                    end: op.end,
                });
            }
        }

        return Object.values(aggregated);
    };


    const generate = async () => {
        setLoading(true);
        setError("");
        setPlans([]);
        setExecutionTime(null);

        try {
            if (!date) throw new Error("Please select a date.");
            if (mode === "single" && !algorithm)
                throw new Error("Please select an algorithm.");

            const allVVN = await getVesselVisitNotifications(apiFetch);

            const vvnForDate = allVVN.filter(v =>
                v.status === "Approved" &&
                v.eta?.split("T")[0] === date
            );

            if (vvnForDate.length === 0)
                throw new Error(
                    "No approved Vessel Visit Notifications found for this date."
                );

            const scheduleResponse =
                mode === "single"
                    ? await calculateSchedule(date, algorithm)
                    : await calculateMultiCraneSchedule(date);

            console.log("allVVN:", allVVN);
            console.log("scheduleResponse:", scheduleResponse);

            const parsed = parsePlans(scheduleResponse, allVVN);

            setPlans(parsed);
        } catch (err) {
            setError(err?.message || "Failed to generate schedule.");
        } finally {
            setLoading(false);
        }
    };

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

        generate,
    };
};
