export const getVesselVisitNotifications = async (apiFetch) => {
  const res = await apiFetch("/api/VesselVisitNotifications");
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch vessel visit notifications");
  }
  return res.json();
};

export const addVesselVisitNotification = async (apiFetch, vesselVisitNotificationDto) => {
  const res = await apiFetch("/api/VesselVisitNotifications", {
    method: "POST",
    body: JSON.stringify(vesselVisitNotificationDto),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to add vessel visit notification");
  }

  return res.json();
};

export const updateVesselVisitNotification = async (apiFetch, id, updatingDto) => {
  const res = await apiFetch(`/api/VesselVisitNotifications/${id}`, {
    method: "PUT",
    body: JSON.stringify(updatingDto),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update vessel visit notification");
  }

  return res.json();
};

export const submitVesselVisitNotification = async (apiFetch, id) => {
  const res = await apiFetch(`/api/VesselVisitNotifications/${id}/submit`, {
    method: "POST",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to submit vessel visit notification");
  }

  return res.json();
};

export const approveVesselVisitNotification = async (apiFetch, id, approveDto) => {
  const res = await apiFetch(`/api/VesselVisitNotifications/${id}/approve`, {
    method: "POST",
    body: JSON.stringify(approveDto),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to approve vessel visit notification");
  }

  return res.json();
};

export const rejectVesselVisitNotification = async (apiFetch, id, rejectBodyDto) => {
  const res = await apiFetch(`/api/VesselVisitNotifications/${id}/reject`, {
    method: "POST",
    body: JSON.stringify(rejectBodyDto),
    
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to reject vessel visit notification");
  }

  return res.json();
};
