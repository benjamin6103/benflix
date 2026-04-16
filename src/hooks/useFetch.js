import { useState, useCallback, useEffect } from 'react';
import logger from '../services/logger.js';

/**
 * Custom hook for fetching data with loading and error states
 * @param {Function} fetchFunction - The async function to call
 * @param {Array} dependencies - Array of dependencies for useEffect
 * @param {Boolean} shouldFetch - Whether to fetch data (useful for conditional fetching)
 * @returns {Object} { data, loading, error, refetch }
 */
export const useFetch = (fetchFunction, dependencies = [], shouldFetch = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(shouldFetch);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      logger.error('Fetch error in useFetch', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  useEffect(() => {
    if (!shouldFetch) {
      setLoading(false);
      return;
    }

    refetch();
  }, dependencies);

  return { data, loading, error, refetch };
};

export default useFetch;
