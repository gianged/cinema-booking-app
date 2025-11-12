import { useState, useCallback } from 'react';
import { message } from 'antd';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
  setData: (data: T | null) => void;
}

interface UseApiOptions {
  showSuccessMessage?: boolean;
  showErrorMessage?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const {
    showSuccessMessage = false,
    showErrorMessage = true,
    successMessage = 'Operation successful',
    errorMessage = 'Operation failed',
  } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const result = await apiFunction(...args);
        setState({ data: result, loading: false, error: null });

        if (showSuccessMessage) {
          message.success(successMessage);
        }

        return result;
      } catch (error) {
        const err = error as Error;
        setState({ data: null, loading: false, error: err });

        if (showErrorMessage) {
          message.error(err.message || errorMessage);
        }

        return null;
      }
    },
    [apiFunction, showSuccessMessage, showErrorMessage, successMessage, errorMessage]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  const setData = useCallback((data: T | null) => {
    setState((prev) => ({ ...prev, data }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData,
  };
}
