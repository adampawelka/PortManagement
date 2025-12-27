import { useState, useMemo } from "react";
import { useSchedulingService } from "../../services/schedulingService";
import { useApi } from "../../services/api";
import { getVesselVisitNotifications } from "../../services/vesselVisitNotificationService";

export const useOptimalScheduleVM = () => {
  const { calculateSchedule, parsePrologResult } = useSchedulingService();
  const { apiFetch } = useApi();

  const [targetDate, setTargetDate] = useState("");
  const [scheduleResults, setScheduleResults] = useState([]);
  const [vesselNotifications, setVesselNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [executionTime, setExecutionTime] = useState(null);

  // Wyciąganie czasu wykonania z Prologa
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

  // Suma delay
  const totalDelay = useMemo(() => {
    return scheduleResults.reduce((acc, item) => acc + (item.delay || 0), 0);
  }, [scheduleResults]);

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
      const allNotifs = await getVesselVisitNotifications(apiFetch);
      const filtered = allNotifs.filter(
        (n) =>
          n.status === "Approved" &&
          new Date(n.eta).toISOString().split("T")[0] === isoDate
      );
      setVesselNotifications(filtered);

      const raw = await calculateSchedule(isoDate, "optimal");

      const exec = extractExecutionTime(raw);
      if (exec !== null) setExecutionTime(exec);

      const json = JSON.parse(raw);

      const parsed = Object.values(json).flatMap((dockInfo) => {
        const lines = dockInfo.schedule.split(/\),/);
        return parsePrologResult(
          dockInfo.schedule,
          dockInfo.vessels ?? [],
          dockInfo.dock,
          dockInfo.crane,
          dockInfo.staff ?? [],
          dockInfo.areas ?? []
        ).map((item, index) => {
          const parts = lines[index].replace(/[()]/g, "").split(",");
          const delay = parts[3] ? parseInt(parts[3].trim(), 10) : 0;
          return { ...item, delay };
        });
      });

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
    totalDelay,
    generateSchedule,
  };
};
