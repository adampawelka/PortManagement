// src/viewmodels/OperationPlans/useMissingPlansVM.js
import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../../services/api'; 
import { getMissingOperationPlans, regenerateOperationPlans } from '../../services/operationPlanService';

export const useMissingPlansVM = () => {
  const { apiFetch } = useApi();
  
  // Estado para la fecha (por defecto hoy)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  
  // Estado para los datos
  const [missingPlans, setMissingPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  
  // Estado para mensajes (feedback usuario)
  const [message, setMessage] = useState(null);

  // Cargar planes faltantes cuando cambia la fecha
  const loadMissingPlans = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const data = await getMissingOperationPlans(apiFetch, selectedDate);
      setMissingPlans(data);
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Failed to load missing plans list.' });
    } finally {
      setLoading(false);
    }
  }, [apiFetch, selectedDate]);

  useEffect(() => {
    loadMissingPlans();
  }, [loadMissingPlans]);

  // Manejar cambio de fecha
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Manejar la regeneración (Asignar Plan)
  // Nota: Esto regenera TODOS los planes del día usando el algoritmo seleccionado
  const handleGenerate = async (algorithmName = "Genetic") => {
    // Advertencia de seguridad (Requisito US 4.1.5)
    const confirm = window.confirm(
      "Warning: Generating plans will overwrite any existing operational plans for this date. Do you want to continue?"
    );

    if (!confirm) return;

    setGenerating(true);
    setMessage(null);

    try {
      const dto = {
        date: selectedDate,
        algorithm: algorithmName
      };

      await regenerateOperationPlans(apiFetch, dto);
      
      setMessage({ type: 'success', text: 'Operational Plans generated successfully!' });
      
      // Recargar la lista (debería estar vacía si todo salió bien)
      await loadMissingPlans();
      
    } catch (err) {
      setMessage({ type: 'error', text: `Generation failed: ${err.message}` });
    } finally {
      setGenerating(false);
    }
  };

  return {
    selectedDate,
    missingPlans,
    loading,
    generating,
    message,
    handleDateChange,
    handleGenerate,
    refresh: loadMissingPlans
  };
};