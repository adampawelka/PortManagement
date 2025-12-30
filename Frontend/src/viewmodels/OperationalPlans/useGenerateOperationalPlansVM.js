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

  // Heuristic delay calculation
  const heuristicDelay = (endSlot, etd) => {
    if (typeof endSlot !== "number" || !etd) return 0;
    const etdDate = new Date(etd);
    const endDate = new Date(etdDate.getTime());
    endDate.setHours(0, 0, 0, 0);
    endDate.setHours(endDate.getHours() + endSlot);
    const diffHours = Math.round((endDate - etdDate) / (1000 * 60 * 60));
    return diffHours > 0 ? diffHours : 0;
  };

  // Normalize vessel name for comparison
  const normalizeName = (name) => name?.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "") || "";

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
          // Find matching VVN by normalized vessel name
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

          // Delay: heuristic for heuristic algorithm, otherwise use backend delay
          const delay = algorithm === "heuristic" && matchingVVN && typeof item.endSlot === "number"
            ? heuristicDelay(item.endSlot, matchingVVN.ETD || matchingVVN.etd)
            : item.delay || 0;

          aggregated[vvnId].operations.push({
            start: item.start || item.Start || item.startTime || "N/A",
            end: item.end || item.End || item.endTime || "N/A",
            delay,
            staff: Array.isArray(item.staff) ? item.staff.map(s => s.shortName) : [],
            warning: item.warning || null,
          });
        });
      });

      // Aggregate staff
      const plansWithStaff = Object.values(aggregated).map(plan => {
        const allStaff = plan.operations.flatMap(op => op.staff || []);
        const uniqueStaff = [...new Set(allStaff)];

        return {
          ...plan,
          staff: uniqueStaff.length > 0 ? uniqueStaff : ["Unassigned"],
        };
      });

      setPlans(plansWithStaff);

      // Execution time
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
