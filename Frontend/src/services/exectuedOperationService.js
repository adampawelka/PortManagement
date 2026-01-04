export const createExecutedOperation = async (operationData) => {
    const response = await api.post('/executedOperations', operationData);
    return response.data;
};

export const createFromPlannedOperation = async (operationData) => {
    const response = await api.post('/executedOperations/from-planned', operationData);
    return response.data;
};

export const batchCreateFromPlanned = async (vveId, plannedOperationIds) => {
    const response = await api.post('/executedOperations/batch-from-planned', {
      vesselVisitExecutionId: vveId,
      plannedOperationIds
    });
    return response.data;
};

export const getByVVE = async (vveId) => {
    const response = await api.get(`/executedOperations/vve/${vveId}`);
    return response.data;
  };

export const getAvailablePlannedOperations = async (vveId) => {
    const response = await api.get(`/executedOperations/vve/${vveId}/planned`);
    return response.data;
  };

export const updateExecutedOperation = async (id, updates) => {
    const response = await api.put(`/executedOperations/${id}`, updates);
    return response.data;
  };

export const batchUpdateExecutedOperations = async (updates) => {
    const response = await api.patch('/executedOperations/batch-update', updates);
    return response.data;
  };

export const markAllAsCompleted = async (vveId, operationIds) => {
    const updates = operationIds.map(id => ({
      id,
      updates: {
        status: 'completed',
        actualEnd: new Date().toISOString()
      }
    }));
    
    const response = await api.patch('/executedOperations/batch-update', updates);
    return response.data;
  };