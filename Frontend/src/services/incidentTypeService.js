// FETCH ALL INCIDENT TYPES
export const getIncidentTypes = async (apiOemFetch, parentId) => {
  let url = "/api/incidentTypes";
  if (parentId) url += `?parentId=${parentId}`;

  const res = await apiOemFetch(url);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch incident types");
  }
  return res.json();
};

// FETCH INCIDENT TYPE BY ID
export const getIncidentTypeById = async (apiOemFetch, id) => {
  const res = await apiOemFetch(`/api/incidentTypes/${id}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch incident type");
  }
  return res.json();
};

// ADD INCIDENT TYPE
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

// UPDATE INCIDENT TYPE
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
export const generateMockIncidentTypes = () => {
  const types = [
    { name: "Safety", description: "Safety related incidents", severity: "Minor" },
    { name: "Security", description: "Security breaches", severity: "Major" },
    { name: "Technical", description: "Technical failures", severity: "Critical" },
    { name: "Operational", description: "Operational issues", severity: "Minor" },
    { name: "Environmental", description: "Environmental hazards", severity: "Major" },
  ];

  const parents = types.map((t, i) => ({
    id: i + 1,
    code: `INC-P${i + 1}`,
    name: t.name,
    description: t.description,
    severity: t.severity,
    parentId: null,
    parentName: null,
  }));

  const children = [];
  parents.forEach((p, i) => {
    const childCount = Math.floor(Math.random() * 2) + 1;
    for (let j = 0; j < childCount; j++) {
      const type = types[(i + j + 1) % types.length];
      children.push({
        id: parents.length + children.length + 1,
        code: `INC-C${parents.length + children.length + 1}`,
        name: type.name + " Child",
        description: type.description,
        severity: type.severity,
        parentId: p.id,
        parentName: p.name,
      });
    }
  });

  return [...parents, ...children];
};
