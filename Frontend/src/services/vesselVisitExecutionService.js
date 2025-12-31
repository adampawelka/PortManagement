export const getVVE = async (apiOemFetch, vveId) => {
  console.log("getVVE: Making request to /api/vesselVisitExecutions/", vveId);
  
  try {
    const res = await apiOemFetch(`/api/vesselVisitExecutions/${vveId}`);
    
    console.log("getVVE: Response status:", res.status);
    console.log("getVVE: Response ok:", res.ok);
    
    if (!res.ok) {
      const err = await res.json().catch(() => {
        console.error("getVVE: Failed to parse error response as JSON");
        return { message: `Server error: ${res.status} ${res.statusText}` };
      });
      console.error("getVVE: Error response:", err);
      throw new Error(err.message || `Failed to fetch vessel visit execution (${res.status})`);
    }
    
    const result = await res.json();
    console.log("getVVE: Success response:", result);
    return result;
  } catch (err) {
    console.error("getVVE: Exception caught:", err);
    throw err;
  }
};

export const getAllVVEs = async (apiOemFetch) => {
  console.log("getAllVVEs: Making request to /api/vesselVisitExecutions");
  
  try {
    const res = await apiOemFetch(`/api/vesselVisitExecutions`);
    
    console.log("getAllVVEs: Response status:", res.status);
    console.log("getAllVVEs: Response ok:", res.ok);
    
    if (!res.ok) {
      const err = await res.json().catch(() => {
        console.error("getAllVVEs: Failed to parse error response as JSON");
        return { message: `Server error: ${res.status} ${res.statusText}` };
      });
      console.error("getAllVVEs: Error response:", err);
      throw new Error(err.message || `Failed to fetch all vessel visit executions (${res.status})`);
    }
    
    const result = await res.json();
    console.log("getAllVVEs: Success response:", result);
    console.log("getAllVVEs: Number of VVEs:", Array.isArray(result) ? result.length : "Not an array");
    return result;
  } catch (err) {
    console.error("getAllVVEs: Exception caught:", err);
    throw err;
  }
};

export const createVVE = async (apiOemFetch, vveData) => {
  console.log("createVVE: Making request to /api/vesselVisitExecutions");
  console.log("createVVE: Request data:", vveData);
  
  try {
    const res = await apiOemFetch(`/api/vesselVisitExecutions`, {
      method: "POST",
      body: JSON.stringify(vveData),
    });
    
    console.log("createVVE: Response status:", res.status);
    console.log("createVVE: Response ok:", res.ok);
    
    if (!res.ok) {
      const err = await res.json().catch(() => {
        console.error("createVVE: Failed to parse error response as JSON");
        return { message: `Server error: ${res.status} ${res.statusText}` };
      });
      console.error("createVVE: Error response:", err);
      throw new Error(err.message || `Failed to create vessel visit execution (${res.status})`);
    }
    
    const result = await res.json();
    console.log("createVVE: Success response:", result);
    return result;
  } catch (err) {
    console.error("createVVE: Exception caught:", err);
    throw err;
  }
};

export const updateVVE = async (apiOemFetch, vveId, updates) => {
  const res = await apiOemFetch(`/api/vesselVisitExecutions/${vveId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update vessel visit execution");
  }
  return res.json();
};
