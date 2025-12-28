import { useState, useEffect, useCallback } from "react";
import { useApi } from "../../services/api";
import { getQualifications } from "../../services/qualificationService";

export const useQualificationsListVM = () => {
  const { apiFetch } = useApi();

  const [qualifications, setQualifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchQualifications = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getQualifications(apiFetch);
      setQualifications(data);
    } catch (err) {
      setError(err.message || "Failed to fetch qualifications");
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    fetchQualifications();
  }, [fetchQualifications]);

  return {
    qualifications,
    loading,
    error,
    fetchQualifications,
  };
};
