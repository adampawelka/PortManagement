export const getOperationalPlans = async (apiOemFetch) => {
  const res = await apiOemFetch("/api/OperationalPlans");
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch operational plans");
  }
  return res.json();
};

export const addOperationalPlan = async (apiOemFetch, OperationalPlanDto) => {
  const res = await apiOemFetch("/api/OperationalPlans", {
    method: "POST",
    body: JSON.stringify(OperationalPlanDto),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to add an operational plan");
  }
  return res.json();
};

export const searchOperationalPlans = async (apiOemFetch, { dateStart, dateEnd, vesselId } = {}) => {
  const params = new URLSearchParams();
  if (dateStart) params.append('dateStart', dateStart);
  if (dateEnd) params.append('dateEnd', dateEnd);
  if (vesselId) params.append('vesselId', vesselId);

  const res = await apiOemFetch(`/api/OperationalPlans/search?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to search operational plans');
  return res.json();
};


