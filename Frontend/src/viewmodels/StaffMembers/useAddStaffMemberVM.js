import { useState, useEffect, useCallback } from "react";
import { useApi } from "../../services/api";
import { addStaffMember } from "../../services/staffMemberService";
import { getQualifications } from "../../services/qualificationService";

export const useAddStaffMemberVM = () => {
  const { apiFetch } = useApi();

  const [formData, setFormData] = useState({
    mecanographicNumber: "",
    shortName: "",
    email: "",
    phone: "",
    operationalWindow: "",
    qualificationIds: [],
  });

  const [availableQualifications, setAvailableQualifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [criticalError, setCriticalError] = useState(false);
  const [message, setMessage] = useState(null);

  // Pobranie kwalifikacji przy inicjalizacji
  const fetchQualifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getQualifications(apiFetch);
      setAvailableQualifications(data || []);
    } catch (err) {
      console.error(err);
      setCriticalError(true);
      setMessage({ type: "error", text: "Failed to load qualifications." });
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    fetchQualifications();
  }, [fetchQualifications]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQualificationsChange = (event) => {
    const { value } = event.target;
    setFormData((prev) => ({
      ...prev,
      qualificationIds: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      await addStaffMember(apiFetch, {
        mecanographicNumber: formData.mecanographicNumber,
        shortName: formData.shortName,
        email: formData.email,
        phone: formData.phone,
        operationalWindow: formData.operationalWindow || null,
        qualificationIds: formData.qualificationIds,
      });

      setMessage({ type: "success", text: "Staff member created successfully." });
      setFormData({
        mecanographicNumber: "",
        shortName: "",
        email: "",
        phone: "",
        operationalWindow: "",
        qualificationIds: [],
      });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err?.message || "Failed to create staff member." });
      if (!err?.response) setCriticalError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    availableQualifications,
    loading,
    submitting,
    criticalError,
    message,
    handleChange,
    handleQualificationsChange,
    handleSubmit,
  };
};
