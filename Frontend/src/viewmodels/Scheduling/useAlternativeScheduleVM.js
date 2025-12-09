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

  const extractExecutionTime = (resultString) => {
    if (!resultString) return null;
    const patterns = [
      /Heuristic Execution Time:\s*([\d.e-]+)/i,
      /SPT Execution Time:\s*([\d.e-]+)/i,
      /Dynamic MST Execution Time:\s*([\d.e-]+)/i,
      /Execution Time:\s*([\d.e-]+)/i
    ];
    for (const pattern of patterns) {
      const match = resultString.match(pattern);
      if (match) return parseFloat(match[1]);
    }
    return null;
  };

  const parsePrologResult = (resultString, dockName, craneCode, staffID, areaID) => {
    if (!resultString) return [];

    let cleaned = resultString
      .replace(/Heuristic Execution Time:.*?\n/i, "")
      .replace(/SPT Execution Time:.*?\n/i, "")
      .replace(/Dynamic MST Execution Time:.*?\n/i, "")
      .replace(/Execution Time:.*?\n/i, "")
      .replace(/\[|\]/g, "")
      .trim();

    if (!cleaned) return [];

    return cleaned.split(/\),/).map((item) => {
      const clean = item.replace(/\(|\)/g, "").trim();
      const parts = clean.split(",");

      const startSlot = parts[1]?.trim() || "";
      const endSlot = parts[2]?.trim() || "";

      return {
        vessel: parts[0]?.trim() || "",
        start: slotToTime(startSlot),
        end: slotToTime(endSlot),
        startSlot: parseInt(startSlot) || null,
        endSlot: parseInt(endSlot) || null,
        dock: dockName || "Unknown Dock",
        crane: craneCode || "Unassigned",
        staff: staffID || "Unassigned",
        area: areaID || "Unassigned"
      };
    });
  };

  const calculateDelay = (endSlot, etd) => {
    const endSlotNum = parseInt(endSlot);
    if (isNaN(endSlotNum) || !etd) return null;
    const etdDate = new Date(etd);
    const etdHour = etdDate.getHours();
    const delay = endSlotNum - etdHour;
    return delay > 0 ? delay : 0;
  };

  const totalDelay = useMemo(() => {
    let total = 0;
    scheduleResults.forEach((item) => {
      const notification = vesselNotifications.find(n =>
        n.vesselName && n.vesselName.toLowerCase().replace(/\s+/g, "_") === item.vessel.toLowerCase()
      );
      if (notification && item.endSlot != null) {
        const d = calculateDelay(item.endSlot, notification.etd);
        if (d) total += d;
      }
    });
    return total;
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
        (n) =>
          n.status === "Approved" &&
          new Date(n.eta).toISOString().split("T")[0] === isoDate
      );
      setVesselNotifications(filtered);

      const raw = await calculateSchedule(isoDate, selectedAlgorithm);

      const exec = extractExecutionTime(raw);
      if (exec !== null) setExecutionTime(exec);

      const json = JSON.parse(raw || "{}");

      const parsed = Object.entries(json).flatMap(([dockId, dockInfo]) =>
        parsePrologResult(dockInfo.schedule, dockInfo.dock || dockId, dockInfo.crane, dockInfo.staff, dockInfo.area)
      );

      setScheduleResults(parsed);
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
    generateSchedule
  };
};
