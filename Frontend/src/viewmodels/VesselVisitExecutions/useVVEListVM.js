import { useState, useEffect, useCallback } from "react";
import { useApiOEM } from "../../services/api";
import * as vesselVisitExecutionService from "../../services/vesselVisitExecutionService";

export const useVVEListVM = () => {
  const { apiOemFetch } = useApiOEM();
  const [vveList, setVveList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVVEList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await vesselVisitExecutionService.getAllVVEs(apiOemFetch);
      setVveList(list);
    } catch (err) {
      setError(err.message || "Failed to fetch VVE list");
    } finally {
      setLoading(false);
    }
  }, [apiOemFetch]);

  useEffect(() => {
    fetchVVEList();
  }, [fetchVVEList]);

  return {
    vveList,
    loading,
    error,
    fetchVVEList,
  };
};
