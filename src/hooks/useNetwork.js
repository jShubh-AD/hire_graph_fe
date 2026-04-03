import { useState, useEffect, useCallback } from 'react';
import { networkApi } from '../api';

export const useNetwork = () => {
  const [following, setFollowing] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to ensure we always have an array and extract it from common response structures
  const ensureArray = (data, fallback = []) => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object') {
      // Check common nesting patterns
      if (Array.isArray(data.data)) return data.data;
      if (Array.isArray(data.users)) return data.users;
      if (Array.isArray(data.items)) return data.items;
      if (Array.isArray(data.results)) return data.results;
    }
    return fallback;
  };

  const fetchNetwork = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('[DEBUG] Fetching network data from API...');
      const [followingRes, suggestionsRes] = await Promise.all([
        networkApi.getFollowing(),
        networkApi.getSuggestions()
      ]);

      console.log('[DEBUG] Following API Response:', followingRes.data);
      console.log('[DEBUG] Suggestions API Response:', suggestionsRes.data);

      const followingData = ensureArray(followingRes.data);
      const suggestionsData = ensureArray(suggestionsRes.data);

      console.log('[DEBUG] Processed Following:', followingData);
      console.log('[DEBUG] Processed Suggestions:', suggestionsData);

      setFollowing(followingData);
      setSuggestions(suggestionsData);
    } catch (err) {
      console.error('[CRITICAL] Network fetch failed:', err);
      setError('Could not load network. Please try again.');
      setFollowing([]);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNetwork();
  }, [fetchNetwork]);

  const follow = useCallback(async (user) => {
    if (!user?.userId) return;
    
    // Save current state for rollback
    const prevFollowing = Array.isArray(following) ? [...following] : [];
    const prevSuggestions = Array.isArray(suggestions) ? [...suggestions] : [];

    // Optimistic Update
    setFollowing(prev => [...(Array.isArray(prev) ? prev : []), user]);
    setSuggestions(prev => (Array.isArray(prev) ? prev : []).filter(s => s?.userId !== user.userId));

    try {
      await networkApi.followUser(user.userId);
      console.log('[DEBUG] Follow success for:', user.userId);
    } catch (err) {
      console.error('[ERROR] Follow failed:', err);
      setFollowing(prevFollowing);
      setSuggestions(prevSuggestions);
      alert('Failed to follow user. Please try again.');
    }
  }, [following, suggestions]);

  const unfollow = useCallback(async (userId) => {
    if (!userId) return;

    // Save current state for rollback
    const prevFollowing = Array.isArray(following) ? [...following] : [];
    const userToRestore = prevFollowing.find(u => u?.userId === userId);

    // Optimistic Update
    setFollowing(prev => (Array.isArray(prev) ? prev : []).filter(u => u?.userId !== userId));
    
    try {
      await networkApi.unfollowUser(userId);
      console.log('[DEBUG] Unfollow success for:', userId);
    } catch (err) {
      console.error('[ERROR] Unfollow failed:', err);
      setFollowing(prevFollowing);
      alert('Failed to unfollow. Please try again.');
    }
  }, [following]);

  const stats = {
    followingCount: Array.isArray(following) ? following.length : 0,
    sharedSkillsCount: Array.isArray(following) 
      ? following.reduce((acc, curr) => acc + (Number(curr?.shared_skill_count) || 0), 0)
      : 0
  };

  return {
    following: Array.isArray(following) ? following : [],
    suggestions: Array.isArray(suggestions) ? suggestions : [],
    isLoading,
    error,
    follow,
    unfollow,
    stats,
    refresh: fetchNetwork
  };
};
