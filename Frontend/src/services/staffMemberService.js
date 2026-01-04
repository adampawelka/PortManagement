export const getStaffMembers = async (apiFetch) => {
  const res = await apiFetch("/api/StaffMembers");
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch staff members");
  }
  return res.json();
};

export const addStaffMember = async (apiFetch, StaffMemberDto) => {
  const res = await apiFetch("/api/StaffMembers", {
    method: "POST",
    body: JSON.stringify(StaffMemberDto),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to add staff member");
  }
  return res.json();
};

// export const updateStaffMember = async (apiFetch, staffMemberId, StaffMemberDto) => {
//   const res = await apiFetch(`/api/StaffMembers/${staffMemberId}`, {
//     method: "PUT",
//     body: JSON.stringify(StaffMemberDto),
//   });
//   if (!res.ok) {
//     const errorData = await res.json().catch(() => ({}));
//     throw new Error(errorData.message || "Failed to update staff member");
//   }
//   return res.json();
// };

export const activateStaffMember = async (apiFetch, staffMemberId) => {
  const res = await apiFetch(`/api/StaffMembers/${staffMemberId}/reactivate`, {
    method: "PUT",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to activate staff member");
  }

  try {
    return await res.json();
  } catch {
    return {};
  }
};

export const deactivateStaffMember = async (apiFetch, staffMemberId) => {
  const res = await apiFetch(`/api/StaffMembers/${staffMemberId}/deactivate`, {
    method: "PUT",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to deactivate staff member");
  }

  try {
    return await res.json();
  } catch {
    return {};
  }
};



// no endpoint for deletion yet
// export const deleteStaffMember = async (apiFetch, staffMemberId) => {
//   const res = await apiFetch(`/api/StaffMembers/${staffMemberId}`, {
//     method: "DELETE",
//   });
//   if (!res.ok) {
//     const errorData = await res.json().catch(() => ({}));
//     throw new Error(errorData.message || "Failed to delete staff member");
//   }
//   return res.json();
// };


