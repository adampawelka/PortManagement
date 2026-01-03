const MOCK_VVES = [
  {
    id: "vve-001",
    vvnId: "vvn-alpha",
    vesselName: "MSC Aries",
    arrival: "2025-11-23T08:00:00Z",
    berth: "2025-11-23T10:30:00Z",
    departure: "2025-11-23T18:30:00Z",
    status: "COMPLETED",
    // Métricas pre-calculadas (como vendrían del backend)
    waitingTimeMinutes: 150,      // 2.5 horas esperando
    berthOccupancyMinutes: 480,   // 8 horas en muelle
    totalTurnaroundMinutes: 630   // 10.5 horas total
  },
  {
    id: "vve-002",
    vvnId: "vvn-beta",
    vesselName: "Maersk Titan",
    arrival: "2025-11-24T09:00:00Z",
    berth: "2025-11-24T09:15:00Z", // Atracó muy rápido
    departure: null, // Aún en puerto
    status: "IN_PROGRESS",
    waitingTimeMinutes: 15,
    berthOccupancyMinutes: 0, // Aún no se ha ido
    totalTurnaroundMinutes: 0
  },
  {
    id: "vve-003",
    vvnId: "vvn-gamma",
    vesselName: "Evergreen Hope",
    arrival: "2025-11-24T14:00:00Z",
    berth: null, // Aún esperando fondeado
    departure: null,
    status: "IN_PROGRESS",
    waitingTimeMinutes: 0,
    berthOccupancyMinutes: 0,
    totalTurnaroundMinutes: 0
  }
];




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

export const searchVVEs = async (apiOemFetch, filters = {}) => {
  // MOCK START
  console.log("searchVVEs [MOCK MODE]: Filters received:", filters);

  // Simulamos retardo de red para realismo
  await new Promise(resolve => setTimeout(resolve, 500));

  // Empezamos con TODOS los datos
  let results = [...MOCK_VVES];

  // --- APLICAR FILTROS MANUALMENTE (Simulando SQL WHERE) ---

  // 1. Filtro por Nombre (Case insensitive y parcial)
  if (filters.vesselName && filters.vesselName.trim() !== "") {
    const query = filters.vesselName.toLowerCase().trim();
    results = results.filter(v => 
      (v.vesselName && v.vesselName.toLowerCase().includes(query)) || 
      (v.vvnId && v.vvnId.toLowerCase().includes(query))
    );
  }

  // 2. Filtro por Estado (Coincidencia exacta)
  if (filters.status && filters.status !== "All" && filters.status !== "") {
    results = results.filter(v => v.status === filters.status);
  }

  // 3. Filtro por Fecha Inicio (Arrival >= dateStart)
  if (filters.dateStart) {
    // Comparamos strings ISO (YYYY-MM-DD)
    results = results.filter(v => v.arrival >= filters.dateStart);
  }

  // 4. Filtro por Fecha Fin (Arrival <= dateEnd)
  if (filters.dateEnd) {
    // Añadimos la hora final del día para incluir todo el día seleccionado
    const endOfDay = filters.dateEnd + "T23:59:59";
    results = results.filter(v => v.arrival <= endOfDay);
  }

  console.log(`[MOCK] Returning ${results.length} filtered VVEs`);
  return results;

  // --- MOCK END ---
  /*
  console.log("searchVVEs: Building query with filters:", filters);
  
  const params = new URLSearchParams();
  if (filters.dateStart) params.append('dateStart', filters.dateStart);
  if (filters.dateEnd) params.append('dateEnd', filters.dateEnd);
  if (filters.vesselName) params.append('vesselName', filters.vesselName);
  if (filters.status) params.append('status', filters.status);

  const queryString = params.toString();
  const url = `/api/vesselVisitExecutions${queryString ? `?${queryString}` : ''}`;

  console.log("searchVVEs: Requesting URL:", url);

  try {
    const res = await apiOemFetch(url);
    
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to search VVEs (${res.status})`);
    }

    const result = await res.json();
    console.log(`searchVVEs: Found ${Array.isArray(result) ? result.length : 0} records`);
    return result;
  } catch (err) {
    console.error("searchVVEs: Exception caught:", err);
    throw err;
  }*/
};
