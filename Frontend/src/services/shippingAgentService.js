export const getShippingAgents = async (apiFetch) => {
  const res = await apiFetch("/api/ShippingAgents");  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch shipping agents");
  }
  return res.json();
};
