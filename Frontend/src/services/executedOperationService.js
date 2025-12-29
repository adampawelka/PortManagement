export const getByVVE = async (apiFetch, vveId) => {
  const res = await apiFetch(`/api/ExecutedOperations/vve/${vveId}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch executed operations");
  }
  return res.json();
};

export const getAvailablePlannedOperations = async (apiFetch, vveId) => {
  const res = await apiFetch(`/api/ExecutedOperations/available-planned/${vveId}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch planned operations");
  }
  return res.json();
};

export const createExecutedOperation = async (apiFetch, operationData) => {
  const res = await apiFetch(`/api/ExecutedOperations`, {
    method: "POST",
    body: JSON.stringify(operationData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create executed operation");
  }
  return res.json();
};

export const createFromPlannedOperation = async (apiFetch, operationData) => {
  const res = await apiFetch(`/api/ExecutedOperations/from-planned`, {
    method: "POST",
    body: JSON.stringify(operationData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create executed operation from planned operation");
  }
  return res.json();
};

export const updateExecutedOperation = async (apiFetch, opId, updates) => {
  const res = await apiFetch(`/api/ExecutedOperations/${opId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update executed operation");
  }
  return res.json();
};


export const batchUpdateExecutedOperations = async (apiFetch, updates) => {
  const res = await apiFetch('/api/ExecutedOperations/batchUpdateExecutedOperations', {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to batch update executed operations');
  }
  return res.json();
};

export const markAllAsCompleted = async (apiFetch, executedOperations) => {
  const updates = executedOperations.map(op => ({
    id: op.id,
    updates: {
      status: 'COMPLETED',
      actualEnd: new Date().toISOString(),
    },
  }));

  return batchUpdateExecutedOperations(apiFetch, updates);
};

