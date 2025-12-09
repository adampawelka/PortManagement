export const getDocks = async (apiFetch) => {
  const res = await apiFetch("/api/Docks");
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch docks");
  }
  return res.json();
};

export const addDock = async (apiFetch, DockDto) => {
  const res = await apiFetch("/api/Docks", {
    method: "POST",
    body: JSON.stringify(DockDto),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to add dock");
  }
  return res.json();
};

export const searchDocks = async (apiFetch, { name, location, vesselTypeId} = {}) => {
  const params = new URLSearchParams();
  if (name) params.append('name', name);
  if (location) params.append('location', location);
  if (vesselTypeId) params.append('vesselTypeId', vesselTypeId);

  const res = await apiFetch(`/api/Docks/search?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to search docks');
  return res.json();
};


