import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useApiOEM, useApi } from "../../services/api";
import * as vesselVisitExecutionService from "../../services/vesselVisitExecutionService";
import { getVesselVisitNotifications } from "../../services/vesselVisitNotificationService";

export const useAddVVEVM = () => {
  const { apiOemFetch } = useApiOEM();
  const { apiFetch } = useApi(); // For Backend API (VVNs) - same as VVN list page
  const { user } = useAuth0(); // Get Auth0 user for user.sub (user ID)
  const navigate = useNavigate();

  /* =======================
     STATE
  ======================= */
  const [formData, setFormData] = useState({
    vvnId: "",
    actualArrivalTime: new Date().toISOString().slice(0, 16),
    actualBerthTime: "",
    dockId: "",
    createdBy: user?.sub || "", // Get user ID from Auth0
  });

  const [vvns, setVvns] = useState([]);
  const [selectedVvn, setSelectedVvn] = useState(null);
  const [loadingVvns, setLoadingVvns] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  /* =======================
     FETCH VVNs - Same pattern as VVN list page
  ======================= */
  useEffect(() => {
    const loadVvns = async () => {
      try {
        setLoadingVvns(true);
        setError(null); // Clear any previous errors
        
        // Use exact same pattern as VVN list page
        const data = await getVesselVisitNotifications(apiFetch);
        setVvns(Array.isArray(data) ? data : []);
      } catch (err) {
        // If fetch fails, just use empty array - don't show error
        // This allows form to work even if VVNs can't be loaded
        console.warn("Failed to load VVNs (non-critical):", err.message);
        setVvns([]);
      } finally {
        setLoadingVvns(false);
      }
    };

    loadVvns();
  }, [apiFetch]);

  // Update createdBy when user becomes available
  useEffect(() => {
    if (user?.sub && !formData.createdBy) {
      setFormData((prev) => ({ ...prev, createdBy: user.sub }));
    }
  }, [user?.sub]);

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

      console.log("Submitting VVE with data:", vveDto);

      try {
        const created = await vesselVisitExecutionService.createVVE(
          apiOemFetch,
          vveDto
        );

        console.log("VVE created successfully:", created);
        setSuccess("Vessel Visit Execution created successfully!");
        
        // Navigate to VVE list after 1.5 seconds
        setTimeout(() => {
          navigate("/vve/list");
        }, 1500);
      } catch (err) {
        console.error("Error creating VVE:", err);
        console.error("Error details:", {
          message: err.message,
          stack: err.stack,
          name: err.name,
        });
        
        // Provide more detailed error message
        let errorMessage = "Failed to create Vessel Visit Execution";
        if (err.message) {
          errorMessage = err.message;
        } else if (err.name === "TypeError" && err.message.includes("fetch")) {
          errorMessage = "Cannot connect to server. Please check if the OEM backend (port 5161) is running.";
        }
        
        setError(errorMessage);
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

