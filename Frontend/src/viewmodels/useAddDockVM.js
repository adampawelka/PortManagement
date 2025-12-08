import { useState, useEffect } from "react";
import { useApi } from "../services/api";
import { addDock } from "../services/dockService";
import { getVesselTypes } from "../services/vesselTypeService";

const initialFormState = {
  dockName: "",
  dockLocation: "",
  depth: "",
  length: "",
  maxDraft: "",
  selectedVesselTypeIds: [],
};

export const useAddDockVM = () => {
  const { apiFetch } = useApi();

  const [formData, setFormData] = useState(initialFormState);
  const [vesselTypes, setVesselTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [criticalError, setCriticalError] = useState(false);
  const [partialError, setPartialError] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const typesData = await getVesselTypes(apiFetch);
        setVesselTypes(typesData || []);
      } catch (err) {
        console.error(err);
        setMessage({ type: "error", text: "Cannot fetch vessel types. Form disabled." });
        setCriticalError(true);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [apiFetch]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "selectedVesselTypeIds") {
      setFormData((prev) => ({
        ...prev,
        [name]: typeof value === "string" ? value.split(",") : value,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (criticalError) return;

    setSubmitting(true);
    setMessage(null);

    if (!formData.dockName || formData.selectedVesselTypeIds.length === 0) {
      setMessage({ type: "error", text: "Dock Name and Allowed Vessel Types are required." });
      setSubmitting(false);
      return;
    }

    const dockDto = {
      DockName: formData.dockName,
      DockLocation: formData.dockLocation,
      Depth: parseFloat(formData.depth) || 0,
      Length: parseFloat(formData.length) || 0,
      MaxDraft: parseFloat(formData.maxDraft) || 0,
      AllowedVesselTypes: formData.selectedVesselTypeIds,
    };

    try {
      await addDock(apiFetch, dockDto);
      setMessage({ type: "success", text: "Dock created successfully!" });
      setFormData(initialFormState);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to create dock" });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    vesselTypes,
    loading,
    submitting,
    message,
    criticalError,
    partialError,
    handleChange,
    handleSubmit,
  };
};
