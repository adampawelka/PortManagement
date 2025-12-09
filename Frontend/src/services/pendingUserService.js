export const getAllPendingUsers = async (apiFetch) => {
  const response = await apiFetch("/api/PendingUsers");
  if (!response.ok) throw new Error("Failed to load pending users");
  return response.json();
};

export const deletePendingUser = async (id, apiFetch) => {
  const response = await apiFetch(`/api/PendingUsers/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete pending user");
};

export const createPendingUser = async (user, role, apiFetch) => {
  const response = await apiFetch("/api/PendingUsers", {
    method: "POST",
    body: JSON.stringify({
      name: user.name,
      email: user.email,
      iamUserId: user.iamUserId,
      role: role,
    }),
  });

  if (!response.ok) throw new Error("Failed to approve user");

  return response.json();
};
