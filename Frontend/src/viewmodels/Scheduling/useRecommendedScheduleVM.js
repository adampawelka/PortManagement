import { useState, useMemo } from "react";
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
  const [vesselNotifications, setVesselNotifications] = useState([]);

  const chooseAlgorithm = (vesselCount) => {
    if (vesselCount < 10) return { algo: "optimal", reason: "Small vessel set" };
    if (vesselCount >= 10 && vesselCount < 20) return { algo: "heuristic", reason: "Medium-sized instance" };
    return { algo: "genetic", reason: "Large or time-constrained instance" };
  };

  const slotToTime = (slot) => {
    const slotNum = parseInt(slot);
    if (isNaN(slotNum)) return slot;
    const hours = slotNum % 24;
    const days = Math.floor(slotNum / 24);
    const timeStr = `${hours.toString().padStart(2, "0")}:00`;
    return days > 0 ? `${timeStr} (+${days}d)` : timeStr;
  };

  const calculateDelay = (endSlot, etd) => {
    if (!endSlot || !etd) return 0;
    const etdDate = new Date(etd);
    const endDate = new Date(etdDate.getTime());
    endDate.setHours(0, 0, 0, 0);
    endDate.setHours(endDate.getHours() + endSlot);
    const diffHours = Math.round((endDate - etdDate) / (1000 * 60 * 60));
    return diffHours > 0 ? diffHours : 0;
  };

  const totalDelay = useMemo(
    () => results.reduce((acc, item) => acc + (item.delay || 0), 0),
    [results]
  );

  const generate = async (isoDate, overrideAlgorithm = "") => {
    setLoading(true);
    setError("");
    setResults([]);
    setExecutionTime(null);
    setVesselNotifications([]);

    try {
      const allNotifs = await getVesselVisitNotifications(apiFetch);
      const filtered = allNotifs.filter(
        (n) => n.status === "Approved" && new Date(n.eta).toISOString().split("T")[0] === isoDate
      );
      setVesselNotifications(filtered);

      const vesselsCount = filtered.length;
      const { algo, reason: autoReason } = chooseAlgorithm(vesselsCount);
      const finalAlgo = overrideAlgorithm || algo;
      const finalReason = overrideAlgorithm ? "User override" : autoReason;
      setAlgorithm(finalAlgo);
      setReason(finalReason);

      if (finalAlgo === "genetic" && overrideAlgorithm) {
        setResults([]);
        return;
      }

      const raw = await calculateSchedule(isoDate, finalAlgo);

      const execTimes = Object.values(raw)
        .map((dock) => dock.executionTime)
        .filter(Boolean);
      if (execTimes.length > 0) setExecutionTime(execTimes[0]);

      const parsedResults = Object.values(raw).flatMap((dockInfo) =>
        (dockInfo.parsedSchedule ?? []).map((item) => {
          const note = filtered.find(
            (n) =>
              n.vesselName &&
              n.vesselName.toLowerCase().replace(/\s+/g, "_") ===
                (item.vesselName || item.vessel)?.toLowerCase()
          );
          const delay =
            finalAlgo === "heuristic"
              ? note && item.endSlot != null
                ? calculateDelay(item.endSlot, note.etd)
                : 0
              : item.delay || 0;

          return {
            vessel: item.vesselName || item.vessel || "Unknown",
            vesselId: item.vesselId || null,
            startSlot: item.startSlot,
            endSlot: item.endSlot,
            start: slotToTime(item.startSlot),
            end: slotToTime(item.endSlot),
            dock: dockInfo.dock || "N/A",
            crane: item.craneCodes?.[0] || dockInfo.crane || "Unassigned",
            staff: Array.isArray(item.staff)
              ? item.staff.map((s) => s.shortName ?? s)
              : [], // <- staff jako tablica
            warning: item.warning || null,
            delay,
          };
        })
      );

      setResults(parsedResults);
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
    generate,
  };
};
