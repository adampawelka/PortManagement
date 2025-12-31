import { useState, useMemo } from "react";
import { useSchedulingService } from "../../services/schedulingService";
import { useApi } from "../../services/api";
import { getVesselVisitNotifications } from "../../services/vesselVisitNotificationService";

export const useGeneticScheduleVM = () => {
  const { calculateGeneticSchedule } = useSchedulingService();
  const { apiFetch } = useApi();

  const [targetDate, setTargetDate] = useState("");
  const [scheduleResults, setScheduleResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Genetic Algorithm parameters
  const [populationSize, setPopulationSize] = useState(30);
  const [generations, setGenerations] = useState(50);
  const [crossoverRate, setCrossoverRate] = useState(0.8);
  const [mutationRate, setMutationRate] = useState(0.2);
  const [cranes, setCranes] = useState(1);
  
  // Results metadata
  const [executionTime, setExecutionTime] = useState(null);
  const [totalDelay, setTotalDelay] = useState(0);
  const [algorithmParameters, setAlgorithmParameters] = useState({});
  const [dockSchedules, setDockSchedules] = useState({});

  // Calculate total delay from all schedules
  const calculateTotalDelay = (schedules) => {
    return schedules.reduce((acc, schedule) => {
      if (schedule.schedules && Array.isArray(schedule.schedules)) {
        return acc + schedule.schedules.reduce((sum, vessel) => sum + (vessel.delay || 0), 0);
      }
      return acc;
    }, 0);
  };

  // Parse genetic algorithm results
  const parseGeneticResults = (data) => {
    const results = [];
    
    Object.entries(data).forEach(([dockId, dockInfo]) => {
      if (dockInfo.schedule && Array.isArray(dockInfo.schedule)) {
        dockInfo.schedule.forEach((vesselSchedule) => {
          results.push({
            vessel: vesselSchedule.vesselName || vesselSchedule.VesselName,
            start: vesselSchedule.startTime || vesselSchedule.StartTime,
            end: vesselSchedule.endTime || vesselSchedule.EndTime,
            delay: vesselSchedule.delay || vesselSchedule.Delay || 0,
            dock: dockInfo.dock || dockInfo.dockName,
            cranes: vesselSchedule.cranesUsed || vesselSchedule.CranesUsed || 1,
            crane: dockInfo.craneCode || dockInfo.crane || "Crane",
            staff: vesselSchedule.staff ? 
              vesselSchedule.staff.map(s => s.shortName || s.name).join(", ") : 
              "Unassigned",
            warning: vesselSchedule.warning || ""
          });
        });
      }
    });
    
    return results;
  };

  // Generate schedule using genetic algorithm
  const generateSchedule = async () => {
    setError("");
    if (!targetDate) {
      setError("Please select a date");
      return;
    }

    // Validate parameters
    if (populationSize < 10 || populationSize > 500) {
      setError("Population size must be between 10 and 500");
      return;
    }
    
    if (generations < 10 || generations > 500) {
      setError("Generations must be between 10 and 500");
      return;
    }
    
    if (crossoverRate < 0 || crossoverRate > 1) {
      setError("Crossover rate must be between 0 and 1");
      return;
    }
    
    if (mutationRate < 0 || mutationRate > 1) {
      setError("Mutation rate must be between 0 and 1");
      return;
    }
    
    if (cranes < 1 || cranes > 8) {
      setError("Number of cranes must be between 1 and 8");
      return;
    }

    const isoDate = new Date(targetDate).toISOString().split("T")[0];
    setLoading(true);
    setScheduleResults([]);
    setExecutionTime(null);
    setTotalDelay(0);

    try {
      // Prepare genetic algorithm parameters
      const params = {
        populationSize,
        generations,
        crossoverRate,
        mutationRate,
        cranes
      };

      setAlgorithmParameters(params);

      // Call genetic algorithm endpoint
      const result = await calculateGeneticSchedule(isoDate, params);
      
      // Extract execution time if available
      if (result.executionTime !== undefined) {
        setExecutionTime(result.executionTime);
      }
      
      // Store dock schedules for detailed view
      setDockSchedules(result);
      
      // Parse and flatten results for table display
      const parsedResults = parseGeneticResults(result);
      setScheduleResults(parsedResults);
      
      // Calculate total delay
      const calculatedDelay = calculateTotalDelay(Object.values(result));
      setTotalDelay(calculatedDelay);
      
    } catch (err) {
      console.error("Genetic algorithm error:", err);
      setError(`Genetic scheduling failed: ${err.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  // Reset all parameters to defaults
  const resetParameters = () => {
    setPopulationSize(30);
    setGenerations(50);
    setCrossoverRate(0.8);
    setMutationRate(0.2);
    setCranes(1);
  };

  // Get improvement metrics if available
  const getImprovementMetrics = () => {
    if (!dockSchedules || Object.keys(dockSchedules).length === 0) {
      return null;
    }
    
    // Look for improvement data in any dock schedule
    const firstDock = Object.values(dockSchedules)[0];
    return firstDock.improvement || null;
  };

  return {
    // State
    targetDate,
    setTargetDate,
    scheduleResults,
    loading,
    error,
    executionTime,
    totalDelay,
    
    // Genetic Algorithm Parameters
    populationSize,
    setPopulationSize,
    generations,
    setGenerations,
    crossoverRate,
    setCrossoverRate,
    mutationRate,
    setMutationRate,
    cranes,
    setCranes,
    
    // Algorithm metadata
    algorithmParameters,
    dockSchedules,
    
    // Functions
    generateSchedule,
    resetParameters,
    getImprovementMetrics
  };
};