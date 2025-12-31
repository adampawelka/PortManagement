// FETCH ALL CATEGORIES
export const getComplementaryTaskCategories = async (apiOemFetch) => {
  const res = await apiOemFetch("/api/complementaryTaskCategories");
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch complementary task categories");
  }
  return res.json();
};

// FETCH CATEGORY BY ID
export const getComplementaryTaskCategoryById = async (apiOemFetch, id) => {
  const res = await apiOemFetch(`/api/complementaryTaskCategories/${id}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch complementary task category");
  }
  return res.json();
};

// ADD CATEGORY
export const addComplementaryTaskCategory = async (apiOemFetch, categoryDto) => {
  const res = await apiOemFetch("/api/complementaryTaskCategories", {
    method: "POST",
    body: JSON.stringify(categoryDto),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to add complementary task category");
  }
  return res.json();
};

// UPDATE CATEGORY
export const editComplementaryTaskCategory = async (apiOemFetch, id, categoryDto) => {
  const res = await apiOemFetch(`/api/complementaryTaskCategories/${id}`, {
    method: "PUT",
    body: JSON.stringify(categoryDto),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update complementary task category");
  }
  return res.json();
};

// MOCK DATA GENERATOR
export const generateMockComplementaryTaskCategories = () => {
  const baseCategories = [
    { name: "Documentation", description: "Tasks related to documentation" },
    { name: "Maintenance", description: "Regular maintenance tasks" },
    { name: "Support", description: "Customer support tasks" },
    { name: "Development", description: "Development-related tasks" },
    { name: "Testing", description: "QA and testing tasks" },
  ];

  return baseCategories.map((cat, i) => ({
    id: `${i + 1}`,
    code: `CTC-${i + 1}`,
    name: cat.name,
    description: cat.description,
  }));
};
