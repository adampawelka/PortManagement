import { useState, useEffect, useCallback } from 'react';
import { getVesselVisitNotifications, addVesselVisitNotification } from '../../services/vesselVisitNotificationService';
import { useApi } from '../../services/api';
import { getVessels } from '../../services/vesselService';
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

  // Auto-save form data to localStorage
  const { clearSavedData } = useFormAutoSave(
    'add-notification-form',
    formData,
    setFormData,
    getInitialFormState
  );

  const [vessels, setVessels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const loadVessels = async () => {
      try {
        const vesselsData = await getVessels(apiFetch);
        setVessels(vesselsData);
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to load vessels.' });
      } finally {
        setLoading(false);
      }
    };
    loadVessels();
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
      // Show success notification toast
      showSuccess('Notification submitted successfully!');
      // Also set message for Alert (optional - can remove later)
      setMessage({ type: 'success', text: 'Notification submitted successfully!' });
      setFormData(getInitialFormState());
      // Clear saved form data after successful submission
      clearSavedData();
    } catch (err) {
      setMessage({ type: 'error', text: `Submission failed: ${err.message}.` });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    vessels,
    loading,
    submitting,
    message,
    handleChange,
    handleSubmit,
  };
};
