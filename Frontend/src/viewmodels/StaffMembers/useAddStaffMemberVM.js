import { useState } from "react";
import { useApi } from "../../services/api";
import { addStaffMember } from "../../services/staffMemberService";

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

  const [loading] = useState(false); // spójne z Dock VM
  const [submitting, setSubmitting] = useState(false);
  const [criticalError, setCriticalError] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQualificationsChange = (event) => {
    const {
      target: { value },
    } = event;

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

      setMessage({
        type: "success",
        text: "Staff member created successfully.",
      });

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

      if (!err?.response) {
        setCriticalError(true);
      }

      setMessage({
        type: "error",
        text: err?.message || "Failed to create staff member.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    loading,
    submitting,
    criticalError,
    message,
    handleChange,
    handleQualificationsChange,
    handleSubmit,
  };
};
