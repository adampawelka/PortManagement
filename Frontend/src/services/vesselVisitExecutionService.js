export const getVVE = async (apiFetch, vveId) => {
  const res = await apiFetch(`/api/VesselVisitExecutions/${vveId}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch vessel visit execution");
  }
  return res.json();
};

export const getAllVVEs = async (apiFetch) => {
  const res = await apiFetch(`/api/VesselVisitExecutions`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch all vessel visit executions");
  }
  return res.json();
};

export const createVVE = async (apiFetch, vveData) => {
  const res = await apiFetch(`/api/VesselVisitExecutions`, {
    method: "POST",
    body: JSON.stringify(vveData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create vessel visit execution");
  }
  return res.json();
};

export const updateVVE = async (apiFetch, vveId, updates) => {
  const res = await apiFetch(`/api/VesselVisitExecutions/${vveId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update vessel visit execution");
  }
  return res.json();
};
