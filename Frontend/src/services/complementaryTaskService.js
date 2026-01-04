// --- MOCK DATA PARA DROPDOWNS Y RESPUESTAS ---
const MOCK_CATEGORIES = [
  { id: "cat-1", name: "Security Inspection" },
  { id: "cat-2", name: "Maintenance" },
  { id: "cat-3", name: "Cleaning" }
];

const MOCK_VVES = [
  { id: "vve-1", vesselName: "MSC Aries", vvnId: "VVN-001" },
  { id: "vve-2", vesselName: "Maersk Titan", vvnId: "VVN-002" }
];

// DATOS MOCK AMPLIADOS PARA EL LISTADO
const MOCK_TASKS_LIST = [
  {
    id: "TASK-001",
    vveId: "vve-alpha",
    vesselName: "MSC Aries",
    categoryName: "Security Inspection",
    responsible: "Port Security Team",
    startTime: "2026-01-03T09:00:00",
    endTime: "2026-01-03T10:00:00",
    status: "COMPLETED",
    suspendsOperation: true
  },
  {
    id: "task-002",
    vveId: "vve-beta",
    vesselName: "Maersk Titan",
    categoryName: "Cleaning",
    responsible: "External Cleaners Ltd",
    startTime: "2026-01-03T14:00:00",
    endTime: null,
    status: "ONGOING",
    suspendsOperation: false // Paralelo
  },
  {
    id: "task-003",
    vveId: "vve-beta",
    vesselName: "Maersk Titan",
    categoryName: "Engine Repair",
    responsible: "Maersk Engineering",
    startTime: "2026-01-03T15:00:00",
    endTime: null,
    status: "ONGOING",
    suspendsOperation: true // ¡CRÍTICO! Suspende operación
  },
  {
    id: "task-004",
    vveId: "vve-gamma",
    vesselName: "Evergreen Hope",
    categoryName: "Bunkering (Fuel)",
    responsible: "Fuel Supply Co.",
    startTime: "2026-01-04T08:00:00",
    endTime: null,
    status: "PLANNED",
    suspendsOperation: true
  }
];

// HELPER: GET CATEGORIES (Para el dropdown)
export const getTaskCategories = async (apiOemFetch) => {
  try {
    const res = await apiOemFetch("/api/complementaryTaskCategories");
    if (res.ok) return await res.json();
    throw new Error("Backend unavailable");
  } catch (error) {
    console.warn("[MOCK MODE] Serving Mock Categories");
    return MOCK_CATEGORIES;
  }
};

// HELPER: GET VVES (Para el dropdown de buques)
export const getActiveVVEs = async (apiOemFetch) => {
  try {
    const res = await apiOemFetch("/api/vesselVisitExecutions");
    if (res.ok) return await res.json();
    throw new Error("Backend unavailable");
  } catch (error) {
    console.warn("[MOCK MODE] Serving Mock VVEs");
    return MOCK_VVES;
  }
};

// ADD TASK
export const addComplementaryTask = async (apiOemFetch, taskDto) => {
  try {
    // 1. INTENTO REAL
    const res = await apiOemFetch("/api/complementaryTasks", {
      method: "POST",
      body: JSON.stringify(taskDto),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to add complementary task");
    }
    return await res.json();

  } catch (error) {
    // 2. FALLBACK MOCK (Simula éxito)
    console.warn("[MOCK MODE] Simulating Task Creation because:", error.message);
    
    // Si el error fue "Failed to fetch" (servidor caído), permitimos continuar con Mock
    // Si el error fue de validación del backend (400), lo lanzamos
    if (error.message && !error.message.includes("Failed to fetch") && !error.message.includes("Backend unavailable")) {
        throw error; 
    }

    await new Promise(r => setTimeout(r, 800)); // Simular espera
    return { id: "mock-id-123", ...taskDto };
  }
};

// FETCH ALL TASKS (Para el listado)
export const getComplementaryTasks = async (apiOemFetch) => {
  try {
    const res = await apiOemFetch("/api/complementaryTasks");
    if (!res.ok) throw new Error("Failed to fetch tasks");
    return await res.json();
  } catch (error) {
    // Retornamos lista vacía o mock si falla
    return [];
  }
};

export const searchComplementaryTasks = async (apiOemFetch, filters = {}) => {
  try {
    // 1. INTENTO REAL
    const params = new URLSearchParams();
    if (filters.vesselName) params.append('vesselName', filters.vesselName);
    if (filters.status) params.append('status', filters.status);
    if (filters.dateStart) params.append('dateStart', filters.dateStart);
    if (filters.dateEnd) params.append('dateEnd', filters.dateEnd);

    const queryString = params.toString();
    const url = `/api/complementaryTasks${queryString ? `?${queryString}` : ''}`;

    const res = await apiOemFetch(url);
    if (res.ok) return await res.json();
    
    throw new Error("Backend unavailable");

  } catch (error) {
    // 2. FALLBACK MOCK INTELIGENTE (Simula el filtrado del backend)
    console.warn("[MOCK MODE] Filtering local tasks because:", error.message);
    await new Promise(r => setTimeout(r, 600)); // Simular red

    let results = [...MOCK_TASKS_LIST];

    // Simular Filtro SQL 'LIKE' para nombre
    if (filters.vesselName) {
      const q = filters.vesselName.toLowerCase();
      results = results.filter(t => t.vesselName.toLowerCase().includes(q));
    }

    // Simular Filtro Exacto para Estado
    if (filters.status && filters.status !== "All") {
      results = results.filter(t => t.status === filters.status);
    }

    // Simular Filtro Fecha (Start Time)
    if (filters.dateStart) {
      results = results.filter(t => t.startTime >= filters.dateStart);
    }
    if (filters.dateEnd) {
      // Ajuste para incluir todo el día final
      results = results.filter(t => t.startTime <= filters.dateEnd + "T23:59:59");
    }

    return results;
  }
};


export const getComplementaryTaskById = async (apiOemFetch, id) => {
  try {
    // 1. INTENTO REAL
    const res = await apiOemFetch(`/api/complementaryTasks/${id}`);
    if (res.ok) return await res.json();
    throw new Error("Backend unavailable");
  } catch (error) {
    // 2. FALLBACK MOCK
    console.warn(`[MOCK MODE] Fetching task ${id} from local mocks`);
    await new Promise(r => setTimeout(r, 500));
    
    // Buscamos en la lista mock que definimos antes
    const found = MOCK_TASKS_LIST.find(t => t.id === id);
    
    // Si no existe (porque el ID es nuevo), devolvemos uno por defecto para que no rompa la demo
    return found || {
      id: id,
      vveId: "vve-alpha",
      vesselName: "MSC Aries (Mock)",
      categoryId: "cat-1",
      responsible: "Mock Team",
      startTime: "2026-01-03T09:00:00",
      endTime: null,
      status: "ONGOING",
      suspendsOperation: false
    };
  }
};

// UPDATE TASK
export const updateComplementaryTask = async (apiOemFetch, id, taskDto) => {
  try {
    // 1. INTENTO REAL
    const res = await apiOemFetch(`/api/complementaryTasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(taskDto),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update task");
    }
    return await res.json();

  } catch (error) {
    // 2. FALLBACK MOCK
    console.warn("[MOCK MODE] Simulating Task Update");
    
    // Si es un error de red real, permitimos el mock. Si es validación (400), lanzamos error.
    if (error.message && !error.message.includes("Backend unavailable") && !error.message.includes("Failed to fetch")) {
       throw error;
    }

    await new Promise(r => setTimeout(r, 800));
    return { id, ...taskDto };
  }
};

