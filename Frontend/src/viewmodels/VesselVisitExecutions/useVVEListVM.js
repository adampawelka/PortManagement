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

    const useMock = true; // ustaw false, żeby użyć prawdziwego API
    if (useMock) {
      try {
        const mockData = [
          {
            vvnId: "VVN001",
            actualArrivalTime: new Date("2025-01-01T08:00:00Z"),
            actualBerthTime: new Date("2025-01-01T09:00:00Z"),
            dockId: "Dock-A",
            status: "ARRIVED",
            createdBy: "system",
          },
          {
            vvnId: "VVN002",
            actualArrivalTime: new Date("2025-01-02T10:30:00Z"),
            actualBerthTime: new Date("2025-01-02T11:00:00Z"),
            dockId: "Dock-B",
            status: "BERTHED",
            createdBy: "user1",
          },
          {
            vvnId: "VVN003",
            actualArrivalTime: new Date("2025-01-03T14:00:00Z"),
            status: "SCHEDULED",
            createdBy: "user2",
          },
        ];

        // małe opóźnienie, żeby zobaczyć loading
        await new Promise((r) => setTimeout(r, 300));
        setVveList(mockData);
      } catch (err) {
        setError("Failed to fetch mock data");
      } finally {
        setLoading(false);
      }
      return;
    }

    // prawdziwe API
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
