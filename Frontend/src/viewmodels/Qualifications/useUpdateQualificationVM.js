import { useState, useEffect, useCallback } from "react";
import { getQualifications, getQualificationById, updateQualification } from "../../services/qualificationService";

export const useUpdateQualificationVM = (apiFetch) => {
  const [availableQualifications, setAvailableQualifications] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [formData, setFormData] = useState({ code: "", name: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [criticalError, setCriticalError] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Pobranie wszystkich kwalifikacji przy ładowaniu VM
  const fetchQualifications = useCallback(async () => {
    setLoading(true);
    setCriticalError(false);
    try {
      const data = await getQualifications(apiFetch);
      setAvailableQualifications(data || []);
      setLoading(false);
    } catch (err) {
      setCriticalError(true);
      setMessage({ type: "error", text: err.message || "Failed to fetch qualifications" });
      setLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    fetchQualifications();
  }, [fetchQualifications]);

  // Obsługa wyboru kwalifikacji z listy
  const handleSelectChange = async (id) => {
    setSelectedId(id);
    setLoading(true);
    setMessage(null);

    try {
      const data = await getQualificationById(apiFetch, id);
      if (!data) {
        setNotFound(true);
        setFormData({ code: "", name: "" });
      } else {
        setNotFound(false);
        setFormData({ code: data.code, name: data.name });
      }
    } catch (err) {
      setCriticalError(true);
      setMessage({ type: "error", text: err.message || "Failed to load qualification" });
    } finally {
      setLoading(false);
    }
  };

  // Obsługa zmian w formularzu (nowy kod lub nazwa)
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

    try {
      await updateQualification(apiFetch, selectedId, formData);
      setMessage({ type: "success", text: "Qualification updated successfully!" });
      // Odśwież listę kodów
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
    criticalError,
    notFound,
    handleSelectChange,
    handleChange,
    handleSubmit,
  };
};
