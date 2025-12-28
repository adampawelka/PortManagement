export const getQualifications = async (apiFetch) => {
  const res = await apiFetch("/api/Qualifications");

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch qualifications");
  }

  return res.json();
};

export const getQualificationById = async (apiFetch, qualificationId) => {
  const res = await apiFetch(`/api/Qualifications/${qualificationId}`);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch qualification");
  }

  return res.json();
};

export const addQualification = async (apiFetch, qualificationDto) => {
  const res = await apiFetch("/api/Qualifications", {
    method: "POST",
    body: JSON.stringify(qualificationDto),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create qualification");
  }

  return res.json();
};

export const updateQualification = async (
  apiFetch,
  qualificationId,
  qualificationDto
) => {
  const res = await apiFetch(`/api/Qualifications/${qualificationId}`, {
    method: "PUT",
    body: JSON.stringify(qualificationDto),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update qualification");
  }

  return res.json();
};
