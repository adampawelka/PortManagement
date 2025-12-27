import { useState, useMemo } from "react";
import { useSchedulingService } from "../../services/schedulingService";
import { getVesselVisitNotifications } from "../../services/vesselVisitNotificationService";
import { useApi } from "../../services/api";

export const useOperationalPlansVM = () => {
  const { apiFetch } = useApi();
  const { calculateSchedule, calculateMultiCraneSchedule, parsePrologResult } = useSchedulingService();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plans, setPlans] = useState([]);
  const [executionTime, setExecutionTime] = useState(null);

  const [date, setDate] = useState("");
  const [mode, setMode] = useState("single");
  const [algorithm, setAlgorithm] = useState("");

  const normalizeScheduleName = (str = "") => str.replace(/_/g, " ").trim().toLowerCase();
  const normalizeVVNName = (str = "") => str.replace(/\s+/g, " ").trim().toLowerCase();

  const extractExecutionTime = (txt = "") => {
    const patterns = [
      /Execution Time:\s*([\d.e-]+)/i,
      /Heuristic Execution Time:\s*([\d.e-]+)/i,
    ];
    for (const p of patterns) {
      const match = txt.match(p);
      if (match) return parseFloat(match[1]);
    }
    return null;
  };

  const calculateDelay = (endSlot, etd) => {
    if (endSlot == null || !etd) return 0;
    const etdHour = new Date(etd).getHours();
    const delay = endSlot - etdHour;
    return delay > 0 ? delay : 0;
  };

  const convertHourToDateObj = (dayStr, hourInt) => {
    const base = new Date(`${dayStr}T00:00:00`);
    const addDays = Math.floor(hourInt / 24);
    const hourOfDay = hourInt % 24;
    base.setDate(base.getDate() + addDays);
    base.setHours(hourOfDay, 0, 0, 0);
    return base;
  };

  const formatDateTimeReadable = (dateObj) => {
    const d = new Date(dateObj);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

  const parsePlans = (json, allVVN) => {
    if (!json) return [];

    const parsed = typeof json === "string" ? JSON.parse(json) : json;
    const aggregated = {};

    for (const key in parsed) {
      const info = parsed[key];
      if (!info?.schedule) continue;

      const lines = info.schedule.split(/\),/);

      const operations = parsePrologResult(
        info.schedule,
        info.vessels ?? [],
        info.dock,
        info.crane,
        info.staff ?? [],
        info.areas ?? []
      ).map((item, index) => {
        const note = allVVN.find(
          n => n.vesselName && n.vesselName.toLowerCase().replace(/\s+/g, "_") === item.vessel.toLowerCase()
        );

        let delay = 0;
        if (algorithm === "optimal") {
          // Delay z Prologa – 4 element linii harmonogramu
          const parts = lines[index]?.replace(/[()]/g, "").split(",");
          delay = parts && parts[3] ? parseInt(parts[3].trim(), 10) : 0;
        } else if (algorithm === "heuristic") {
          // Heurystyki: licz dynamicznie względem ETD
          delay = note && item.endSlot != null ? calculateDelay(item.endSlot, note.etd) : 0;
        }

        const startObj = convertHourToDateObj(date, item.startSlot);
        const endObj = convertHourToDateObj(date, item.endSlot);

        return {
          vesselName: note?.vesselName || item.vessel,
          vesselId: note?.vesselId || null,
          vvnId: note?.id || null,
          dock: info.dock,
          crane: info.crane,
          area: info.area,
          start: formatDateTimeReadable(startObj),
          end: formatDateTimeReadable(endObj),
          delay,
        };
      });

      for (const op of operations) {
        if (!op.vvnId) continue;

        if (!aggregated[op.vvnId]) {
          aggregated[op.vvnId] = {
            vvnId: op.vvnId,
            vesselId: op.vesselId,
            vesselName: op.vesselName,
            dock: op.dock,
            crane: op.crane,
            area: op.area,
            operations: [],
          };
        }

        aggregated[op.vvnId].operations.push({
          start: op.start,
          end: op.end,
          delay: op.delay,
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
      if (mode === "single" && !algorithm) throw new Error("Please select an algorithm.");

      const allVVN = await getVesselVisitNotifications(apiFetch);
      const vvnForDate = allVVN.filter(v => v.status === "Approved" && v.eta?.split("T")[0] === date);

      if (vvnForDate.length === 0) throw new Error("No approved Vessel Visit Notifications found for this date.");

      const scheduleResponse =
        mode === "single"
          ? await calculateSchedule(date, algorithm)
          : await calculateMultiCraneSchedule(date);

      const parsed = parsePlans(scheduleResponse, allVVN);
      setPlans(parsed);
    } catch (err) {
      setError(err?.message || "Failed to generate schedule.");
    } finally {
      setLoading(false);
    }
  };

  const totalDelay = useMemo(() => {
    return plans.reduce((acc, plan) => acc + plan.operations.reduce((sum, op) => sum + (op.delay || 0), 0), 0);
  }, [plans]);

  return {
    loading,
    error,
    plans,
    executionTime,
    totalDelay,

    date,
    setDate,

    mode,
    setMode,

    algorithm,
    setAlgorithm,

    generate,
  };
};
