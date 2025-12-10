export const getVessels = async (apiFetch) => {
  const res = await apiFetch("/api/Vessels");
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch vessels");
  }
  return res.json();
};

export const addVessel = async (apiFetch, vesselDto) => {
  const res = await apiFetch("/api/Vessels", {
    method: "POST",
    body: JSON.stringify(vesselDto),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to add vessel");
  }
  return res.json();
};

export const searchVessels = async (apiFetch, { imo, name, ownerId } = {}) => {
  const params = new URLSearchParams();
  if (imo) params.append('imo', imo);
  if (name) params.append('name', name);
  if (ownerId) params.append('ownerId', ownerId);

  const res = await apiFetch(`/api/Vessels/search?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to search vessels');
  return res.json();
};


