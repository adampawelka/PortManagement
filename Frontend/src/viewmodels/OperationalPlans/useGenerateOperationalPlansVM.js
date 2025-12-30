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

      Object.values(scheduleResponse || {}).forEach(dockSchedule => {

        /** 🔹 SINGLE (optimal / heuristic) – JAK BYŁO */
        const singleItems =
          mode === "single"
            ? dockSchedule.parsedSchedule || []
            : [];

        /** 🔹 MULTI – NOWA OBSŁUGA */
        const multiItems =
          mode === "multi"
            ? dockSchedule.multiCrane?.schedules || []
            : [];

        const items = mode === "single" ? singleItems : multiItems;

        items.forEach(item => {
          const vvnId = item.vesselId || item.VVN || item.vesselName;
          if (!vvnId) return;

          if (!aggregated[vvnId]) {
            aggregated[vvnId] = {
              vvnId,
              vesselId: item.vesselId || null,
              vesselName: item.vesselName || "Unknown",
              dock: dockSchedule.dock || dockSchedule.dockName,
              crane: item.craneCodes
                ? item.craneCodes.join(", ")
                : dockSchedule.crane,
              area: dockSchedule.area,
              operations: [],
            };
          }

          aggregated[vvnId].operations.push({
            start: item.start || item.Start || item.startTime,
            end: item.end || item.End || item.endTime,
            delay: item.delay ?? calculateDelay(item.endSlot, item.ETD),
            staff: Array.isArray(item.staff)
              ? item.staff.map(s => s.shortName)
              : [],
            warning: item.warning || null
          });
        });
      });

      /** ✅ AGREGACJA STAFFU (DZIAŁA DLA SINGLE + MULTI) */
      const plansWithStaff = Object.values(aggregated).map(plan => {
        const allStaff = plan.operations.flatMap(op => op.staff || []);
        const uniqueStaff = [...new Set(allStaff)];

        return {
          ...plan,
          staff: uniqueStaff.length > 0 ? uniqueStaff : ["Unassigned"]
        };
      });

      setPlans(plansWithStaff);

      /** executionTime */
      if (plansWithStaff.length > 0) {
        const firstDock = Object.values(scheduleResponse)[0];
        setExecutionTime(
          mode === "single"
            ? firstDock?.executionTime ?? null
            : firstDock?.multiCrane?.executionTime ?? null
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
