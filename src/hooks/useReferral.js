import { useState, useCallback } from 'react';
import { networkApi } from '../api';

export const useReferral = () => {
  const [referralData, setReferralData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReferralPath = useCallback(async (jobId) => {
    if (!jobId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const res = await networkApi.getReferralPath(jobId);
      setReferralData(res.data);
    } catch (err) {
      console.error(`Failed to fetch referral path for job ${jobId}:`, err);
      setError('Could not load referral information.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setReferralData(null);
    setError(null);
  }, []);

  return {
    referralData,
    isLoading,
    error,
    fetchReferralPath,
    reset
  };
};
