import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const useAdminResource = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchResource = useCallback(async ({ silent = false } = {}) => {
    if (!url) {
      return;
    }

    if (!silent) {
      setLoading(true);
    }

    try {
      const response = await axios.get(url, { params: { t: Date.now() } });
      setData(response.data);
      setError('');
    } catch (fetchError) {
      console.error(`Failed to load ${url}:`, fetchError);
      setError('Failed to load the latest payment data.');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchResource();

    const refresh = () => {
      if (document.visibilityState === 'hidden') {
        return;
      }
      fetchResource({ silent: true });
    };

    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);

    return () => {
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [fetchResource]);

  return { data, loading, error, refetch: fetchResource, setData, setError };
};

export default useAdminResource;
