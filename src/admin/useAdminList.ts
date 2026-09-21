import { useCallback, useEffect, useState } from "react";
import { getAdminResource, type Page } from "../services/api/admin";

export function useAdminList<T>(resource: string, params: Record<string, string | number | undefined>) {
  const [data, setData] = useState<Page<T>>({ count: 0, next: null, previous: null, results: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const stableParams = JSON.stringify(params);
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { setData(await getAdminResource<T>(resource, JSON.parse(stableParams) as typeof params)); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to load data."); }
    finally { setLoading(false); }
  }, [resource, stableParams]);
  useEffect(() => { void load(); }, [load]);
  return { data, loading, error, reload: load };
}

export function useDebouncedValue(value: string, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => { const timer = window.setTimeout(() => setDebounced(value), delay); return () => window.clearTimeout(timer); }, [delay, value]);
  return debounced;
}
