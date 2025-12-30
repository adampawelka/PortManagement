export const getIncidentTypes = async (apiOemFetch) => {
  const res = await apiOemFetch("/api/incidentTypes");
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch incident types");
  }
  return res.json();
};

export const getIncidentTypeById = async (apiOemFetch, id) => {
  const res = await apiOemFetch(`/api/incidentTypes/${id}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch incident type");
  }
  return res.json();
};

export const addIncidentType = async (apiOemFetch, incidentTypeDto) => {
  const res = await apiOemFetch("/api/incidentTypes", {
    method: "POST",
    body: JSON.stringify(incidentTypeDto),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to add incident type");
  }
  return res.json();
};

export const updateIncidentType = async (apiOemFetch, id, incidentTypeDto) => {
  const res = await apiOemFetch(`/api/incidentTypes/${id}`, {
    method: "PUT",
    body: JSON.stringify(incidentTypeDto),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update incident type");
  }
  return res.json();
};

// MOCK DATA GENERATOR
export const generateMockIncidentTypes = (count = 5) => {
  const types = [
    { name: "Safety", description: "Safety related incidents", severity: "High" },
    { name: "Security", description: "Security breaches", severity: "Medium" },
    { name: "Technical", description: "Technical failures", severity: "High" },
    { name: "Operational", description: "Operational issues", severity: "Low" },
    { name: "Environmental", description: "Environmental hazards", severity: "Medium" },
  ];

  return Array.from({ length: count }, (_, i) => {
    const type = types[i % types.length]; // loop if count > types.length
    return {
      id: i + 1,
      code: `INC-${i + 1}`,
      name: type.name,
      description: type.description,
      severity: type.severity,
      parent: i % 2 === 0 ? null : { id: Math.floor(Math.random() * 5) + 1, name: "Parent Type Example" } // optional parent
    };
  });
};
