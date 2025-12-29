import { useState, useCallback } from "react";
import * as executedOperationService from "../../services/executedOperationService";
import * as vesselVisitExecutionService from "../../services/vesselVisitExecutionService";

/**
 * ViewModel for updating Vessel Visit Execution (VVE) and its executed operations.
 * Covers US 4.1.8 and 4.1.9.
 */
export const useUpdateVVEProgressVM = (vveId, apiOemFetch) => {
  const [vve, setVve] = useState(null);
  const [executedOperations, setExecutedOperations] = useState([]);
  const [plannedOperations, setPlannedOperations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  /** Fetch VVE details, executed operations, and available planned operations */
  const fetchVVEAndOperations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const vveData = await vesselVisitExecutionService.getVVE(apiOemFetch, vveId);
      setVve(vveData);

      if (vveData.status !== "IN_PROGRESS") {
        setError("VVE is not in progress. Only in-progress VVEs can be updated.");
      }

      const execOps = await executedOperationService.getByVVE(apiOemFetch, vveId);
      setExecutedOperations(execOps);

      const plannedOps = await executedOperationService.getAvailablePlannedOperations(apiOemFetch, vveId);
      setPlannedOperations(plannedOps);
    } catch (err) {
      setError(err.message || "Failed to fetch VVE and operations");
    } finally {
      setLoading(false);
    }
  }, [vveId, apiOemFetch]);

  /** Update VVE details (berth times, dock assignments, status, etc.) */
  const updateVVE = useCallback(async (updates) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await vesselVisitExecutionService.updateVVE(apiOemFetch, vveId, updates);
      setVve(updated);
      setSuccess("VVE updated successfully");
      return updated;
    } catch (err) {
      setError("Failed to update VVE: " + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [vveId, apiOemFetch]);

  /** Create a new executed operation from a planned operation */
  const createExecutedOperation = useCallback(async (operationData) => {
    setError(null);
    setSuccess(null);
    try {
      const response = await executedOperationService.createFromPlannedOperation(apiOemFetch, {
        ...operationData,
        vesselVisitExecutionId: vveId,
      });
      setExecutedOperations(prev => [...prev, response]);
      setSuccess("Executed operation recorded successfully");
      return response;
    } catch (err) {
      setError("Failed to create executed operation: " + err.message);
      throw err;
    }
  }, [vveId, apiOemFetch]);

  /** Update an existing executed operation (status, timestamps, resources) */
  const updateExecutedOperation = useCallback(async (operationId, updates) => {
    setError(null);
    setSuccess(null);
    try {
      const updatedOp = await executedOperationService.updateExecutedOperation(apiOemFetch, operationId, updates);
      setExecutedOperations(prev => prev.map(op => op.id === operationId ? updatedOp : op));
      setSuccess("Executed operation updated successfully");
      return updatedOp;
    } catch (err) {
      setError("Failed to update executed operation: " + err.message);
      throw err;
    }
  }, [apiOemFetch]);

  /** Mark all executed operations as completed */
  const markAllAsCompleted = useCallback(async () => {
    setError(null);
    setSuccess(null);
    try {
      const operationIds = executedOperations.map(op => op.id);
      await executedOperationService.markAllAsCompleted(apiOemFetch, vveId, operationIds);
      const updatedOps = await executedOperationService.getByVVE(apiOemFetch, vveId);
      setExecutedOperations(updatedOps);
      setSuccess("All operations marked as completed");
    } catch (err) {
      setError("Failed to mark all operations as completed: " + err.message);
      throw err;
    }
  }, [executedOperations, vveId, apiOemFetch]);

  /** Sync executed operations with remaining planned operations */
  const syncWithPlannedOperations = useCallback(async () => {
    setError(null);
    setSuccess(null);
    try {
      const executedPlannedIds = executedOperations.map(op => op.plannedOperationId);
      const remainingPlanned = plannedOperations.filter(op => !executedPlannedIds.includes(op.id));
      if (remainingPlanned.length === 0) {
        setSuccess("All planned operations are already executed");
        return;
      }
      const plannedIds = remainingPlanned.map(op => op.id);
      await executedOperationService.batchCreateFromPlanned(apiOemFetch, vveId, plannedIds);
      const updatedOps = await executedOperationService.getByVVE(apiOemFetch, vveId);
      setExecutedOperations(updatedOps);
      setSuccess(`Synced ${plannedIds.length} planned operations`);
    } catch (err) {
      setError("Failed to sync with planned operations: " + err.message);
      throw err;
    }
  }, [vveId, executedOperations, plannedOperations, apiOemFetch]);

  return {
    vve,
    executedOperations,
    plannedOperations,
    loading,
    error,
    success,
    fetchVVEAndOperations,
    updateVVE,
    createExecutedOperation,
    updateExecutedOperation,
    markAllAsCompleted,
    syncWithPlannedOperations,
    setError,
    setSuccess
  };
};
