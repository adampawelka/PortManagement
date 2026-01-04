import { useState, useEffect } from 'react';
import { privacyPolicyService } from '../../services/privacyPolicyService';

export const usePrivacyPolicyVM = () => {
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const data = await privacyPolicyService.getCurrentPolicy();
        setPolicy(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicy();
  }, []);

  return { policy, loading, error };
};