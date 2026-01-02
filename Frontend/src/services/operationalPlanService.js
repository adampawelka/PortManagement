export const getOperationalPlans = async (apiOemFetch) => {
  const res = await apiOemFetch("/api/operationPlans");
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch operational plans");
  }
  return res.json();
};

export const addOperationalPlan = async (apiOemFetch, OperationalPlanDto) => {
  const res = await apiOemFetch("/api/operationPlans", {
    method: "POST",
    body: JSON.stringify(OperationalPlanDto),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to add an operational plan");
  }
  return res.json();
};

export const searchOperationalPlans = async (apiOemFetch, { 
  dateStart, 
  dateEnd,
  operationDateStart,
  operationDateEnd,
  vesselName,
  vvnId,
  sortBy,
  sortOrder 
} = {}) => {
  const params = new URLSearchParams();
  if (dateStart) params.append('dateStart', dateStart);
  if (dateEnd) params.append('dateEnd', dateEnd);
  if (operationDateStart) params.append('operationDateStart', operationDateStart);
  if (operationDateEnd) params.append('operationDateEnd', operationDateEnd);
  if (vesselName) params.append('vesselName', vesselName);
  if (vvnId) params.append('vvnId', vvnId);
  if (sortBy) params.append('sortBy', sortBy);
  if (sortOrder) params.append('sortOrder', sortOrder);

  const res = await apiOemFetch(`/api/operationPlans/search?${params.toString()}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to search operational plans');
  }
  return res.json();
};



// MOCK DATA GENERATOR
export const generateMockOperationalPlans = (count = 5) => {
    const vessels = ["Aurora", "Neptune", "Poseidon", "Odyssey", "Titan"];
    const docks = ["Dock A", "Dock B", "Dock C"];
    const cranes = ["Crane 1", "Crane 2", "Crane 3"];

    const randomDate = (start = new Date(), days = 7) => {
        const date = new Date(start);
        date.setDate(date.getDate() + Math.floor(Math.random() * days));
        return date.toISOString().slice(0, 10); // YYYY-MM-DD
    };

    const randomDelay = () => Math.floor(Math.random() * 120); // in minutes

    const plans = Array.from({ length: count }, (_, i) => ({
        vvnId: 1000 + i,
        vesselName: vessels[Math.floor(Math.random() * vessels.length)],
        dock: docks[Math.floor(Math.random() * docks.length)],
        crane: cranes[Math.floor(Math.random() * cranes.length)],
        operations: Array.from({ length: 3 }, () => ({
            start: randomDate(),
            end: randomDate(),
            expectedDelay: randomDelay()
        }))
    }));

    return plans;
};
