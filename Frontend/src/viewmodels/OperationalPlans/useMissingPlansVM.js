import { useState, useCallback } from "react";
import { getMissingPlans } from "../../services/operationalPlanService";
import { useApiOEM } from "../../services/api";

export const useMissingPlansVM = () => {
  const { apiOemFetch } = useApiOEM();

  const [date, setDate] = useState("");
  const [missingList, setMissingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const findMissing = useCallback(async () => {
    if (!date) {
      setError("Please select a date first.");
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    const mockData = [
      { vvnId: "mock-1", vesselName: "MSC Mock Vessel", eta: `${date}T10:00:00`, status: "Approved" },
      { vvnId: "mock-2", vesselName: "Maersk Mock", eta: `${date}T14:00:00`, status: "Approved" }
    ];

    try {
      const data = await getMissingPlans(apiOemFetch, date);
      setMissingList(data);
    } catch (err) {
      console.error("API fetch failed, loading mock data instead:", err);
      setError("Failed to fetch missing plans, showing mock data"); 
      setMissingList(mockData); 
    } finally {
      setLoading(false);
    }
  }, [apiOemFetch, date]);

  return {
    date,
    setDate,
    missingList,
    loading,
    error,
    hasSearched,
    findMissing
  };
};