import { useState, useMemo } from "react";
import { useSchedulingService } from "../../services/schedulingService";
import { useApi } from "../../services/api";
import { getVesselVisitNotifications } from "../../services/vesselVisitNotificationService";

export const useAlternativeScheduleVM = () => {
  const { calculateSchedule } = useSchedulingService();
  const { apiFetch } = useApi();

  const [targetDate, setTargetDate] = useState("");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("heuristic");
  const [scheduleResults, setScheduleResults] = useState([]);
  const [vesselNotifications, setVesselNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [executionTime, setExecutionTime] = useState(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Zamiana slotu na godzinę/dni
  const slotToTime = (slot) => {
    const slotNum = parseInt(slot, 10);
    if (isNaN(slotNum)) return slot;
    const hours = slotNum % 24;
    const days = Math.floor(slotNum / 24);
    const timeStr = `${hours.toString().padStart(2, "0")}:00`;
    return days > 0 ? `${timeStr} (+${days}d)` : timeStr;
  };

  const generateSchedule = async () => {
    setHasGenerated(true);
    setError("");
    if (!targetDate) {
      setError("Please select a date");
      return;
    }

    const isoDate = new Date(targetDate).toISOString().split("T")[0];
    setLoading(true);
    setScheduleResults([]);
    setExecutionTime(null);
    setVesselNotifications([]);

    try {
      // Pobranie powiadomień
      const allNotifs = await getVesselVisitNotifications(apiFetch);
      const filtered = allNotifs.filter(
        n => n.status === "Approved" && new Date(n.eta).toISOString().split("T")[0] === isoDate
      );
      setVesselNotifications(filtered);

      // Obliczenie harmonogramu
      const result = await calculateSchedule(isoDate, selectedAlgorithm);
      if (!result) throw new Error("Empty schedule result from backend");

      // Parsowanie schedule – backend zwraca już wszystkie potrzebne pola w parsedSchedule
      const parsedSchedules = Object.values(result).flatMap(dockObj =>
        (dockObj.parsedSchedule || []).map(item => ({
          vesselName: item.vesselName ?? "N/A",
          vesselId: item.vesselId ?? null,
          startSlot: item.startSlot,
          endSlot: item.endSlot,
          Start: item.start ?? slotToTime(item.startSlot),
          End: item.end ?? slotToTime(item.endSlot),
          craneCodes: item.craneCodes ?? [],
          staff: item.staff ?? [],
          warning: item.warning ?? null,
          delay: item.delay ?? 0,
          dock: dockObj.dock ?? "N/A",
        }))
      );
      setScheduleResults(parsedSchedules);

      // Execution time
      const execTimes = Object.values(result)
        .map(dock => dock.executionTime)
        .filter(Boolean);
      if (execTimes.length) setExecutionTime(execTimes[0]);

    } catch (err) {
      console.error(err);
      setError(`Scheduling failed: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  // Total delay obliczamy w VM
  const totalDelay = useMemo(() => {
    return scheduleResults.reduce((sum, item) => sum + (item.delay || 0), 0);
  }, [scheduleResults]);

  return {
    targetDate,
    setTargetDate,
    selectedAlgorithm,
    setSelectedAlgorithm,
    scheduleResults,
    vesselNotifications,
    loading,
    error,
    executionTime,
    hasGenerated,
    totalDelay,
    generateSchedule,
    slotToTime,
  };
};
