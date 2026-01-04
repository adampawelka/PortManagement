import { useState, useEffect } from 'react';
import { useApi } from '../../services/api';
import { getVessels } from '../../services/vesselService';
import { getShippingAgents } from '../../services/shippingAgentService';
import { addVesselVisitNotification } from '../../services/vesselVisitNotificationService';
import { useNotification } from '../../hooks/useNotification';
import { useFormAutoSave } from '../../hooks/useFormAutoSave';

const getInitialFormState = () => ({
  vesselId: '',
  submittedById: '',
  eta: new Date().toISOString().slice(0, 16),
  etd: new Date().toISOString().slice(0, 16),
  loadunload: '',
  manifestContainers: '',
  crewName: '',
  crewCitizenId: '',
  crewNationality: '',
});

export const useAddVesselVisitNotificationVM = () => {
  const { apiFetch } = useApi();
  const { showSuccess } = useNotification();

  const [formData, setFormData] = useState(getInitialFormState());
  const [vessels, setVessels] = useState([]);
  const [representatives, setRepresentatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  // Auto-save form
  const { clearSavedData } = useFormAutoSave(
    'add-notification-form',
    formData,
    setFormData,
    getInitialFormState
  );

  useEffect(() => {
    const loadInitial = async () => {
      try {
        const [vesselsData, agentsData] = await Promise.all([
          getVessels(apiFetch),
          getShippingAgents(apiFetch),
        ]);

        setVessels(vesselsData || []);

        const reps = (agentsData || []).flatMap(org =>
          (org.representatives || []).map(r => ({
            id: r.id,
            name: r.name,
            email: r.email,
            organizationId: org.id,
            organizationName: org.legalName,
          }))
        );

        setRepresentatives(reps);
      } catch (err) {
        setMessage({ type: 'error', text: 'Failed to load vessels or representatives.' });
      } finally {
        setLoading(false);
      }
    };

    loadInitial();
  }, [apiFetch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.vesselId || !formData.submittedById) {
      setMessage({ type: 'error', text: 'Vessel and Submitter must be selected.' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    const vvnDto = {
      VesselId: formData.vesselId,
      SubmittedById: formData.submittedById,
      ETA: formData.eta + ':00Z',
      ETD: formData.etd + ':00Z',
      CargoManifests: [
        {
          ManifestType: formData.loadunload,
          ContainerIdentifiers: formData.manifestContainers
            ? formData.manifestContainers.split(',').map(id => id.trim())
            : [],
        },
      ],
      CrewMembers: [
        {
          Name: formData.crewName,
          CitizenId: formData.crewCitizenId,
          Nationality: formData.crewNationality,
        },
      ],
    };

    try {
      await addVesselVisitNotification(apiFetch, vvnDto);
      showSuccess('Notification submitted successfully!');
      setMessage({ type: 'success', text: 'Notification submitted successfully!' });
      setFormData(getInitialFormState());
      clearSavedData();
    } catch (err) {
      setMessage({ type: 'error', text: `Submission failed: ${err.message}` });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    vessels,
    representatives,
    loading,
    submitting,
    message,
    handleChange,
    handleSubmit,
  };
};
