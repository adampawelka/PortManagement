import { useState } from "react";
import { useSchedulingService } from "../../services/schedulingService";
import { getVesselVisitNotifications } from "../../services/vesselVisitNotificationService";
import { useApi } from "../../services/api";

export const useRecommendedScheduleVM = () => {
    const { apiFetch } = useApi();
    const { calculateSchedule } = useSchedulingService();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [results, setResults] = useState([]);
    const [executionTime, setExecutionTime] = useState(null);
    const [algorithm, setAlgorithm] = useState("");
    const [reason, setReason] = useState("");

    const chooseAlgorithm = (vesselCount, operations) => {
        if (operations < 10)
            return { algo: "optimal", reason: "Small operation set (<150 ops)" };
        if (operations < 20)
            return { algo: "heuristic", reason: "Medium-sized instance" };
        return { algo: "genetic", reason: "Large or time-constrained instance" };
    };

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

    const parseSchedule = (jsonText) => {
        const parsed = JSON.parse(jsonText);
        const rows = [];

        for (const dockId in parsed) {
            const info = parsed[dockId];
            let scheduleText = info.schedule
                .replace(/^\s*\[|\]\s*$/g, "")
                .replace(/\[|\]/g, "")
                .trim();

            const exec = extractExecutionTime(scheduleText);
            if (exec) setExecutionTime(exec);

            scheduleText = scheduleText.replace(/Execution Time:.*\n?/i, "");
            const lines = scheduleText.split("),");

            lines.forEach(line => {
                const clean = line.replace(/[\(\)]/g, "").trim();
                const parts = clean.split(",").map(x => x.trim());

                if (parts.length >= 3) {
                    rows.push({
                        vessel: parts[0],
                        dock: info.dock || dockId,
                        crane: info.crane,
                        start: parts[1],
                        end: parts[2],
                        staff: "Assigned Staff TBD",
                        area: info.area
                    });
                }
            });
        }

        return rows;
    };

    const generate = async (isoDate, overrideAlgorithm = "") => {
        setLoading(true);
        setError("");
        setResults([]);
        setExecutionTime(null);

        try {
            const all = await getVesselVisitNotifications(apiFetch);
            const filtered = all.filter(v =>
                v.status === "Approved" &&
                v.eta.split("T")[0] === isoDate
            );

            const vessels = filtered.length;
            const ops = filtered.reduce((sum, v) => sum + (v.estimatedOperations || 30), 0);

            const { algo, reason: autoReason } = chooseAlgorithm(vessels, ops);

            const finalAlgo = overrideAlgorithm || algo;
            const finalReason = overrideAlgorithm ? "User override" : autoReason;

            setAlgorithm(finalAlgo);
            setReason(finalReason);

            if (finalAlgo === "genetic" && overrideAlgorithm) {
                setResults([]);
                return;
            }

            const txt = await calculateSchedule(isoDate, finalAlgo);
            const parsed = parseSchedule(txt);
            setResults(parsed);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        results,
        executionTime,
        algorithm,
        reason,
        generate
    };
};
