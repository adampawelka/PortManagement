import { useState, useCallback } from "react";
import { useApiOEM } from "../../services/api";
import * as executedOperationService from "../../services/executedOperationService";
import * as vesselVisitExecutionService from "../../services/vesselVisitExecutionService";

/**
 * ViewModel for updating Vessel Visit Execution (VVE)
 * and its executed operations (US 4.1.8, 4.1.9).
 */
export const useUpdateVVEProgressVM = (vveId) => {
  const { apiOemFetch } = useApiOEM();

  const [vve, setVve] = useState(null);
  const [executedOperations, setExecutedOperations] = useState([]);
  const [plannedOperations, setPlannedOperations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  /** Fetch VVE + operations */
  const fetchVVEAndOperations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const vveData =
        await vesselVisitExecutionService.getVVE(apiOemFetch, vveId);
      setVve(vveData);

      const execOps =
        await executedOperationService.getByVVE(apiOemFetch, vveId);
      setExecutedOperations(execOps);

      const plannedOps =
        await executedOperationService.getAvailablePlannedOperations(
          apiOemFetch,
          vveId
        );
      setPlannedOperations(plannedOps);
    } catch (err) {
      setError(err.message || "Failed to load VVE data");
    } finally {
      setLoading(false);
    }
  }, [apiOemFetch, vveId]);

  /** Create executed operation */
  const createExecutedOperation = useCallback(
    async (data) => {
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
        setSuccess("Executed operation created");
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [apiOemFetch, vveId]
  );

  /** Update executed operation */
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
          prev.map((op) => (op.id === id ? updated : op))
        );
        setSuccess("Operation updated");
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [apiOemFetch]
  );

  /** Mark all as COMPLETED (bez osobnego endpointu) */
  const markAllAsCompleted = useCallback(async () => {
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
      await fetchVVEAndOperations();
      setSuccess("All operations marked as completed");
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [apiOemFetch, executedOperations, fetchVVEAndOperations]);

  return {
    vve,
    executedOperations,
    plannedOperations,
    loading,
    error,
    success,
    fetchVVEAndOperations,
    createExecutedOperation,
    updateExecutedOperation,
    markAllAsCompleted,
    setError,
    setSuccess,
  };
};
