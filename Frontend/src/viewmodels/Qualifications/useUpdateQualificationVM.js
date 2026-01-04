import { useState, useEffect, useCallback } from "react";
import { getQualifications, getQualificationById, updateQualification } from "../../services/qualificationService";

export const useUpdateQualificationVM = (apiFetch) => {
  const [availableQualifications, setAvailableQualifications] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [formData, setFormData] = useState({ code: "", name: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [criticalError, setCriticalError] = useState(false);

  // Pobranie wszystkich kwalifikacji przy ładowaniu VM
  const fetchQualifications = useCallback(async () => {
    setLoading(true);
    setCriticalError(false);
    try {
      const data = await getQualifications(apiFetch);
      setAvailableQualifications(data || []);
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

  // Obsługa wyboru kwalifikacji z listy
  const handleSelectChange = async (id) => {
    setSelectedId(id);
    setMessage(null);
    setSuccessMessage(null);

    if (!id) {
      setFormData({ code: "", name: "" });
      return;
    }

    setLoading(true);
    try {
      const data = await getQualificationById(apiFetch, id);
      if (!data) {
        setMessage({ type: "error", text: "Qualification not found" });
        setFormData({ code: "", name: "" });
      } else {
        setFormData({ code: data.code, name: data.name });
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to load qualification" });
      setFormData({ code: "", name: "" });
    } finally {
      setLoading(false);
    }
  };

  // Obsługa zmian w formularzu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Obsługa wysyłki formularza
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedId) return;

    setSubmitting(true);
    setMessage(null);
    setSuccessMessage(null);

    try {
      await updateQualification(apiFetch, selectedId, formData);
      setSuccessMessage("Qualification updated successfully!");
      // reset Select i pól formularza
      setSelectedId("");
      setFormData({ code: "", name: "" });
      // odśwież listę kwalifikacji
      await fetchQualifications();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to update qualification" });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    availableQualifications,
    selectedId,
    formData,
    loading,
    submitting,
    message,
    successMessage,
    criticalError,
    handleSelectChange,
    handleChange,
    handleSubmit,
  };
};
