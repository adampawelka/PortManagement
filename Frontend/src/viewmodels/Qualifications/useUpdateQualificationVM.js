import { useState, useEffect, useCallback } from "react";
import { getQualifications } from "../../services/qualificationService";
import { useApi } from "../../services/api";

export const useUpdateQualificationVM = (apiFetch) => {
  const [availableCodes, setAvailableCodes] = useState([]);
  const [formData, setFormData] = useState({ code: "", name: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [criticalError, setCriticalError] = useState(false);

  const fetchQualifications = useCallback(async () => {
    setLoading(true);
    setCriticalError(false);
    try {
      const data = await getQualifications(apiFetch);
      setAvailableCodes(data.map(q => q.code));
    } catch (err) {
      setCriticalError(true);
      setMessage({ type: "error", text: err.message || "Failed to fetch qualifications" });
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    fetchQualifications();
  }, [fetchQualifications]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e, onSubmit) => {
    e.preventDefault();
    if (!onSubmit) return;
    setSubmitting(true);
    setMessage(null);

    try {
      await onSubmit(formData);
      setMessage({ type: "success", text: "Qualification updated successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to update qualification" });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    availableCodes,
    formData,
    handleChange,
    handleSubmit,
    loading,
    submitting,
    message,
    criticalError,
  };
};
