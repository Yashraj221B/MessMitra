// Custom hook for handling async operations

import { useState, useCallback } from 'react';

interface UseAsyncState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

interface UseAsyncReturn<T, Args extends any[]> extends UseAsyncState<T> {
  execute: (...args: Args) => Promise<T | undefined>;
  reset: () => void;
}

function useAsync<T = any, Args extends any[] = any[]>(
  asyncFunction: (...args: Args) => Promise<T>,
  immediate = false
): UseAsyncReturn<T, Args> {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    error: null,
    loading: immediate,
  });

  const execute = useCallback(
    async (...args: Args): Promise<T | undefined> => {
      setState({ data: null, error: null, loading: true });
      
      try {
        const response = await asyncFunction(...args);
        setState({ data: response, error: null, loading: false });
        return response;
      } catch (error) {
        setState({
          data: null,
          error: error instanceof Error ? error : new Error('Unknown error'),
          loading: false,
        });
        return undefined;
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, error: null, loading: false });
  }, []);

  return { ...state, execute, reset };
}

export default useAsync;
