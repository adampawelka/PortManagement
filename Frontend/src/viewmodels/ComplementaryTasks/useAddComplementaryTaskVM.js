import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirigir tras éxito (opcional)
import { useApiOEM } from '../../services/api';
import { 
  addComplementaryTask, 
  getTaskCategories, 
  getActiveVVEs 
} from '../../services/complementaryTaskService';

export const useAddComplementaryTaskVM = () => {
  const { apiOemFetch } = useApiOEM();
  const navigate = useNavigate();

  // Estado del formulario
  const [formData, setFormData] = useState({
    vveId: '',
    categoryId: '',
    responsible: '',
    startTime: new Date().toISOString().slice(0, 16), // Formato datetime-local
    suspendsOperation: false
  });

  // Estado de datos auxiliares (Dropdowns)
  const [categories, setCategories] = useState([]);
  const [vves, setVves] = useState([]);

  // Estados de control
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [criticalError, setCriticalError] = useState(false);

  // Cargar datos para los Dropdowns al montar
  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const [catsData, vvesData] = await Promise.all([
          getTaskCategories(apiOemFetch),
          getActiveVVEs(apiOemFetch)
        ]);
        setCategories(catsData || []);
        setVves(vvesData || []);
      } catch (err) {
        console.error("Error loading form dependencies", err);
        // No bloqueamos (criticalError) porque el servicio ya usa Mocks de respaldo
      }
    };
    loadDependencies();
  }, [apiOemFetch]);

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
    setMessage(null);

    // Validación básica antes de enviar
    if (!formData.vveId || !formData.categoryId || !formData.responsible) {
        setMessage({ type: 'error', text: 'Please fill in all required fields.' });
        setSubmitting(false);
        return;
    }

    try {
      // Por defecto asignamos estado ONGOING al crear
      const dto = { ...formData, status: "ONGOING" };
      
      await addComplementaryTask(apiOemFetch, dto);
      
      setMessage({ type: 'success', text: 'Task recorded successfully!' });
      
      // Limpiar formulario o redirigir
      setFormData({
        vveId: '',
        categoryId: '',
        responsible: '',
        startTime: new Date().toISOString().slice(0, 16),
        suspendsOperation: false
      });
      
      // Opcional: Redirigir al listado tras 1.5 seg
      // setTimeout(() => navigate('/complementary-tasks/list'), 1500);

    } catch (err) {
      if (err.message?.includes('Failed to fetch')) {
        setCriticalError(true);
      }
      setMessage({ type: 'error', text: err.message || 'Failed to record task' });
    } finally {
      setSubmitting(false);
    }
  };

  return { 
    formData, 
    categories, 
    vves, 
    handleChange, 
    handleSubmit, 
    submitting, 
    message, 
    criticalError 
  };
};