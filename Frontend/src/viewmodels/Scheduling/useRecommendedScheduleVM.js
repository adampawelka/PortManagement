import { useState } from "react";
import { useSchedulingService } from "../../services/schedulingService";
import { getVesselVisitNotifications } from "../../services/vesselVisitNotificationService";
import { useApi } from "../../services/api";

export const useRecommendedScheduleVM = () => {
    const { apiFetch } = useApi();
    const { calculateSchedule, parsePrologResult } = useSchedulingService();

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

    const generate = async (isoDate, overrideAlgorithm = "") => {
        setLoading(true);
        setError("");
        setResults([]);
        setExecutionTime(null);

        try {
            const all = await getVesselVisitNotifications(apiFetch);

            const filtered = all.filter(v =>
                v.status === "Approved" && v.eta.split("T")[0] === isoDate
            );

            const vessels = filtered.length;
            const ops = filtered.reduce(
                (sum, v) => sum + (v.estimatedOperations || 30),
                0
            );

            const { algo, reason: autoReason } = chooseAlgorithm(vessels, ops);
            const finalAlgo = overrideAlgorithm || algo;
            const finalReason = overrideAlgorithm ? "User override" : autoReason;

            setAlgorithm(finalAlgo);
            setReason(finalReason);

            // blokujemy genetic przy wymuszeniu algorytmu
            if (finalAlgo === "genetic" && overrideAlgorithm) {
                setResults([]);
                return;
            }

            const txt = await calculateSchedule(isoDate, finalAlgo);

            // parse JSON
            const data = JSON.parse(txt);

            const parsed = Object.values(data).flatMap(dockInfo =>
                parsePrologResult(
                    dockInfo.schedule,
                    dockInfo.vessels ?? [],
                    dockInfo.dock,
                    dockInfo.crane,
                    dockInfo.staff ?? [],
                    dockInfo.areas ?? []
                )
            );

            setResults(parsed);

            // czas wykonania
            const exec = extractExecutionTime(txt);
            if (exec) setExecutionTime(exec);

        } catch (err) {
            console.error(err);
            setError(err.message || "Unknown error");
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
