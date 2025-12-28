import { useState, useCallback } from 'react';
import executedOperationService from '../../services/executedOperationService';
import vesselVisitExecutionService from '../../services/vesselVisitExecutionService';

export const useUpdateVVEProgressVM = (vveId) => {
  const [vve, setVve] = useState(null);
  const [executedOperations, setExecutedOperations] = useState([]);
  const [plannedOperations, setPlannedOperations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchVVEAndOperations = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const vveResponse = await vesselVisitExecutionService.getVVE(vveId);
      setVve(vveResponse);
      
      if (vveResponse.status !== 'IN_PROGRESS') {
        throw new Error('VVE is not in progress. Only in-progress VVEs can be updated.');
      }

      const executedOpsResponse = await executedOperationService.getByVVE(vveId);
      setExecutedOperations(executedOpsResponse);
 
      const plannedOpsResponse = await executedOperationService.getAvailablePlannedOperations(vveId);
      setPlannedOperations(plannedOpsResponse);
      
    } catch (err) {
      setError(err.message || 'Failed to fetch VVE and operations');
    } finally {
      setLoading(false);
    }
  }, [vveId]);

  const createExecutedOperation = async (operationData) => {
    setError(null);
    setSuccess(null);
    
    try {
      const response = await executedOperationService.createFromPlannedOperation({
        ...operationData,
        vesselVisitExecutionId: vveId
      });
      
      setExecutedOperations(prev => [...prev, response]);
      setSuccess('Executed operation recorded successfully');
      
      return response;
    } catch (err) {
      setError('Failed to create executed operation: ' + err.message);
      throw err;
    }
  };

  const createMultipleExecutedOperations = async (plannedOperationIds) => {
    setError(null);
    setSuccess(null);
    
    try {
      const response = await executedOperationService.batchCreateFromPlanned(vveId, plannedOperationIds);
      
      // Refresh executed operations
      const executedOpsResponse = await executedOperationService.getByVVE(vveId);
      setExecutedOperations(executedOpsResponse);
      
      setSuccess(`Created ${response.operations.length} executed operations successfully`);
      
      return response;
    } catch (err) {
      setError('Failed to create executed operations: ' + err.message);
      throw err;
    }
  };

  const updateExecutedOperation = async (operationId, updates) => {
    setError(null);
    setSuccess(null);
    
    try {
      const response = await executedOperationService.updateExecutedOperation(operationId, updates);
      

      setExecutedOperations(prev => 
        prev.map(op => op.id === operationId ? response : op)
      );
      
      setSuccess('Executed operation updated successfully');
      
      return response;
    } catch (err) {
      setError('Failed to update executed operation: ' + err.message);
      throw err;
    }
  };

  const markAllAsCompleted = async () => {
    setError(null);
    setSuccess(null);
    
    try {
      const operationIds = executedOperations.map(op => op.id);
      const response = await executedOperationService.markAllAsCompleted(vveId, operationIds);
      
      const executedOpsResponse = await executedOperationService.getByVVE(vveId);
      setExecutedOperations(executedOpsResponse);
      
      setSuccess('All operations marked as completed');
      
      return response;
    } catch (err) {
      setError('Failed to mark all operations as completed: ' + err.message);
      throw err;
    }
  };

  const completeVVE = async (departureData) => {
    setError(null);
    setSuccess(null);
    
    try {
      const response = await vesselVisitExecutionService.updateVVE(vveId, {
        ...departureData,
        status: 'completed'
      });
      
      setVve(response);
      setSuccess('VVE marked as completed successfully');
      
      return response;
    } catch (err) {
      setError('Failed to complete VVE: ' + err.message);
      throw err;
    }
  };

  const syncWithPlannedOperations = async () => {
    setError(null);
    setSuccess(null);
    
    try {
      const executedOpIds = executedOperations.map(op => op.plannedOperationId);
      const availablePlannedOps = plannedOperations.filter(
        op => !executedOpIds.includes(op.id)
      );
      
      if (availablePlannedOps.length === 0) {
        setSuccess('All planned operations are already executed');
        return { message: 'No new planned operations to sync' };
      }
      
      const plannedOpIds = availablePlannedOps.map(op => op.id);
      const response = await executedOperationService.batchCreateFromPlanned(vveId, plannedOpIds);

      const executedOpsResponse = await executedOperationService.getByVVE(vveId);
      setExecutedOperations(executedOpsResponse);
      
      setSuccess(`Synced ${response.operations.length} planned operations`);
      
      return response;
    } catch (err) {
      setError('Failed to sync with planned operations: ' + err.message);
      throw err;
    }
  };

  return {
    vve,
    executedOperations,
    plannedOperations,
    loading,
    error,
    success,
    fetchVVEAndOperations,
    createExecutedOperation,
    createMultipleExecutedOperations,
    updateExecutedOperation,
    markAllAsCompleted,
    completeVVE,
    syncWithPlannedOperations,
    setError,
    setSuccess
  };
};