// src/services/operationPlanService.js

export const getMissingOperationPlans = async (apiFetch, date) => {
  // --- MODO PRUEBA ACTIVADO ---
  // Comentamos la llamada real para no depender del backend
  /*
  const res = await apiFetch(`/api/operationPlans/missing?date=${date}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch missing plans");
  }
  return res.json();
  */

  // Simulamos un retardo de red de 1 segundo para ver el "Loading..."
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Devolvemos datos "fake" (Mock Data)
  console.log(`[MOCK] Fetching missing plans for date: ${date}`);
  
  // Caso 1: Devolver lista con datos
  return [
    {
      vvnId: "mock-vvn-001",
      vesselName: "MSC Test Vessel",
      imo: "9876543",
      eta: `${date}T10:00:00Z`,
      status: "Approved"
    },
    {
      vvnId: "mock-vvn-002",
      vesselName: "Maersk Demo",
      imo: "1234567",
      eta: `${date}T14:30:00Z`,
      status: "Approved"
    }
  ];
};

export const regenerateOperationPlans = async (apiFetch, generationDto) => {
  /* Llamada al endpoint POST que dispara el algoritmo: /api/operationPlans/regenerate
  const res = await apiFetch("/api/operationPlans/regenerate", {
    method: "POST",
    body: JSON.stringify(generationDto),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to regenerate plans");
  }

  return res.json(); // O res.text() si el backend devuelve solo texto
  */

  console.log("[MOCK] Iniciando algoritmo de planificación...", generationDto);
  
  // Simulamos que el algoritmo tarda 2 segundos en pensar
  await new Promise(resolve => setTimeout(resolve, 2000));

  // --- AQUÍ OCURRE LA MAGIA DEL MOCK ---
  // Simulamos que el algoritmo ha creado los planes, por tanto,
  // BORRAMOS las tareas pendientes de nuestra lista falsa.
  mockMissingDB = []; 

  return { message: "Plan generated successfully" };

};