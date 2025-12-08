export const getVessels = async (apiFetch) => {
  const res = await apiFetch("/api/Vessels");
  if (!res.ok) throw new Error("Failed to fetch vessels");
  return res.json(); // clean DTO, no model needed
};
