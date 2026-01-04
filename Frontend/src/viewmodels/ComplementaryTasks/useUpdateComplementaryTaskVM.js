import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApiOEM, useApi } from "../../services/api";
import { 
  getComplementaryTaskById, 
  updateComplementaryTask, 
  getTaskCategories,
  getActiveVVEs // O usa getVesselVisitNotifications del servicio VVN si prefieres
} from "../../services/complementaryTaskService";

export const useUpdateComplementaryTaskVM = () => {
  const { id } = useParams(); // Obtener ID de la URL
  const navigate = useNavigate();
  const { apiOemFetch } = useApiOEM();

  // Estado del formulario
  const [formData, setFormData] = useState({
    vveId: "",
    categoryId: "",
    responsible: "",
    startTime: "",
    endTime: "",
    status: "",
    suspendsOperation: false
  });

  // Datos auxiliares
  const [categories, setCategories] = useState([]);
  const [vves, setVves] = useState([]);
  
  // Estado UI
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Cargar todo al iniciar
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        // Ejecutamos las 3 peticiones en paralelo
        const [taskData, catsData, vvesData] = await Promise.all([
          getComplementaryTaskById(apiOemFetch, id),
          getTaskCategories(apiOemFetch),
          getActiveVVEs(apiOemFetch)
        ]);

        // Mapear datos al formulario
        setFormData({
          vveId: taskData.vveId || "",
          categoryId: taskData.categoryId || (taskData.category ? taskData.category.id : "") || "",
          responsible: taskData.responsible || "",
          // Cortamos los segundos de la fecha ISO para que encaje en el input datetime-local
          startTime: taskData.startTime ? taskData.startTime.slice(0, 16) : "",
          endTime: taskData.endTime ? taskData.endTime.slice(0, 16) : "",
          status: taskData.status || "ONGOING",
          suspendsOperation: taskData.suspendsOperation || false
        });

        setCategories(catsData || []);
        setVves(vvesData || []);

      } catch (err) {
        console.error("Error loading task data:", err);
        setError("Failed to load task details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) initData();
  }, [apiOemFetch, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Regla de negocio: Si se marca como COMPLETED, se recomienda poner EndTime
      // (Podríamos forzarlo aquí o dejar que el backend valide)
      
      const updateDto = {
        ...formData,
        // Si el usuario vacía el campo fecha, enviamos null
        endTime: formData.endTime ? formData.endTime : null 
      };

      await updateComplementaryTask(apiOemFetch, id, updateDto);
      
      setSuccess("Task updated successfully!");
      
      // Redirigir tras éxito
      setTimeout(() => navigate("/complementary-tasks/list"), 1500);

    } catch (err) {
      setError(err.message || "Failed to update task");
    } finally {
      setSubmitting(false);
    }
  };

  return { 
    formData, categories, vves, loading, submitting, error, success, handleChange, handleSubmit 
  };
};