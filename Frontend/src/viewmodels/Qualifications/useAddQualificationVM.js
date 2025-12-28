import { useState } from "react";
import { addQualification } from "../../services/qualificationService";

export const useAddQualificationVM = (apiFetch) => {
  const [formData, setFormData] = useState({ code: "", name: "" });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [criticalError, setCriticalError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      await addQualification(apiFetch, formData);
      setMessage({ type: "success", text: "Qualification added successfully!" });
      setFormData({ code: "", name: "" }); // reset
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to add qualification" });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    submitting,
    message,
    loading,
    criticalError,
    handleChange,
    handleSubmit,
  };
};
