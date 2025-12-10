export const getResources = async (apiFetch) => {
  const res = await apiFetch("/api/Resources");
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch resources");
  }
  return res.json();
};

export const addResource = async (apiFetch, ResourceDto) => {
  const res = await apiFetch("/api/Resources", {
    method: "POST",
    body: JSON.stringify(ResourceDto),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to add resource");
  }
  return res.json();
};