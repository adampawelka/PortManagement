import { useState, useMemo } from "react";
import { useSchedulingService } from "../../services/schedulingService";
import { getVesselVisitNotifications } from "../../services/vesselVisitNotificationService";
import { useApi, useApiOEM } from "../../services/api";
import { addOperationalPlan } from "../../services/operationalPlanService";
import { useAuth0 } from "@auth0/auth0-react";

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
  const { apiOemFetch } = useApiOEM();
  const { user } = useAuth0();
  const { calculateSchedule, calculateMultiCraneSchedule } = useSchedulingService();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plans, setPlans] = useState([]);
  const [executionTime, setExecutionTime] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [date, setDate] = useState("");
  const [mode, setMode] = useState("single");
  const [algorithm, setAlgorithm] = useState("");

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

  const savePlans = async () => {
    if (plans.length === 0) {
      setError("No plans to save. Please generate plans first.");
      return;
    }

    setSaving(true);
    setError("");
    setSaveSuccess(false);

    try {
      const createdBy = user?.sub || user?.email || "unknown";
      const createdAt = new Date().toISOString();
      const algorithmUsed = mode === "single" ? algorithm : "multi_crane";

      // Save each plan separately
      const savePromises = plans.map(async (plan) => {
        // Transform operations to schedule format
        const schedule = plan.operations.map(op => {
          // Parse the formatted date strings back to ISO dates
          const parseFormattedDate = (dateStr) => {
            if (!dateStr) return new Date().toISOString();
            // Format: "23.11.2025 07:00"
            const parts = dateStr.split(" ");
            if (parts.length !== 2) return new Date().toISOString();
            
            const [datePart, timePart] = parts;
            const [day, month, year] = datePart.split(".");
            const [hour, minute] = timePart.split(":");
            
            return new Date(
              parseInt(year),
              parseInt(month) - 1,
              parseInt(day),
              parseInt(hour),
              parseInt(minute || 0)
            ).toISOString();
          };

          return {
            vesselName: plan.vesselName,
            start: parseFormattedDate(op.start),
            end: parseFormattedDate(op.end),
            delay: op.delay || 0,
            dock: plan.dock || "Unassigned",
            cranes: plan.crane ? plan.crane.split(", ") : [],
            staff: Array.isArray(plan.staff) ? plan.staff : []
          };
        });

        const createDto = {
          vvnId: plan.vvnId,
          createdAt: createdAt,
          createdBy: createdBy,
          algorithmUsed: algorithmUsed,
          schedule: schedule
        };

        return addOperationalPlan(apiOemFetch, createDto);
      });

      await Promise.all(savePromises);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000); // Hide success message after 3 seconds
    } catch (err) {
      console.error("Error saving plans:", err);
      const errorMessage = err?.message || "Failed to save operation plans.";
      setError(errorMessage);
      // Clear error after 5 seconds
      setTimeout(() => setError(""), 5000);
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
    savePlans,
    saving,
    saveSuccess,
  };
};
