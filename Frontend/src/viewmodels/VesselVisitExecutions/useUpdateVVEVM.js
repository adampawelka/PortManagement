import { useState, useCallback, useEffect } from "react";
import { useApiOEM, useApi } from "../../services/api";
import * as executedOperationService from "../../services/executedOperationService";
import * as vesselVisitExecutionService from "../../services/vesselVisitExecutionService";
import * as dockService from "../../services/dockService";

export const useUpdateVVEVM = (initialVveId = "") => {
  const { apiOemFetch } = useApiOEM();
  const { apiFetch } = useApi(); // For Backend API (docks)

  /* =======================
     STATE
  ======================= */
  const [vveId, setVveId] = useState(initialVveId);
  const [vve, setVve] = useState(null);

  const [executedOperations, setExecutedOperations] = useState([]);
  const [plannedOperations, setPlannedOperations] = useState([]);
  const [docks, setDocks] = useState([]);
  const [loadingDocks, setLoadingDocks] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  /* =======================
     FETCH DOCKS
  ======================= */
  useEffect(() => {
    const loadDocks = async () => {
      try {
        setLoadingDocks(true);
        const docksList = await dockService.getDocks(apiFetch);
        setDocks(Array.isArray(docksList) ? docksList : []);
      } catch (err) {
        console.warn("Failed to load docks:", err.message);
        setDocks([]); // Set empty array if fetch fails
      } finally {
        setLoadingDocks(false);
      }
    };

    loadDocks();
  }, [apiFetch]);

  /* =======================
     FETCH VVE + OPS
  ======================= */
  const fetchVVE = useCallback(
    async (id) => {
      const targetId = id || vveId;
      if (!targetId) return;

      setLoading(true);
      setError(null);

      try {
        const vveData =
          await vesselVisitExecutionService.getVVE(
            apiOemFetch,
            targetId
          );
        setVve(vveData);

        // Try to fetch executed operations, but don't fail if endpoint doesn't exist yet
        try {
          const execOps =
            await executedOperationService.getByVVE(
              apiOemFetch,
              targetId
            );
          setExecutedOperations(execOps);
        } catch (execErr) {
          console.warn("Executed operations not available:", execErr.message);
          setExecutedOperations([]); // Set empty array instead of failing
        }

        // Try to fetch planned operations, but don't fail if endpoint doesn't exist yet
        try {
          const plannedOps =
            await executedOperationService.getAvailablePlannedOperations(
              apiOemFetch,
              targetId
            );
          setPlannedOperations(plannedOps);
        } catch (plannedErr) {
          console.warn("Planned operations not available:", plannedErr.message);
          setPlannedOperations([]); // Set empty array instead of failing
        }
      } catch (err) {
        setError(err?.message || "Failed to fetch VVE");
      } finally {
        setLoading(false);
      }
    },
    [apiOemFetch, vveId]
  );

  /* =======================
     UPDATE VVE DETAILS
  ======================= */
  const updateVVEInfo = useCallback(
    async (updates) => {
      if (!vveId) return;

      setLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const updated =
          await vesselVisitExecutionService.updateVVE(
            apiOemFetch,
            vveId,
            updates
          );

        setVve(updated);
        setSuccess("VVE updated successfully");
      } catch (err) {
        setError(err?.message || "Failed to update VVE");
      } finally {
        setLoading(false);
      }
    },
    [apiOemFetch, vveId]
  );

  /* =======================
     CREATE EXECUTED OP
  ======================= */
  const createExecutedOperation = useCallback(
    async (data) => {
      if (!vveId) return;

      setError(null);
      setSuccess(null);

      try {
        const created =
          await executedOperationService.createFromPlannedOperation(
            apiOemFetch,
            {
              ...data,
              vesselVisitExecutionId: vveId,
            }
          );

        setExecutedOperations((prev) => [...prev, created]);

        setPlannedOperations((prev) =>
          prev.filter(
            (p) => p.id !== data.plannedOperationId
          )
        );

        setSuccess("Executed operation created");
        return created;
      } catch (err) {
        setError(err?.message || "Failed to create operation");
        throw err;
      }
    },
    [apiOemFetch, vveId]
  );

  /* =======================
     UPDATE EXECUTED OP
  ======================= */
  const updateExecutedOperation = useCallback(
    async (id, updates) => {
      setError(null);
      setSuccess(null);

      try {
        const updated =
          await executedOperationService.updateExecutedOperation(
            apiOemFetch,
            id,
            updates
          );

        setExecutedOperations((prev) =>
          prev.map((op) =>
            op.id === id ? updated : op
          )
        );

        setSuccess("Executed operation updated");
        return updated;
      } catch (err) {
        setError(err?.message || "Failed to update operation");
        throw err;
      }
    },
    [apiOemFetch]
  );


  const markAllOperationsCompleted = useCallback(
    async () => {
      setError(null);
      setSuccess(null);

      try {
        await Promise.all(
          executedOperations.map((op) =>
            executedOperationService.updateExecutedOperation(
              apiOemFetch,
              op.id,
              { status: "COMPLETED" }
            )
          )
        );

        await fetchVVE();
        setSuccess("All operations marked as completed");
      } catch (err) {
        setError(err?.message || "Bulk update failed");
        throw err;
      }
    },
    [apiOemFetch, executedOperations, fetchVVE]
  );

  /* =======================
     API
  ======================= */
  return {
    /* ids */
    vveId,
    setVveId,

    /* data */
    vve,
    executedOperations,
    plannedOperations,
    docks,
    loadingDocks,

    /* ui */
    loading,
    error,
    success,

    /* actions */
    fetchVVE,
    updateVVEInfo,
    createExecutedOperation,
    updateExecutedOperation,
    markAllOperationsCompleted,

    /* helpers */
    setError,
    setSuccess,
  };
};
