import { useState, useEffect, useCallback } from "react";
import { useApi } from "../../services/api";
import { getQualifications, searchQualifications } from "../../services/qualificationService";

export const useQualificationsListVM = () => {
  const { apiFetch } = useApi();

  const [qualifications, setQualifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [codeFilter, setCodeFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");

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

  const search = useCallback(async (code, name) => {
    setLoading(true);
    setError("");
    try {
      const data = await searchQualifications(apiFetch, code, name);
      setQualifications(data);
    } catch (err) {
      setError(err.message || "Failed to search qualifications");
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
    search,
    codeFilter,
    setCodeFilter,
    nameFilter,
    setNameFilter,
  };
};
