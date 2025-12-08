export const getUsers = async (apiFetch) => {
  const res = await apiFetch("/api/Users");
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch users");
  }
  return res.json();
};

export const getUserById = async (apiFetch, userId) => {
  const res = await apiFetch(`/api/Users/${userId}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch user");
  }
  return res.json();
};

export const getRoleStatus = async (apiFetch, iamId, email = null, name = null) => {
  const res = await apiFetch(`/api/Users/iam/${iamId}/role-status?email=${email}&name=${name}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch role status");
  }
  return res.json();
};

export const assignRole = async (apiFetch, userId, role) => {
  const res = await apiFetch(`/api/Users/${userId}/role`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(role),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to assign role");
  }
  return res.json();
};

export const generateActivationToken = async (apiFetch, userId) => {
  const res = await apiFetch(`/api/Users/${userId}/activation-token`, {
    method: "POST",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to generate activation token");
  }
  return res.json();
};

export const deactivateUser = async (apiFetch, userId) => {
  const res = await apiFetch(`/api/Users/${userId}/deactivate`, {
    method: "PUT",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to deactivate user");
  }
  return res.json();
};

export const reactivateUser = async (apiFetch, userId) => {
  const res = await apiFetch(`/api/Users/${userId}/reactivate`, {
    method: "PUT",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to reactivate user");
  }
  return res.json();
};

export const activateUser = async (apiFetch, userDto) => {
  const res = await apiFetch("/api/Users/activate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userDto),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to activate user");
  }
  return res.json();
};

export const createUser = async (apiFetch, userDto) => {
  const res = await apiFetch("/api/Users/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userDto),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create user");
  }
  return res.json();
};
