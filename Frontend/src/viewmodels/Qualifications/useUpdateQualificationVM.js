import { useState, useEffect } from "react";
import { getQualificationById, updateQualification } from "../../services/qualificationService";

export const useUpdateQualificationVM = (apiFetch, qualificationId) => {
  const [formData, setFormData] = useState({ code: "", name: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [criticalError, setCriticalError] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchQualification = async () => {
      try {
        const data = await getQualificationById(apiFetch, qualificationId);

        if (!data || Object.keys(data).length === 0) {
          setNotFound(true);
        } else {
          setFormData({ code: data.code || "", name: data.name || "" });
        }
      } catch (err) {
        if (err.message.includes("404")) {
          setNotFound(true);
        } else {
          setCriticalError(true);
          setMessage({ type: "error", text: err.message || "Failed to load qualification" });
        }
      } finally {
        setLoading(false);
      }
    };

    if (qualificationId) {
      fetchQualification();
    } else {
      setNotFound(true);
      setLoading(false);
    }
  }, [apiFetch, qualificationId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      await updateQualification(apiFetch, qualificationId, formData);
      setMessage({ type: "success", text: "Qualification updated successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to update qualification" });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    loading,
    submitting,
    message,
    criticalError,
    notFound,
    handleChange,
    handleSubmit,
  };
};
