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

  const slotToTime = (slot) => {
    const slotNum = parseInt(slot);
    if (isNaN(slotNum)) return slot;
    const hours = slotNum % 24;
    const days = Math.floor(slotNum / 24);
    const timeStr = `${hours.toString().padStart(2, "0")}:00`;
    return days > 0 ? `${timeStr} (+${days}d)` : timeStr;
  };

  const calculateDelay = (endSlot, etd) => {
    if (endSlot == null || !etd) return null;
    const endSlotNum = parseInt(endSlot);
    if (isNaN(endSlotNum)) return null;
    const etdDate = new Date(etd);
    const etdHour = etdDate.getHours();
    const delay = endSlotNum - etdHour;
    return delay > 0 ? delay : 0;
  };

  const totalDelay = useMemo(() => {
    return scheduleResults.reduce((total, item) => {
      if (!item?.vesselName) return total; 
      const notification = vesselNotifications.find(n =>
        n.vesselName?.toLowerCase().replace(/\s+/g, "_") === item.vesselName.toLowerCase()
      );
      const d = notification && item.endSlot != null ? calculateDelay(item.endSlot, notification.etd) : 0;
      return total + (d || 0);
    }, 0);
  }, [scheduleResults, vesselNotifications]);

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
      const allNotifs = await getVesselVisitNotifications(apiFetch);
      const filtered = allNotifs.filter(
        n => n.status === "Approved" && new Date(n.eta).toISOString().split("T")[0] === isoDate
      );
      setVesselNotifications(filtered);

      const result = await calculateSchedule(isoDate, selectedAlgorithm);
      if (!result) throw new Error("Empty schedule result from backend");

      const parsedSchedules = Object.values(result).flatMap(dockObj =>
        (dockObj.parsedSchedule || []).map(item => ({
          ...item,
          dock: dockObj.dock || "N/A"
        }))
      );
      setScheduleResults(parsedSchedules);

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
    calculateDelay
  };
};
