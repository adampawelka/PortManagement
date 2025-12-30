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

  const generate = async () => {
    setLoading(true);
    setError("");
    setPlans([]);
    setExecutionTime(null);

    try {
      if (!date) throw new Error("Please select a date.");
      if (mode === "single" && !algorithm) throw new Error("Please select an algorithm.");

      const allVVN = await getVesselVisitNotifications(apiFetch);
      const vvnForDate = allVVN.filter(
        v => v.status === "Approved" && v.eta?.split("T")[0] === date
      );

      if (vvnForDate.length === 0) {
        throw new Error("No approved Vessel Visit Notifications found for this date.");
      }

      const scheduleResponse =
        mode === "single"
          ? await calculateSchedule(date, algorithm)
          : await calculateMultiCraneSchedule(date);

      const aggregated = {};

      Object.values(scheduleResponse || {}).forEach(dock => {
        const schedules =
          mode === "single"
            ? dock.singleCrane?.schedules || []
            : dock.multiCrane?.schedules || [];

        schedules.forEach(item => {
          const vesselKey = item.vesselName;
          if (!vesselKey) return;

          if (!aggregated[vesselKey]) {
            aggregated[vesselKey] = {
              vvnId: vesselKey,
              vesselName: vesselKey,
              dock: dock.dockName,
              crane: item.craneCodes?.join(", "),
              area: dock.area,
              operations: [],
            };
          }

          aggregated[vesselKey].operations.push({
            start: item.startTime,
            end: item.endTime,
            delay: item.delay ?? 0,
            staff: Array.isArray(item.staff)
              ? item.staff.map(s => s.shortName)
              : [],
            warning: item.warning || null
          });
        });
      });

      /** ✅ AGREGACJA STAFFU */
      const plansWithStaff = Object.values(aggregated).map(plan => {
        const allStaff = plan.operations.flatMap(op => op.staff);
        const uniqueStaff = [...new Set(allStaff)];

        return {
          ...plan,
          staff: uniqueStaff.length ? uniqueStaff : ["Unassigned"]
        };
      });

      setPlans(plansWithStaff);

      const firstDock = Object.values(scheduleResponse)[0];
      const execTime =
        mode === "single"
          ? firstDock?.singleCrane?.executionTime
          : firstDock?.multiCrane?.executionTime;

      setExecutionTime(execTime ?? null);

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
