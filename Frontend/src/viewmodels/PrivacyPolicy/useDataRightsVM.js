import { useState } from 'react';
import { dataRightsService } from '../../services/dataRightsService';

export const useDataRightsVM = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submitAccessRequest = async (requestData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      await dataRightsService.submitAccessRequest(requestData);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitRectificationRequest = async (requestData) => {
  };

  const submitDeletionRequest = async (requestData) => {
  };

  return {
    submitAccessRequest,
    submitRectificationRequest,
    submitDeletionRequest,
    loading,
    error,
    success
  };
};