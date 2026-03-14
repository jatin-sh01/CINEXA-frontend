import { useState, useEffect, useCallback, useRef } from "react";

export default function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchFnRef = useRef(fetchFn);

  
  useEffect(() => {
    fetchFnRef.current = fetchFn;
  }, [fetchFn]);

  const depsKey = JSON.stringify(deps);

  useEffect(() => {
    let isMounted = true;

    const performFetch = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchFnRef.current();
        if (isMounted) {
          setData(res);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Something went wrong");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    performFetch();

    return () => {
      isMounted = false;
    };
  }, [depsKey]);

  
  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchFnRef.current();
      setData(res);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, refetch };
}
