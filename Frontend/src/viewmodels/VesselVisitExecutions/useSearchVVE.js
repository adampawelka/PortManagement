import { useState, useCallback, useEffect } from "react";
import { useApiOEM } from "../../services/api";
import { searchVVEs } from "../../services/vesselVisitExecutionService";

export const useSearchVVE = () => {
  const { apiOemFetch } = useApiOEM();

  // Estado de datos
  const [vves, setVves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estado de filtros
  const [filters, setFilters] = useState({
    dateStart: "",
    dateEnd: "",
    vesselName: "",
    status: ""
  });

  // Estado auxiliar para saber si se ha realizado una búsqueda
  const [hasSearched, setHasSearched] = useState(false);

  // Función de búsqueda principal
  const search = useCallback(async (overrideFilters = null) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    
    const filtersToUse = overrideFilters || filters;

    try {
      const data = await searchVVEs(apiOemFetch, filtersToUse);
      setVves(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error searching VVEs:", err);
      // Mensaje amigable si falla la conexión
      let msg = "Failed to load execution history.";
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        msg = "Cannot connect to OEM Backend. Please check your connection.";
      }
      setError(msg);
      setVves([]);
    } finally {
      setLoading(false);
    }
  }, [apiOemFetch, filters]);

  // Cargar todos los datos al montar el componente (opcional, si quieres ver la lista llena al entrar)
  useEffect(() => {
    search({}); // Llamada sin filtros para traer todo
  }, [search]);

  // Manejadores de eventos
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    const emptyFilters = { dateStart: "", dateEnd: "", vesselName: "", status: "" };
    setFilters(emptyFilters);
    search(emptyFilters);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    search();
  };

  // Helper para formatear minutos a horas:minutos (para las métricas)
  const formatDuration = (minutes) => {
    if (!minutes && minutes !== 0) return "-";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}m`;
    return `${h}h ${m}m`;
  };

  return {
    vves,
    loading,
    error,
    filters,
    hasSearched,
    handleFilterChange,
    handleClearFilters,
    handleSearchSubmit,
    formatDuration
  };
};