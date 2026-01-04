// FETCH ALL INCIDENTS (with optional filters)
export const getIncidents = async (apiOemFetch, filters = {}) => {
  let url = "/api/incidents";
  const params = new URLSearchParams();
  
  if (filters.vesselName) params.append("vesselName", filters.vesselName);
  if (filters.dateStart) params.append("dateStart", filters.dateStart);
  if (filters.dateEnd) params.append("dateEnd", filters.dateEnd);
  if (filters.severity) params.append("severity", filters.severity);
  if (filters.status) params.append("status", filters.status);
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const res = await apiOemFetch(url);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch incidents");
  }
  return res.json();
};

// FETCH INCIDENT BY ID
export const getIncidentById = async (apiOemFetch, id) => {
  const res = await apiOemFetch(`/api/incidents/${id}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    if (res.status === 404) {
      throw new Error("Incident not found");
    }
    throw new Error(errorData.message || "Failed to fetch incident");
  }
  return res.json();
};

// CREATE INCIDENT
export const createIncident = async (apiOemFetch, incidentDto) => {
  const res = await apiOemFetch("/api/incidents", {
    method: "POST",
    body: JSON.stringify(incidentDto),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    if (res.status === 400) {
      throw new Error(errorData.message || "Validation error: Invalid incident data");
    }
    throw new Error(errorData.message || "Failed to create incident");
  }
  return res.json();
};

// UPDATE INCIDENT
export const updateIncident = async (apiOemFetch, id, incidentDto) => {
  const res = await apiOemFetch(`/api/incidents/${id}`, {
    method: "PUT",
    body: JSON.stringify(incidentDto),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    if (res.status === 404) {
      throw new Error("Incident not found");
    }
    if (res.status === 400) {
      throw new Error(errorData.message || "Validation error: Invalid incident data");
    }
    throw new Error(errorData.message || "Failed to update incident");
  }
  return res.json();
};

// GET INCIDENTS BY TYPE
export const getIncidentsByType = async (apiOemFetch, typeId) => {
  const res = await apiOemFetch(`/api/incidents/type/${typeId}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch incidents by type");
  }
  return res.json();
};

