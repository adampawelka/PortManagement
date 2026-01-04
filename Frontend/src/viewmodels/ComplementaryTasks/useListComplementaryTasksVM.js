import { useState, useCallback, useEffect } from "react";
import { useApiOEM } from "../../services/api";
import { searchComplementaryTasks } from "../../services/complementaryTaskService";

export const useListComplementaryTasksVM = () => {
  const { apiOemFetch } = useApiOEM();

  // Datos
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filtros
  const [filters, setFilters] = useState({
    vesselName: "",
    status: "",
    dateStart: "",
    dateEnd: ""
  });

  // Estado auxiliar
  const [hasSearched, setHasSearched] = useState(false);

  // Función de búsqueda
  const search = useCallback(async () => {
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await searchComplementaryTasks(apiOemFetch, filters);
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Unexpected error loading tasks.");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [apiOemFetch, filters]);

  // Carga inicial automática
  useEffect(() => {
    search();
  }, []); // Array vacío = solo al montar

  // Manejadores de UI
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ vesselName: "", status: "", dateStart: "", dateEnd: "" });
    // Nota: El usuario tendrá que pulsar "Search" de nuevo para refrescar, 
    // o puedes llamar a search() aquí manualmente si prefieres.
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    search();
  };

  // Helper para lógica de negocio visual (Requisito US 4.1.15)
  // "Highlighting ongoing tasks that are currently impacting operations"
  const isCriticalTask = (task) => {
    return task.status === "ONGOING" && task.suspendsOperation === true;
  };

  return {
    tasks,
    loading,
    error,
    filters,
    hasSearched,
    handleFilterChange,
    handleClearFilters,
    handleSearchSubmit,
    isCriticalTask
  };
};