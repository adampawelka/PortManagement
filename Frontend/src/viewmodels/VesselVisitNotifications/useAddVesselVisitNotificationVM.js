import { useState, useEffect, useCallback } from 'react';
import { getVesselVisitNotifications, addVesselVisitNotification } from '../../services/vesselVisitNotificationService';
import { useApi } from '../../services/api';
import { getVessels } from '../../services/vesselService';
import { getShippingAgents } from '../../services/shippingAgentService';

export const useAddVesselVisitNotificationVM = () => {
  const { apiFetch } = useApi();
  const [formData, setFormData] = useState({
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

  const [vessels, setVessels] = useState([]);
  const [representatives, setRepresentatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const loadInitial = async () => {
      try {
        const [vesselsData, agentsData] = await Promise.all([
          getVessels(apiFetch),
          getShippingAgents(apiFetch)
        ]);

        setVessels(vesselsData || []);

        const reps = (agentsData || []).flatMap(org => (org.representatives || []).map(r => ({
          id: r.id,
          name: r.name,
          email: r.email,
          organizationId: org.id,
          organizationName: org.legalName
        })));

        setRepresentatives(reps);
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to load vessels or representatives.' });
      } finally {
        setLoading(false);
      }
    };
    loadInitial();
  }, [apiFetch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    if (!formData.vesselId || !formData.submittedById) {
      setMessage({ type: 'error', text: 'Vessel and Submitter must be selected.' });
      setSubmitting(false);
      return;
    }

    const vvnDto = {
      VesselId: formData.vesselId,
      SubmittedById: formData.submittedById,
      ETA: formData.eta + ':00Z',
      ETD: formData.etd + ':00Z',
      CargoManifests: [
        {
          ManifestType: formData.loadunload,
          ContainerIdentifiers: formData.manifestContainers.split(',').map(id => id.trim()),
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
      const response = await addVesselVisitNotification(apiFetch, vvnDto);
      setMessage({ type: 'success', text: 'Notification submitted successfully!' });
      setFormData({
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
    } catch (err) {
      setMessage({ type: 'error', text: `Submission failed: ${err.message}.` });
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
