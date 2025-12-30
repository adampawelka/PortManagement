import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useApiOEM } from "../../services/api";
import { useUser } from "../../App";
import * as vesselVisitExecutionService from "../../services/vesselVisitExecutionService";

export const useAddVVEVM = () => {
  const { apiOemFetch } = useApiOEM();
  const navigate = useNavigate();
  const user = useUser();

  /* =======================
     STATE
  ======================= */
  const [formData, setFormData] = useState({
    vvnId: "",
    actualArrivalTime: new Date().toISOString().slice(0, 16),
    actualBerthTime: "",
    dockId: "",
    createdBy: user?.sub || "", // Get user ID from context
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  /* =======================
     HANDLERS
  ======================= */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear errors when user types
    if (error) setError(null);
  }, [error]);

  const handleTimeChange = useCallback((name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value ? value.toISOString().slice(0, 16) : "",
    }));
    if (error) setError(null);
  }, [error]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      // Validation
      if (!formData.vvnId) {
        setError("VVN ID is required");
        setSubmitting(false);
        return;
      }

      if (!formData.actualArrivalTime) {
        setError("Actual arrival time is required");
        setSubmitting(false);
        return;
      }

      if (!formData.createdBy) {
        setError("User information is missing. Please log in again.");
        setSubmitting(false);
        return;
      }

      // Prepare DTO (status is auto-set by backend, but we don't send it)
      const vveDto = {
        vvnId: formData.vvnId,
        actualArrivalTime: new Date(formData.actualArrivalTime).toISOString(),
        actualBerthTime: formData.actualBerthTime
          ? new Date(formData.actualBerthTime).toISOString()
          : undefined,
        dockId: formData.dockId || undefined,
        createdBy: formData.createdBy,
      };

      try {
        const created = await vesselVisitExecutionService.createVVE(
          apiOemFetch,
          vveDto
        );

        setSuccess("Vessel Visit Execution created successfully!");
        
        // Navigate to VVE list after 1.5 seconds
        setTimeout(() => {
          navigate("/vve/list");
        }, 1500);
      } catch (err) {
        setError(err?.message || "Failed to create Vessel Visit Execution");
      } finally {
        setSubmitting(false);
      }
    },
    [formData, apiOemFetch, navigate]
  );

  /* =======================
     API
  ======================= */
  return {
    formData,
    loading,
    submitting,
    error,
    success,
    handleChange,
    handleTimeChange,
    handleSubmit,
    setError,
    setSuccess,
  };
};
