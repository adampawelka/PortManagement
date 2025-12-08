// src/viewmodels/useAddVesselVM.js
import { useState, useEffect } from 'react';
import { useApi } from '../services/api';

const initialFormState = {
  imoNumber: '',
  vesselName: '',
  vesselTypeId: '',
  operatorOwner: '',
};

export const useAddVesselVM = () => {
  const { apiFetch } = useApi();

  const [formData, setFormData] = useState(initialFormState);
  const [vesselTypes, setVesselTypes] = useState([]);
  const [shippingAgents, setShippingAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [criticalError, setCriticalError] = useState(false); // blocks form completely
  const [partialError, setPartialError] = useState(false);   // dropdowns failed

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Fetch dropdowns
        const [typesRes, agentsRes] = await Promise.all([
          apiFetch('/api/VesselTypes'),
          apiFetch('/api/ShippingAgents'),
        ]);

        if (!typesRes.ok || !agentsRes.ok) {
          setMessage({ type: 'warning', text: 'Failed to load types or shipping agents. Some fields may be disabled.' });
          setPartialError(true);
        } else {
          const [typesData, agentsData] = await Promise.all([typesRes.json(), agentsRes.json()]);
          setVesselTypes(typesData);
          setShippingAgents(agentsData);
        }

        // Check critical endpoint
        const vesselsRes = await apiFetch('/api/Vessels', { method: 'GET' });
        if (!vesselsRes.ok) throw new Error('Cannot reach vessels endpoint');

      } catch (error) {
        console.error(error);
        setMessage({ type: 'error', text: 'Cannot fetch critical data. Form disabled.' });
        setCriticalError(true);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [apiFetch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (criticalError) return; // prevent submission if API is unreachable

    setSubmitting(true);
    setMessage(null);

    if (!formData.imoNumber || !formData.vesselTypeId || !formData.operatorOwner) {
      setMessage({ type: 'error', text: 'IMO, Vessel Type, and Operator/Owner are required.' });
      setSubmitting(false);
      return;
    }

    const vesselDto = {
      imo: formData.imoNumber,
      vesselName: formData.vesselName,
      vesselTypeId: formData.vesselTypeId,
      ownerId: formData.operatorOwner,
    };

    try {
      const response = await apiFetch('/Vessels', {
        method: 'POST',
        body: JSON.stringify(vesselDto),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Vessel added successfully!' });
        setFormData(initialFormState);
      } else {
        const errorData = response.status === 400 ? await response.json() : { Message: response.statusText };
        setMessage({ type: 'error', text: `Submission failed: ${errorData.Message || response.statusText}` });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error or token failure.' });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    vesselTypes,
    shippingAgents,
    loading,
    submitting,
    message,
    criticalError,
    partialError,
    handleChange,
    handleSubmit,
  };
};
