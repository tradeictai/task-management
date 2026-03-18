import { useState, useCallback } from "react";

// ============================================
// USEAPI HOOK
// Handles API calls with loading/error states
// Phase 1-5: Used everywhere for async operations
// ============================================

export const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiFunction(...args);
        setData(result.data);
        return result;
      } catch (err) {
        const message = err.response?.data?.message || "An error occurred";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction],
  );

  return { data, loading, error, execute };
};
