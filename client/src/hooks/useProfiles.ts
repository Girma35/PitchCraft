import { useState, useEffect } from 'react';
import { api, ProfileListItem } from '../lib/api';

export function useProfiles(limit = 10, offset = 0) {
  const [data, setData] = useState<ProfileListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await api.getProfiles(limit, offset);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [limit, offset]);

  return { data, loading, error };
}
