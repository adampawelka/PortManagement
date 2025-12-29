export const getVVE = async (apiOemFetch, vveId) => {
  const res = await apiOemFetch(`/api/VesselVisitExecutions/${vveId}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch vessel visit execution");
  }
  return res.json();
};

export const getAllVVEs = async (apiOemFetch) => {
  const res = await apiOemFetch(`/api/VesselVisitExecutions`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch all vessel visit executions");
  }
  return res.json();
};

export const createVVE = async (apiOemFetch, vveData) => {
  const res = await apiOemFetch(`/api/VesselVisitExecutions`, {
    method: "POST",
    body: JSON.stringify(vveData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create vessel visit execution");
  }
  return res.json();
};

export const updateVVE = async (apiOemFetch, vveId, updates) => {
  const res = await apiOemFetch(`/api/VesselVisitExecutions/${vveId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update vessel visit execution");
  }
  return res.json();
};
