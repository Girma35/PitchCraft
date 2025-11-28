import { useState } from 'react';
import { api, GenerateEmailResponse } from '../lib/api';

export function useGenerateEmail() {
  const [data, setData] = useState<GenerateEmailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateEmail = async (linkedinUrl: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await api.generateEmail(linkedinUrl);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, generateEmail };
}
