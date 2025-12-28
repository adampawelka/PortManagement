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

    const aggregated = {};
    const normalizeName = (str) => (str ? str.toString().toLowerCase().replace(/\s+/g, "_") : "");

    if (mode === "single") {
      const parsed = typeof json === "string" ? JSON.parse(json) : json;

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
            n => normalizeName(n.vesselName) === normalizeName(item.vessel)
          );

          let delay = 0;
          if (algorithm === "optimal") {
            const parts = lines[index]?.replace(/[()]/g, "").split(",");
            delay = parts && parts[3] ? parseInt(parts[3].trim(), 10) : 0;
          } else if (algorithm === "heuristic") {
            delay = note && item.endSlot != null ? calculateDelay(item.endSlot, note.etd) : 0;
          }

          const startObj = convertHourToDateObj(date, item.startSlot);
          const endObj = convertHourToDateObj(date, item.endSlot);

          const vvnId = note?.id || null;

          if (!vvnId) return null;

          if (!aggregated[vvnId]) {
            aggregated[vvnId] = {
              vvnId,
              vesselId: note?.vesselId || null,
              vesselName: note?.vesselName || item.vessel || "Unknown",
              dock: info.dock,
              crane: info.crane,
              area: info.area,
              operations: [],
            };
          }

          aggregated[vvnId].operations.push({
            start: formatDateTimeReadable(startObj),
            end: formatDateTimeReadable(endObj),
            delay,
          });

          return null;
        });
      }
    }

    if (mode === "multi") {
      const parsed = typeof json === "string" ? JSON.parse(json) : json;

      for (const dockData of Object.values(parsed)) {
        const schedules = dockData?.multiCrane?.schedules;
        if (!Array.isArray(schedules)) continue;

        for (const s of schedules) {
          const startSlot = Number(s.startSlot ?? s.StartSlot);
          const endSlot = Number(s.endSlot ?? s.EndSlot);

          if (Number.isNaN(startSlot) || Number.isNaN(endSlot)) continue;


          const vesselName = s.vesselName ?? s.VesselName ?? "Unknown";

          const vvnId = `multi_${normalizeName(vesselName)}`;

          aggregated[vvnId] = {
            vesselName,
            dock: dockData.dockName,
            crane: (s.craneCodes ?? s.CraneCodes ?? []).join(", "),
            area: dockData.area,
            operations: [],
          };

          aggregated[vvnId].operations.push({
            start: formatDateTimeReadable(convertHourToDateObj(date, startSlot)),
            end: formatDateTimeReadable(convertHourToDateObj(date, endSlot)),
            delay: Number(s.delay ?? s.Delay ?? 0),
            warning: s.warning ?? s.Warning ?? null,
          });

        }
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
