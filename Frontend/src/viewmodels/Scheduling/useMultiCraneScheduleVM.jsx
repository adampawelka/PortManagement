import { useState } from "react";
import { useApi } from "../../services/api";
import { useSchedulingService } from "../../services/schedulingService";
import { getVesselVisitNotifications } from "../../services/vesselVisitNotificationService";

export const useScheduleMultiCraneVM = () => {
  const { apiFetch } = useApi();
  const { calculateMultiCraneSchedule } = useSchedulingService();

  const [targetDate, setTargetDate] = useState("");
  const [scheduleResults, setScheduleResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const slotToTime = (slot) => {
    if (typeof slot !== "number") return "N/A";
    const hours = slot % 24;
    const days = Math.floor(slot / 24);
    const time = `${hours.toString().padStart(2, "0")}:00`;
    return days > 0 ? `${time} (+${days}d)` : time;
  };

  const randomStaff = (staffList) => {
    if (!staffList || staffList.length === 0) return "Unassigned";
    return staffList[Math.floor(Math.random() * staffList.length)].mecanographicNumber;
  };

  const getVesselName = (schedule, vessels) => {
    if (schedule.vesselName) return schedule.vesselName;
    if (schedule.VesselName) return schedule.VesselName;
    return "Unknown Vessel";
  };

  const generateSchedule = async () => {
    if (!targetDate) {
      setError("Please select a date");
      return;
    }

    const isoDate = new Date(targetDate).toISOString().split("T")[0];
    setLoading(true);
    setError("");
    setScheduleResults(null);

    try {
      const allNotifications = await getVesselVisitNotifications(apiFetch);

      const vesselsForDate = allNotifications.filter(
        (n) =>
          n.status === "Approved" &&
          new Date(n.eta).toISOString().split("T")[0] === isoDate
      );

      const data = await calculateMultiCraneSchedule(isoDate);

      if (!data || typeof data !== "object") {
        throw new Error("Invalid response from scheduling API");
      }

      const processed = Object.entries(data).map(([dockId, dockInfo]) => {
        const dockVessels = vesselsForDate.filter(
          (v) =>
            v.assignedDockId &&
            v.assignedDockId.toString() === dockId.toString()
        );

        const singleRaw = dockInfo.singleCrane?.schedules ?? [];
        const multiRaw = dockInfo.multiCrane?.schedules ?? [];

        const single = singleRaw.map((s) => {
  const startSlot = typeof s.startSlot === "number" ? s.startSlot : (typeof s.StartSlot === "number" ? s.StartSlot : 0);
  const vesselInfo = dockVessels.find(
    (v) =>
      (v.VesselName || v.vesselName)?.toLowerCase().replace(/[\s-]/g, "_") === (s.vesselName || s.VesselName || "").toLowerCase()
  );

  const etaHour = vesselInfo ? (() => {
    const eta = new Date(vesselInfo.ETA);
    if (isNaN(eta.getTime())) return 0;
    return eta.getHours() + (eta.getMinutes() >= 30 ? 1 : 0);
  })() : 0;

  const delay = Math.max(0, startSlot - etaHour);

  return {
    vessel: getVesselName(s, dockVessels),
    dock: dockInfo.dockName,
    crane: dockInfo.craneCode,
    start: s.startTime ?? slotToTime(startSlot),
    end: s.endTime ?? slotToTime(s.endSlot ?? s.EndSlot ?? startSlot),
    startSlot,
    endSlot: s.endSlot ?? s.EndSlot ?? startSlot,
    cranes: s.cranesUsed ?? s.CranesUsed ?? 1,
    staff: randomStaff(dockInfo.staff),
    area: dockInfo.area,
    delay,
  };
});



        const multi = multiRaw.map((s) => {
  const startSlot = typeof s.startSlot === "number" ? s.startSlot : (typeof s.StartSlot === "number" ? s.StartSlot : 0);
  const vesselInfo = dockVessels.find(
    (v) =>
      (v.VesselName || v.vesselName)?.toLowerCase().replace(/[\s-]/g, "_") === (s.vesselName || s.VesselName || "").toLowerCase()
  );

  const etaHour = vesselInfo ? (() => {
    const eta = new Date(vesselInfo.ETA);
    if (isNaN(eta.getTime())) return 0;
    return eta.getHours() + (eta.getMinutes() >= 30 ? 1 : 0);
  })() : 0;

  const delay = Math.max(0, startSlot - etaHour);

  return {
    vessel: getVesselName(s, dockVessels),
    dock: dockInfo.dockName,
    crane: dockInfo.craneCode,
    start: s.startTime ?? slotToTime(startSlot),
    end: s.endTime ?? slotToTime(s.endSlot ?? s.EndSlot ?? startSlot),
    startSlot,
    endSlot: s.endSlot ?? s.EndSlot ?? startSlot,
    cranes: s.cranesUsed ?? 1,
    staff: randomStaff(dockInfo.staff),
    area: dockInfo.area,
    delay,
  };
});




        return {
          dockId,
          dockName: dockInfo.dockName,
          craneCode: dockInfo.craneCode,
          staff: dockInfo.staff,
          area: dockInfo.area,
          singleCrane: {
            schedules: single,
            delay: dockInfo.singleCrane?.delay ?? 0,
            craneHours: dockInfo.singleCrane?.craneHours ?? 0,
          },
          multiCrane: {
            schedules: multi,
            delay: dockInfo.multiCrane?.delay ?? 0,
            craneHours: dockInfo.multiCrane?.craneHours ?? 0,
          },
          improvement: dockInfo.improvement ?? {
            delayReduction: 0,
            additionalCraneHours: 0,
            percentageImprovement: 0,
          },
        };
      });

      setScheduleResults(processed);
    } catch (err) {
      setError(
        "Multi-crane scheduling failed: " + (err.message || String(err))
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    targetDate,
    setTargetDate,
    loading,
    error,
    scheduleResults,
    generateSchedule,
  };
};
