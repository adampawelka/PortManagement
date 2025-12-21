import { useState } from "react";
import { useSchedulingService } from "../../services/schedulingService";
import { useApi } from "../../services/api";
import { getVesselVisitNotifications } from "../../services/vesselVisitNotificationService";

export const useGeneticScheduleVM = () => {
    const { calculateGeneticSchedule, testGeneticAlgorithm } = useSchedulingService();
    const { apiFetch } = useApi();

    const [targetDate, setTargetDate] = useState("");
    const [algorithmType, setAlgorithmType] = useState("single");
    const [geneticParams, setGeneticParams] = useState({
    populationSize: 50,
    generations: 100,
    crossoverRate: 0.8,    // Decimal
    mutationRate: 0.1,     // Decimal
    maxTime: 10,
    desiredDelay: 0
});
    const [scheduleResults, setScheduleResults] = useState([]);
    const [vesselNotifications, setVesselNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [performanceMetrics, setPerformanceMetrics] = useState({
        executionTime: null,
        totalDelay: 0,
        craneHours: 0,
        delayReduction: 0,
        percentageImprovement: 0,
        algorithmParameters: null,
        dockSchedules: {}  // NEW: Store schedules by dock
    });

    // --- Helpers ---
    const slotToTime = (slot) => {
        const n = parseInt(slot);
        if (isNaN(n)) return slot;
        const hours = n % 24;
        const days = Math.floor(n / 24);
        return days > 0
            ? `${hours.toString().padStart(2, "0")}:00 (+${days}d)`
            : `${hours.toString().padStart(2, "0")}:00`;
    };

    const parseGeneticResult = (data, mode) => {
        const dockSchedules = {};
        const allSchedules = [];
        let performance = {
            executionTime: 0,
            totalDelay: 0,
            craneHours: 0,
            delayReduction: 0,
            percentageImprovement: 0,
            algorithmParameters: null
        };

        // Handle API response structure
        if (typeof data === 'object' && !Array.isArray(data)) {
            // Check if it's a test result
            if (data.algorithm && data.algorithm.includes("Genetic Algorithm")) {
                performance.executionTime = parseFloat(data.executionTime) || 0;
                performance.totalDelay = parseInt(data.totalDelay) || 0;
                performance.algorithmParameters = {
                    populationSize: geneticParams.populationSize,
                    generations: geneticParams.generations,
                    crossoverRate: geneticParams.crossoverRate,
                    mutationRate: geneticParams.mutationRate
                };
                
                // Create test schedules from solution string
                if (data.sequence) {
                    const vessels = data.sequence.replace(/[\[\]]/g, '').split(',').map(v => v.trim());
                    vessels.forEach((vessel, index) => {
                        if (vessel) {
                            const schedule = {
                                vessel: vessel,
                                dock: "Test Dock",
                                crane: "Test Crane",
                                start: slotToTime(8 + index * 2),
                                end: slotToTime(10 + index * 2),
                                staff: "Test Staff",
                                area: "Test Area",
                                cranesUsed: mode === "multi" ? 2 : 1
                            };
                            allSchedules.push(schedule);
                        }
                    });
                }
            } 
            // Handle dock-based schedule structure
            else {
                Object.entries(data).forEach(([dockId, dockInfo]) => {
                    const dockName = dockInfo.dockName || dockInfo.dock || `Dock ${dockId}`;
                    
                    // Store dock schedule
                    dockSchedules[dockId] = {
                        dockName: dockName,
                        schedules: [],
                        performance: {}
                    };

                    // Parse algorithm parameters
                    if (dockInfo.parameters) {
                        performance.algorithmParameters = dockInfo.parameters;
                    }

                    // Parse schedules
                    if (dockInfo.schedule && Array.isArray(dockInfo.schedule)) {
                        dockInfo.schedule.forEach(schedule => {
                            const vesselSchedule = {
                                vessel: schedule.vessel || schedule.vesselName || "",
                                dock: dockName,
                                crane: schedule.craneCode || schedule.crane || "Auto",
                                start: slotToTime(schedule.startSlot || schedule.StartSlot || schedule.start),
                                end: slotToTime(schedule.endSlot || schedule.EndSlot || schedule.end),
                                staff: "Auto",
                                area: "Auto",
                                cranesUsed: schedule.cranesUsed || schedule.cranes || (mode === "multi" ? 2 : 1),
                                containers: schedule.containers || 0,
                                processingTime: schedule.processingTime || 0
                            };
                            dockSchedules[dockId].schedules.push(vesselSchedule);
                            allSchedules.push(vesselSchedule);
                        });
                    }

                    // Parse performance metrics
                    if (dockInfo.performance) {
                        dockSchedules[dockId].performance = dockInfo.performance;
                        performance.executionTime = Math.max(
                            performance.executionTime, 
                            dockInfo.performance.computationTime || 0
                        );
                        performance.totalDelay += dockInfo.performance.totalDelay || 0;
                        performance.craneHours += dockInfo.performance.craneHours || 0;
                    }

                    // Parse improvement metrics
                    if (dockInfo.improvement) {
                        performance.delayReduction += dockInfo.improvement.delayReduction || 0;
                        performance.percentageImprovement = Math.max(
                            performance.percentageImprovement,
                            dockInfo.improvement.percentageImprovement || 0
                        );
                    }
                });
            }
        }

        return { 
            schedules: allSchedules, 
            performance, 
            dockSchedules 
        };
    };

    // --- Generate Genetic Schedule ---
    const generateGeneticSchedule = async () => {
        setError("");
        setScheduleResults([]);
        setPerformanceMetrics({
            executionTime: null,
            totalDelay: 0,
            craneHours: 0,
            delayReduction: 0,
            percentageImprovement: 0,
            algorithmParameters: null,
            dockSchedules: {}
        });

        if (!targetDate) {
            setError("Please select a date");
            return;
        }

        const isoDate = new Date(targetDate).toISOString().split("T")[0];
        setLoading(true);

        try {
            // 1. Fetch Vessel Visit Notifications
            const allNotifs = await getVesselVisitNotifications(apiFetch);
            const filtered = allNotifs.filter(
                (n) =>
                    n.status === "Approved" &&
                    new Date(n.eta).toISOString().split("T")[0] === isoDate
            );
            setVesselNotifications(filtered);

            if (filtered.length === 0) {
                // No vessels for selected date - run test with sample data
                const testResult = await testGeneticAlgorithm({
                    populationSize: geneticParams.populationSize,
                    generations: geneticParams.generations,
                    crossoverRate: geneticParams.crossoverRate,
                    mutationRate: geneticParams.mutationRate,
                    maxCranes: algorithmType === "multi" ? 2 : 1,
                    multiCrane: algorithmType === "multi"
                });
                
                const { schedules, performance } = parseGeneticResult(testResult, algorithmType);
                setScheduleResults(schedules);
                setPerformanceMetrics(prev => ({ ...prev, ...performance }));
                setError("No approved vessels for selected date. Showing test results with sample data.");
            } else {
                // 2. Generate Genetic Schedule with actual vessel data
                const result = await calculateGeneticSchedule(
                    isoDate,
                    algorithmType,
                    geneticParams
                );

                // 3. Parse results
                const { schedules, performance, dockSchedules } = parseGeneticResult(result, algorithmType);
                setScheduleResults(schedules);
                setPerformanceMetrics(prev => ({ 
                    ...prev, 
                    ...performance, 
                    dockSchedules 
                }));
            }

        } catch (err) {
            console.error("Genetic scheduling error:", err);
            setError(`Genetic scheduling failed: ${err.message || "Unknown error"}`);
        } finally {
            setLoading(false);
        }
    };

    // Update genetic parameter
const updateGeneticParam = (param, value) => {
    let processedValue = typeof value === 'string' ? parseFloat(value) : value;
    
    // Convert percentages for API
    if (param === 'crossoverRate' || param === 'mutationRate') {
        processedValue = processedValue / 100;
    }
    
    setGeneticParams(prev => ({
        ...prev,
        [param]: processedValue
    }));
};

    // Reset parameters to defaults
    const resetGeneticParams = () => {
        setGeneticParams({
            populationSize: 50,
            generations: 100,
            crossoverRate: 80,
            mutationRate: 10,
            maxTime: 10,
            desiredDelay: 0
        });
    };

    // Get dock summary
    const getDockSummary = () => {
        const { dockSchedules } = performanceMetrics;
        if (!dockSchedules || Object.keys(dockSchedules).length === 0) {
            return null;
        }
        
        return Object.entries(dockSchedules).map(([dockId, dockInfo]) => ({
            id: dockId,
            name: dockInfo.dockName,
            vesselCount: dockInfo.schedules?.length || 0,
            delay: dockInfo.performance?.totalDelay || 0,
            executionTime: dockInfo.performance?.computationTime || 0
        }));
    };

    return {
        targetDate,
        setTargetDate,
        algorithmType,
        setAlgorithmType,
        geneticParams,
        updateGeneticParam,
        resetGeneticParams,
        scheduleResults,
        vesselNotifications,
        loading,
        error,
        performanceMetrics,
        generateGeneticSchedule,
        getDockSummary  // NEW: Expose dock summary
    };
};