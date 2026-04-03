import { useState, useCallback } from 'react';
import { api } from '../api';

export const useJobActions = (initialJob) => {
  const [isSaved, setIsSaved] = useState(initialJob?.is_saved || false);
  const [isSaving, setIsSaving] = useState(false);
  const [isApplied, setIsApplied] = useState(initialJob?.is_applied || false);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = useCallback(async (jobId) => {
    if (isSaving || isSaved) return;
    setIsSaving(true);
    setError(null);
    try {
      await api.post(`/jobs/save/${jobId}`);
      setIsSaved(true);
      return true;
    } catch (err) {
      console.error('Failed to save job:', err);
      setError('Failed to save job. Please try again.');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, isSaved]);

  const handleApply = useCallback(async (jobId) => {
    if (isApplying || isApplied) return;
    setIsApplying(true);
    setError(null);
    try {
      await api.post(`/jobs/apply/${jobId}`);
      setIsApplied(true);
      return true;
    } catch (err) {
      console.error('Failed to apply for job:', err);
      setError('Failed to apply. Please try again.');
      return false;
    } finally {
      setIsApplying(false);
    }
  }, [isApplying, isApplied]);

  const resetActions = useCallback((job) => {
    setIsSaved(job?.is_saved || false);
    setIsApplied(job?.is_applied || false);
    setError(null);
  }, []);

  return {
    isSaved,
    isSaving,
    isApplied,
    isApplying,
    error,
    handleSave,
    handleApply,
    resetActions
  };
};
