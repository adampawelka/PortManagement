import { useState, useMemo } from "react";
import { useSchedulingService } from "../../services/schedulingService";
import { getVesselVisitNotifications } from "../../services/vesselVisitNotificationService";
import { useApi, useApiOEM } from "../../services/api";

const formatDateTime = (date) => {
  if (!date) return "N/A";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}.${month}.${year} ${hours}:${minutes}`;
};

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

export const useOperationalPlansVM = () => {
  const { apiFetch } = useApi();
  const { apiOemFetch } = useApiOem();
  const { calculateSchedule, calculateMultiCraneSchedule } = useSchedulingService();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plans, setPlans] = useState([]);
  const [executionTime, setExecutionTime] = useState(null);

  const [date, setDate] = useState("");
  const [mode, setMode] = useState("single");
  const [algorithm, setAlgorithm] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState(null);
  const [saveError, setSaveError] = useState("");  

  const normalizeName = (name) => name?.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "") || "";

  const generate = async () => {
    setLoading(true);
    setError("");
    setPlans([]);
    setExecutionTime(null);

    try {
      if (!date) throw new Error("Please select a date.");
      if (mode === "single" && !algorithm) throw new Error("Please select an algorithm.");

      const selectedDate = new Date(date);
      const allVVN = await getVesselVisitNotifications(apiFetch);
      const vvnForDate = allVVN.filter(v => v.status === "Approved" && v.eta?.split("T")[0] === date);

      if (vvnForDate.length === 0) {
        throw new Error("No approved Vessel Visit Notifications found for this date.");
      }

      const scheduleResponse =
        mode === "single"
          ? await calculateSchedule(date, algorithm)
          : await calculateMultiCraneSchedule(date);

      const aggregated = {};

      Object.values(scheduleResponse || {}).forEach(dockSchedule => {
        const singleItems = mode === "single" ? dockSchedule.parsedSchedule || [] : [];
        const multiItems = mode === "multi" ? dockSchedule.multiCrane?.schedules || [] : [];
        const items = mode === "single" ? singleItems : multiItems;

        items.forEach(item => {
          const matchingVVN = vvnForDate.find(v => normalizeName(v.VesselName) === normalizeName(item.vesselName));
          const vvnId = item.vesselId || (matchingVVN && matchingVVN.VesselId) || item.vesselName;
          if (!vvnId) return;

          if (!aggregated[vvnId]) {
            aggregated[vvnId] = {
              vvnId,
              vesselId: (item.vesselId || (matchingVVN && matchingVVN.VesselId)) || null,
              vesselName: matchingVVN?.VesselName || item.vesselName || "Unknown",
              dock: dockSchedule.dock || dockSchedule.dockName || "Unassigned",
              crane: item.craneCodes ? item.craneCodes.join(", ") : dockSchedule.crane || "Unassigned",
              area: dockSchedule.area || "Unassigned",
              operations: [],
            };
          }

          const delay = item.delay || 0;

          let startDateTime, endDateTime;

          if (typeof item.startSlot === "number") {
            const extraDays = Math.floor(item.startSlot / 24);
            const hour = item.startSlot % 24;
            startDateTime = addDays(selectedDate, extraDays);
            startDateTime.setHours(hour, 0, 0, 0);
          } else {
            startDateTime = item.start ? new Date(item.start) : new Date(selectedDate);
          }

          if (typeof item.endSlot === "number") {
            const extraDays = Math.floor(item.endSlot / 24);
            const hour = item.endSlot % 24;
            endDateTime = addDays(selectedDate, extraDays);
            endDateTime.setHours(hour, 0, 0, 0);
          } else {
            endDateTime = item.end ? new Date(item.end) : new Date(selectedDate);
          }

          aggregated[vvnId].operations.push({
            start: formatDateTime(startDateTime),
            end: formatDateTime(endDateTime),
            delay,
            staff: Array.isArray(item.staff) ? item.staff.map(s => s.shortName) : [],
            warning: item.warning || null,
          });
        });
      });

      const plansWithStaff = Object.values(aggregated).map(plan => {
        const allStaff = plan.operations.flatMap(op => op.staff || []);
        const uniqueStaff = [...new Set(allStaff)];
        return {
          ...plan,
          staff: uniqueStaff.length > 0 ? uniqueStaff : ["Unassigned"],
        };
      });

      setPlans(plansWithStaff);

      if (plansWithStaff.length > 0) {
        const firstDock = Object.values(scheduleResponse)[0];
        setExecutionTime(
          mode === "single"
            ? firstDock?.executionTime || null
            : firstDock?.multiCrane?.executionTime || null
        );
      }

    } catch (err) {
      setError(err?.message || "Failed to generate schedule.");
    } finally {
      setLoading(false);
    }
  };

  const totalDelay = useMemo(() => {
    return plans.reduce(
      (acc, plan) => acc + plan.operations.reduce((sum, op) => sum + (op.delay || 0), 0),
      0
    );
  }, [plans]);

  const savePlans = async (userId) => {
    if (plans.length === 0) {
      setSaveError("No plans to save");
      return;
    }

    setSaving(true);
    setSaveError("");
    setSaveResult(null);

    try {
      // Transform plans to DTO format
      const plansToSave = plans.map(plan => ({
        vvnId: plan.vvnId,
        createdAt: new Date(),
        createdBy: userId || "system",
        algorithmUsed: algorithm || (mode === "multi" ? "multi_crane" : algorithm),
        schedule: plan.operations.map(op => ({
          vesselName: plan.vesselName,
          start: new Date(op.start), // Convert string back to Date
          end: new Date(op.end),
          delay: op.delay || 0,
          dock: plan.dock,
          cranes: plan.crane ? [plan.crane] : [],
          staff: plan.staff || []
        }))
      }));

      const metadata = {
        algorithmUsed: algorithm || (mode === "multi" ? "multi_crane" : algorithm),
        createdBy: userId || "system",
        generatedAt: new Date().toISOString(),
        mode: mode,
        date: date
      };

      const result = await saveGeneratedPlans(apiOemFetch, plansToSave, metadata);
      setSaveResult({
        success: true,
        count: result.length,
        message: `Successfully saved ${result.length} operation plans`
      });

    } catch (error) {
      setSaveError(error.message || "Failed to save plans");
      setSaveResult({
        success: false,
        message: "Failed to save plans"
      });
    } finally {
      setSaving(false);
    }
  };

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
    saving,
    saveResult,
    saveError,
    savePlans
  };
};
