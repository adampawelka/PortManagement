import { useState, useMemo } from "react";
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
  const [vesselNotifications, setVesselNotifications] = useState([]);

  // Wybór algorytmu
  const chooseAlgorithm = (vesselCount) => {
    if (vesselCount < 10) return { algo: "optimal", reason: "Small vessel set" };
    if (vesselCount >= 10 && vesselCount < 20) return { algo: "heuristic", reason: "Medium-sized instance" };
    return { algo: "genetic", reason: "Large or time-constrained instance" };
  };

  // Wyciąganie czasu wykonania z tekstu
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

  // Obliczanie delay
  const calculateDelay = (endSlot, etd) => {
    if (endSlot == null || !etd) return 0;
    const etdHour = new Date(etd).getHours();
    const delay = endSlot - etdHour;
    return delay > 0 ? delay : 0;
  };

  // Suma wszystkich delay
  const totalDelay = useMemo(() => {
    return results.reduce((acc, item) => acc + (item.delay || 0), 0);
  }, [results]);

  const generate = async (isoDate, overrideAlgorithm = "") => {
    setLoading(true);
    setError("");
    setResults([]);
    setExecutionTime(null);
    setVesselNotifications([]);

    try {
      // Pobranie notyfikacji dla danego dnia
      const allNotifs = await getVesselVisitNotifications(apiFetch);
      const filtered = allNotifs.filter(n =>
        n.status === "Approved" &&
        new Date(n.eta).toISOString().split("T")[0] === isoDate
      );
      setVesselNotifications(filtered);

      const vesselsCount = filtered.length;
      const { algo, reason: autoReason } = chooseAlgorithm(vesselsCount);
      const finalAlgo = overrideAlgorithm || algo;
      const finalReason = overrideAlgorithm ? "User override" : autoReason;

      setAlgorithm(finalAlgo);
      setReason(finalReason);

      // Blokada dla genetic przy override
      if (finalAlgo === "genetic" && overrideAlgorithm) {
        setResults([]);
        return;
      }

      // Wywołanie API
      const raw = await calculateSchedule(isoDate, finalAlgo);

      // Czas wykonania
      const exec = extractExecutionTime(raw);
      if (exec !== null) setExecutionTime(exec);

      // Parsowanie JSON
      const json = JSON.parse(raw || "{}");

      // Parsowanie wyników + liczenie delay
      const parsed = Object.entries(json).flatMap(([dockId, dockInfo]) =>
        parsePrologResult(
          dockInfo.schedule,
          dockInfo.vessels ?? [],
          dockInfo.dock || dockId,
          dockInfo.crane,
          dockInfo.staff ?? [],
          dockInfo.areas ?? []
        ).map(item => {
          const note = filtered.find(n =>
            n.vesselName && n.vesselName.toLowerCase().replace(/\s+/g, "_") === item.vessel.toLowerCase()
          );
          const delay = note && item.endSlot != null ? calculateDelay(item.endSlot, note.etd) : 0;
          return { ...item, delay };
        })
      );

      setResults(parsed);
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
    totalDelay,
    generate
  };
};
