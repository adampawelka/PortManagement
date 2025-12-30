import { useState, useMemo } from "react";
import { useSchedulingService } from "../../services/schedulingService";
import { getVesselVisitNotifications } from "../../services/vesselVisitNotificationService";
import { useApi } from "../../services/api";

export const useOperationalPlansVM = () => {
  const { apiFetch } = useApi();
  const { calculateSchedule, calculateMultiCraneSchedule } = useSchedulingService();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plans, setPlans] = useState([]);
  const [executionTime, setExecutionTime] = useState(null);

  const [date, setDate] = useState("");
  const [mode, setMode] = useState("single");
  const [algorithm, setAlgorithm] = useState("");

  const calculateDelay = (endSlot, etd) => {
    if (endSlot == null || !etd) return 0;
    const etdHour = new Date(etd).getHours();
    const delay = endSlot - etdHour;
    return delay > 0 ? delay : 0;
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

      const aggregated = {};

      Object.values(scheduleResponse || {}).forEach(dockSchedule => {
        (dockSchedule.parsedSchedule || []).forEach(item => {
          const vvnId = item.vesselId || item.VVN || item.vesselName;
          if (!vvnId) return;

          if (!aggregated[vvnId]) {
            aggregated[vvnId] = {
              vvnId,
              vesselId: item.vesselId || null,
              vesselName: item.vesselName || "Unknown",
              dock: dockSchedule.dock,
              crane: dockSchedule.crane,
              area: dockSchedule.area,
              operations: [],
            };
          }

          aggregated[vvnId].operations.push({
  start: item.start || item.Start,
  end: item.end || item.End,
  delay: item.delay ?? calculateDelay(item.endSlot, item.ETD),
  staff: Array.isArray(item.staff) && item.staff.length > 0
    ? item.staff.map(s => s.shortName) 
    : ["Unassigned"]
});

        });
      });

      const plansWithDelay = Object.values(aggregated);
      setPlans(plansWithDelay);

      if (plansWithDelay.length > 0) {
        const firstDockSchedule = Object.values(scheduleResponse)[0];
        setExecutionTime(firstDockSchedule?.executionTime ?? null);
      }
    } catch (err) {
      setError(err?.message || "Failed to generate schedule.");
    } finally {
      setLoading(false);
    }
  };

  const totalDelay = useMemo(() => {
    return plans.reduce(
      (acc, plan) =>
        acc + plan.operations.reduce((sum, op) => sum + (op.delay || 0), 0),
      0
    );
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
