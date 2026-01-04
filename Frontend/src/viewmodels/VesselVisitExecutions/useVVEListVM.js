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

  const useMock = false; // false = try API first

  // Mock data fallback
  const mockData = [
    {
      vveId: "VVE001",
      vvnId: "VVN001",
      actualArrivalTime: new Date("2025-01-01T08:00:00Z"),
      actualBerthTime: new Date("2025-01-01T09:00:00Z"),
      dockId: "Dock-A",
      status: "ARRIVED",
      createdBy: "system",
    },
    {
      vveId: "VVE002",
      vvnId: "VVN002",
      actualArrivalTime: new Date("2025-01-02T10:30:00Z"),
      actualBerthTime: new Date("2025-01-02T11:00:00Z"),
      dockId: "Dock-B",
      status: "BERTHED",
      createdBy: "user1",
    },
    {
      vveId: "VVE003",
      vvnId: "VVN003",
      actualArrivalTime: new Date("2025-01-03T14:00:00Z"),
      status: "SCHEDULED",
      createdBy: "user2",
    },
  ];

  if (useMock) {
    await new Promise((r) => setTimeout(r, 300));
    setVveList(mockData);
    setLoading(false);
    return;
  }

  try {
    const list = await vesselVisitExecutionService.getAllVVEs(apiOemFetch);
    setVveList(list);
  } catch (err) {
    console.error("API fetch failed, loading mock data instead:", err);
    setError("Failed to fetch VVE list, showing mock data");
    setVveList(mockData); // fallback to mock data
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
