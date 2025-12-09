export const getStorageAreas = async (apiFetch) => {
  const res = await apiFetch("/api/StorageAreas");
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch storage areas");
  }
  return res.json();
};

export const addStorageArea = async (apiFetch, StorageAreaDto) => {
  const res = await apiFetch("/api/StorageAreas", {
    method: "POST",
    body: JSON.stringify(StorageAreaDto),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to add storage area");
  }
  return res.json();
};


