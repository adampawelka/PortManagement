import { useState, useCallback } from "react";
import { getMissingPlans } from "../../services/operationalPlanService";
import { useApiOEM } from "../../services/api"; // Asegúrate de usar el hook correcto para tu backend OEM

export const useMissingPlansVM = () => {
  const { apiOemFetch } = useApiOEM();

  const [date, setDate] = useState("");
  const [missingList, setMissingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const findMissing = useCallback(async () => {
    if (!date) {
      alert("Please select a date first.");
      return;
    }

    setLoading(true);
    setError("");
    setMissingList([]);
    setHasSearched(true);

    try {
      const data = await getMissingPlans(apiOemFetch, date);
      setMissingList(data);
    } catch (err) {
      console.error(err);
      // Si falla la conexión, cargamos datos mock para que puedas probar la UI
      // setError(err.message || "Failed to load missing plans.");
      
      // --- FALLBACK MOCK PARA DESARROLLO ---
      setMissingList([
        { vvnId: "mock-1", vesselName: "MSC Mock Vessel", eta: `${date}T10:00:00`, status: "Approved" },
        { vvnId: "mock-2", vesselName: "Maersk Mock", eta: `${date}T14:00:00`, status: "Approved" }
      ]);
      // ------------------------------------
      
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