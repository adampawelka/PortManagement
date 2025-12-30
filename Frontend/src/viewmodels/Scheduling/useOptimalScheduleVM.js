import { useState, useMemo } from "react";
import { useSchedulingService } from "../../services/schedulingService";
import { useApi } from "../../services/api";
import { getVesselVisitNotifications } from "../../services/vesselVisitNotificationService";

export const useOptimalScheduleVM = () => {
    const { calculateSchedule } = useSchedulingService();
    const { apiFetch } = useApi();

    const [targetDate, setTargetDate] = useState("");
    const [scheduleResults, setScheduleResults] = useState([]);
    const [vesselNotifications, setVesselNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [executionTime, setExecutionTime] = useState(null);

    const totalDelay = useMemo(() => scheduleResults.reduce((acc, item) => acc + (item.delay || 0), 0), [scheduleResults]);

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
            // Pobierz wszystkie powiadomienia o statkach
            const allNotifs = await getVesselVisitNotifications(apiFetch);
            const filtered = allNotifs.filter(n => 
                n.status === "Approved" &&
                new Date(n.eta).toISOString().split("T")[0] === isoDate
            );
            setVesselNotifications(filtered);

            // Pobierz harmonogram z kontrolera
            const json = await calculateSchedule(isoDate, "optimal");

            // Flatten parsedSchedule ze wszystkich docków
            const parsed = Object.values(json)
    .flatMap(dockInfo => dockInfo.parsedSchedule ?? [])
    .map(item => ({
        vessel: item.VesselName,
        vesselId: item.VesselId,
        startSlot: item.StartSlot,
        endSlot: item.EndSlot,
        start: item.Start,
        end: item.End,
        dock: dockInfo.dock, // z dockInfo
        crane: item.CraneCodes?.[0] || null,
        staff: item.Staff?.map(s => s.ShortName) || [],
        warning: item.Warning || null,
        delay: item.Delay || 0
    }));
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
        generateSchedule
    };
};
