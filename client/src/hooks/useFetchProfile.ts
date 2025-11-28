import { useState } from 'react';
import { api } from '../lib/api';

export function useFetchProfile() {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (linkedinUrl: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await api.fetchProfile(linkedinUrl);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchProfile };
}
