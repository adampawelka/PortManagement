import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApiOEM, useApi } from "../../services/api";
import { useUser } from "../../App";
import * as vesselVisitExecutionService from "../../services/vesselVisitExecutionService";
import { getVesselVisitNotifications } from "../../services/vesselVisitNotificationService";

export const useAddVVEVM = () => {
  const { apiOemFetch } = useApiOEM();
  const { apiFetch } = useApi(); // For Backend API (VVNs)
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

  const [vvns, setVvns] = useState([]);
  const [selectedVvn, setSelectedVvn] = useState(null);
  const [loadingVvns, setLoadingVvns] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  /* =======================
     FETCH VVNs
  ======================= */
  useEffect(() => {
    const loadVvns = async () => {
      try {
        setLoadingVvns(true);
        const vvnList = await getVesselVisitNotifications(apiFetch);
        setVvns(Array.isArray(vvnList) ? vvnList : []);
      } catch (err) {
        console.error("Failed to fetch VVNs:", err);
        setError(`Failed to load VVNs: ${err.message}`);
      } finally {
        setLoadingVvns(false);
      }
    };

    loadVvns();
  }, [apiFetch]);

  /* =======================
     HANDLERS
  ======================= */
  const handleVvnChange = useCallback((e) => {
    const selectedId = e.target.value;
    const vvn = vvns.find((v) => v.id === selectedId);
    setSelectedVvn(vvn || null);
    setFormData((prev) => ({ ...prev, vvnId: selectedId }));
    if (error) setError(null);
  }, [vvns, error]);

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
    vvns,
    selectedVvn,
    loadingVvns,
    loading,
    submitting,
    error,
    success,
    handleChange,
    handleVvnChange,
    handleTimeChange,
    handleSubmit,
    setError,
    setSuccess,
  };
};
