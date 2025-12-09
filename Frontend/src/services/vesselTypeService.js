export const getVesselTypes = async (apiFetch) => {
  const res = await apiFetch("/api/VesselTypes");
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch vessel types");
  }
  return res.json();
};

export const addVesselType = async (apiFetch, vesselTypeDto) => {
  const res = await apiFetch("/api/VesselTypes", {
    method: "POST",
    body: JSON.stringify(vesselTypeDto),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to add vessel type");
  }
  return res.json();
};

export const searchVesselTypes = async (
  apiFetch,
  { name, description, minCapacity, maxCapacity } = {}
) => {
  const params = new URLSearchParams();
  if (name) params.append('name', name);
  if (description) params.append('description', description);
  if (minCapacity != null) params.append('minCapacity', minCapacity);
  if (maxCapacity != null) params.append('maxCapacity', maxCapacity);

  const res = await apiFetch(`/api/VesselTypes/search?${params.toString()}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to search vessel types');
  }
  return res.json();
};


