import { useState, useCallback } from "react";
import { useApiOEM } from "../../services/api";
import * as executedOperationService from "../../services/executedOperationService";
import * as vesselVisitExecutionService from "../../services/vesselVisitExecutionService";

export const useUpdateVVEVM = (initialVvnId) => {
  const { apiOemFetch } = useApiOEM();

  const [vvnId, setVvnId] = useState(initialVvnId || "");
  const [vve, setVve] = useState(null);
  const [executedOperations, setExecutedOperations] = useState([]);
  const [plannedOperations, setPlannedOperations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchVVE = useCallback(async (id) => {
    const targetId = id || vvnId;
    if (!targetId) return;

    setLoading(true);
    setError(null);
    try {
      const vveData = await vesselVisitExecutionService.getVVE(apiOemFetch, targetId);
      setVve(vveData);

      const execOps = await executedOperationService.getByVVE(apiOemFetch, targetId);
      setExecutedOperations(execOps);

      const plannedOps = await executedOperationService.getAvailablePlannedOperations(apiOemFetch, targetId);
      setPlannedOperations(plannedOps);
    } catch (err) {
      setError(err.message || "Failed to fetch VVE");
    } finally {
      setLoading(false);
    }
  }, [apiOemFetch, vvnId]);

  const updateVVEInfo = useCallback(async (updates) => {
    if (!vvnId) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await vesselVisitExecutionService.updateVVE(apiOemFetch, vvnId, updates);
      setVve(updated);
      setSuccess("VVE updated successfully");
    } catch (err) {
      setError(err.message || "Failed to update VVE");
    } finally {
      setLoading(false);
    }
  }, [apiOemFetch, vvnId]);

  const createExecutedOperation = useCallback(async (data) => {
    setError(null);
    setSuccess(null);
    try {
      const created = await executedOperationService.createFromPlannedOperation(apiOemFetch, {
        ...data,
        vesselVisitExecutionId: vvnId,
      });
      setExecutedOperations(prev => [...prev, created]);
      setSuccess("Executed operation created");
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [apiOemFetch, vvnId]);

  const updateExecutedOperation = useCallback(async (id, updates) => {
    setError(null);
    setSuccess(null);
    try {
      const updated = await executedOperationService.updateExecutedOperation(apiOemFetch, id, updates);
      setExecutedOperations(prev => prev.map(op => op.id === id ? updated : op));
      setSuccess("Operation updated");
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [apiOemFetch]);

  const markAllOperationsCompleted = useCallback(async () => {
    setError(null);
    setSuccess(null);
    try {
      await Promise.all(executedOperations.map(op =>
        executedOperationService.updateExecutedOperation(apiOemFetch, op.id, { status: "COMPLETED" })
      ));
      await fetchVVE();
      setSuccess("All operations marked as completed");
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [apiOemFetch, executedOperations, fetchVVE]);

  return {
    vvnId,
    setVvnId,
    vve,
    executedOperations,
    plannedOperations,
    loading,
    error,
    success,
    fetchVVE,
    updateVVEInfo,
    createExecutedOperation,
    updateExecutedOperation,
    markAllOperationsCompleted,
    setError,
    setSuccess,
  };
};
