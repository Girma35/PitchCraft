import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export function useRawProfile(identifier: string | undefined) {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!identifier) {
      setLoading(false);
      return;
    }

    const fetchRawProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await api.getRawProfile(identifier);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRawProfile();
  }, [identifier]);

  return { data, loading, error };
}
