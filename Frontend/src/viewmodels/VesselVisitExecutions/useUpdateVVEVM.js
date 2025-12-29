import { useState, useCallback } from "react";
import { useApiOEM } from "../../services/api";
import * as executedOperationService from "../../services/executedOperationService";
import * as vesselVisitExecutionService from "../../services/vesselVisitExecutionService";

export const useUpdateVVEVM = (initialVveId = "") => {
  const { apiOemFetch } = useApiOEM();

  /* =======================
     STATE
  ======================= */
  const [vveId, setVveId] = useState(initialVveId);
  const [vve, setVve] = useState(null);

  const [executedOperations, setExecutedOperations] = useState([]);
  const [plannedOperations, setPlannedOperations] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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

        const execOps =
          await executedOperationService.getByVVE(
            apiOemFetch,
            targetId
          );
        setExecutedOperations(execOps);

        const plannedOps =
          await executedOperationService.getAvailablePlannedOperations(
            apiOemFetch,
            targetId
          );
        setPlannedOperations(plannedOps);
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

        // opcjonalnie: usuń planned op z listy
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

  /* =======================
     BULK COMPLETE (OPTIONAL)
  ======================= */
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
