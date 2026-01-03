import { useState, useCallback } from "react";
import { useApiOEM } from "../../services/api";
import { getOperationalPlanById, updateOperationalPlan } from "../../services/operationalPlanService";
import { useAuth0 } from "@auth0/auth0-react";

export const useUpdateOperationPlanVM = () => {
  const { apiOemFetch } = useApiOEM();
  const { user } = useAuth0();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [warnings, setWarnings] = useState([]);
  
  const [formData, setFormData] = useState({
    algorithmUsed: "",
    schedule: []
  });
  const [changeReason, setChangeReason] = useState("");

  const loadPlan = useCallback(async (planId) => {
    setLoading(true);
    setError(null);
    setPlan(null);
    setWarnings([]);
    setSuccess(false);

    try {
      const loadedPlan = await getOperationalPlanById(apiOemFetch, planId);
      setPlan(loadedPlan);
      
      // Initialize form data from loaded plan
      setFormData({
        algorithmUsed: loadedPlan.algorithmUsed || "",
        schedule: (loadedPlan.schedule || []).map(op => ({
          vesselName: op.vesselName || "",
          start: op.start ? new Date(op.start).toISOString() : "",
          end: op.end ? new Date(op.end).toISOString() : "",
          delay: op.delay || 0,
          dock: op.dock || "",
          cranes: Array.isArray(op.cranes) ? op.cranes : [],
          staff: Array.isArray(op.staff) ? op.staff : []
        }))
      });
    } catch (err) {
      setError(err.message || "Failed to load operation plan");
    } finally {
      setLoading(false);
    }
  }, [apiOemFetch]);

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const updateScheduleOperation = useCallback((index, operation) => {
    setFormData(prev => {
      const newSchedule = [...prev.schedule];
      newSchedule[index] = { ...newSchedule[index], ...operation };
      return {
        ...prev,
        schedule: newSchedule
      };
    });
  }, []);

  const addScheduleOperation = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      schedule: [
        ...prev.schedule,
        {
          vesselName: plan?.schedule?.[0]?.vesselName || "",
          start: new Date().toISOString(),
          end: new Date().toISOString(),
          delay: 0,
          dock: "",
          cranes: [],
          staff: []
        }
      ]
    }));
  }, [plan]);

  const removeScheduleOperation = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index)
    }));
  }, []);

  const validatePlan = useCallback(() => {
    const errors = [];

    if (!changeReason || changeReason.trim() === "") {
      errors.push("Change reason is required");
    }

    if (!formData.schedule || formData.schedule.length === 0) {
      errors.push("At least one operation is required in the schedule");
    }

    formData.schedule.forEach((op, index) => {
      if (!op.vesselName || op.vesselName.trim() === "") {
        errors.push(`Operation ${index + 1}: Vessel name is required`);
      }
      if (!op.start) {
        errors.push(`Operation ${index + 1}: Start time is required`);
      }
      if (!op.end) {
        errors.push(`Operation ${index + 1}: End time is required`);
      }
      
      // Validate dates
      if (op.start) {
        const startDate = new Date(op.start);
        if (isNaN(startDate.getTime())) {
          errors.push(`Operation ${index + 1}: Start time must be a valid date`);
        }
      }
      if (op.end) {
        const endDate = new Date(op.end);
        if (isNaN(endDate.getTime())) {
          errors.push(`Operation ${index + 1}: End time must be a valid date`);
        }
      }
      
      // Validate time relationship
      if (op.start && op.end) {
        const startDate = new Date(op.start);
        const endDate = new Date(op.end);
        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
          if (startDate >= endDate) {
            errors.push(`Operation ${index + 1}: Start time must be before end time`);
          }
        }
      }
      
      // Validate delay
      if (op.delay === undefined || op.delay === null) {
        errors.push(`Operation ${index + 1}: Delay is required`);
      } else if (op.delay < 0) {
        errors.push(`Operation ${index + 1}: Delay cannot be negative`);
      }
      
      // Validate dock
      if (!op.dock || op.dock.trim() === "") {
        errors.push(`Operation ${index + 1}: Dock is required`);
      }
      
      // Validate arrays
      if (op.cranes && !Array.isArray(op.cranes)) {
        errors.push(`Operation ${index + 1}: Cranes must be an array`);
      }
      if (op.staff && !Array.isArray(op.staff)) {
        errors.push(`Operation ${index + 1}: Staff must be an array`);
      }
    });

    return errors;
  }, [formData, changeReason]);

  const checkInconsistencies = useCallback(() => {
    const warnings = [];

    formData.schedule.forEach((op, index) => {
      // Check for missing resources
      if ((!op.cranes || op.cranes.length === 0) && (!op.staff || op.staff.length === 0)) {
        warnings.push(`Operation ${index + 1}: No cranes or staff assigned`);
      }
      
      // Check for duplicate cranes in same operation
      if (op.cranes && op.cranes.length > 1) {
        const uniqueCranes = [...new Set(op.cranes)];
        if (uniqueCranes.length < op.cranes.length) {
          warnings.push(`Operation ${index + 1}: Duplicate cranes assigned`);
        }
      }
      
      // Check for duplicate staff in same operation
      if (op.staff && op.staff.length > 1) {
        const uniqueStaff = [...new Set(op.staff)];
        if (uniqueStaff.length < op.staff.length) {
          warnings.push(`Operation ${index + 1}: Duplicate staff members assigned`);
        }
      }
    });

    // Check for overlapping operations in the same schedule
    for (let i = 0; i < formData.schedule.length; i++) {
      for (let j = i + 1; j < formData.schedule.length; j++) {
        const op1 = formData.schedule[i];
        const op2 = formData.schedule[j];
        
        if (op1.start && op1.end && op2.start && op2.end) {
          const start1 = new Date(op1.start);
          const end1 = new Date(op1.end);
          const start2 = new Date(op2.start);
          const end2 = new Date(op2.end);
          
          // Check if time periods overlap
          if (start1 < end2 && end1 > start2) {
            // Check if they share resources
            const sharedCranes = op1.cranes?.filter(c => op2.cranes?.includes(c)) || [];
            const sharedStaff = op1.staff?.filter(s => op2.staff?.includes(s)) || [];
            
            if (sharedCranes.length > 0) {
              warnings.push(`Operations ${i + 1} and ${j + 1}: Overlapping time periods with shared crane(s): ${sharedCranes.join(', ')}`);
            }
            if (sharedStaff.length > 0) {
              warnings.push(`Operations ${i + 1} and ${j + 1}: Overlapping time periods with shared staff: ${sharedStaff.join(', ')}`);
            }
          }
        }
      }
    }

    return warnings;
  }, [formData]);

  const savePlan = useCallback(async () => {
    if (!plan || !plan.id) {
      setError("No plan loaded to update");
      return;
    }

    // Validate
    const validationErrors = validatePlan();
    if (validationErrors.length > 0) {
      setError(validationErrors.join("\n"));
      return;
    }

    // Check inconsistencies
    const inconsistencyWarnings = checkInconsistencies();
    setWarnings(inconsistencyWarnings);

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const updateDto = {
        algorithmUsed: formData.algorithmUsed || plan.algorithmUsed,
        schedule: formData.schedule.map(op => ({
          vesselName: op.vesselName,
          start: new Date(op.start).toISOString(),
          end: new Date(op.end).toISOString(),
          delay: op.delay,
          dock: op.dock,
          cranes: op.cranes || [],
          staff: op.staff || []
        }))
      };

      await updateOperationalPlan(apiOemFetch, plan.id, updateDto);
      setSuccess(true);
      setWarnings([]); // Clear warnings on success
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const errorMessage = err.message || "Failed to update operation plan";
      
      // Parse error message for warnings vs errors
      // Backend might return errors with "Resource conflicts detected:" prefix
      if (errorMessage.includes("Resource conflicts detected:")) {
        // This is a blocking error
        setError(errorMessage);
        setWarnings([]);
      } else if (errorMessage.includes("Warning:") || errorMessage.includes("warning")) {
        // Extract warnings from error message
        const warningLines = errorMessage.split('\n').filter(line => 
          line.toLowerCase().includes('warning') || line.includes('may be')
        );
        if (warningLines.length > 0) {
          setWarnings(warningLines);
          setError("Please review warnings before saving");
        } else {
          setError(errorMessage);
        }
      } else {
        setError(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  }, [plan, formData, apiOemFetch, validatePlan, checkInconsistencies]);

  return {
    plan,
    loading,
    error,
    saving,
    success,
    warnings,
    formData,
    changeReason,
    setChangeReason,
    loadPlan,
    updateField,
    updateScheduleOperation,
    addScheduleOperation,
    removeScheduleOperation,
    validatePlan,
    checkInconsistencies,
    savePlan
  };
};

