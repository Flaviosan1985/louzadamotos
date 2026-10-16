"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseQueryOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

export function useQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: UseQueryOptions<T>,
) {
  const enabled = options?.enabled !== false;
  const fetcherRef = useRef(fetcher);
  const onSuccessRef = useRef(options?.onSuccess);
  const onErrorRef = useRef(options?.onError);
  fetcherRef.current = fetcher;
  onSuccessRef.current = options?.onSuccess;
  onErrorRef.current = options?.onError;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(enabled);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetcherRef.current();
      setData(result);
      onSuccessRef.current?.(result);
      return result;
    } catch (err) {
      const nextError = err instanceof Error ? err : new Error("Falha ao carregar.");
      setError(nextError);
      onErrorRef.current?.(nextError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      void refetch();
    }
  }, [key, refetch, enabled]);

  return { data, error, loading, refetch };
}
