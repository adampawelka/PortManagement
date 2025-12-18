import { useState, useEffect } from 'react';
 
import { addVessel } from '../../services/vesselService';
import { getVesselTypes } from '../../services/vesselTypeService';
import { getShippingAgents } from '../../services/shippingAgentService';
import { useApi } from '../../services/api';
import { useNotification } from '../../hooks/useNotification';

const initialFormState = {
  imoNumber: '',
  vesselName: '',
  vesselTypeId: '',
  operatorOwner: '',
};

export const useAddVesselVM = () => {
  const { apiFetch } = useApi();
  const { showSuccess } = useNotification();

  const [formData, setFormData] = useState(initialFormState);
  const [vesselTypes, setVesselTypes] = useState([]);
  const [shippingAgents, setShippingAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [criticalError, setCriticalError] = useState(false);
  const [partialError, setPartialError] = useState(false);

  useEffect(() => {
  const loadInitialData = async () => {
    try {
      const [typesData, agentsData] = await Promise.all([
        getVesselTypes(apiFetch),
        getShippingAgents(apiFetch),
      ]);

      setVesselTypes(typesData);
      setShippingAgents(agentsData);
    } catch (err) {
      console.error(err);
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
    if (criticalError) return;

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
      await addVessel(apiFetch, vesselDto);
      // Show success notification toast
      showSuccess('Vessel added successfully!');
      // Also set message for Alert (optional - can remove later)
      setMessage({ type: 'success', text: 'Vessel added successfully!' });
      setFormData(initialFormState);
    } catch (err) {
      // Error notifications are already handled by api.js (toast notification)
      // But we also keep the Alert message for visibility on the page
      setMessage({ type: 'error', text: err.message || 'Failed to add vessel' });
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
