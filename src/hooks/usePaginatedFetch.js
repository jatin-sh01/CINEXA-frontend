

import { useState, useEffect, useCallback, useRef } from "react";

export default function usePaginatedFetch(
  fetchFn,
  itemsPerPage = 10,
  dependencies = [],
) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchFnRef = useRef(fetchFn);

  
  useEffect(() => {
    fetchFnRef.current = fetchFn;
  }, [fetchFn]);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchFnRef.current();
      const items = Array.isArray(response) ? response : response?.data || [];
      setTotal(items.length);
      const start = (page - 1) * itemsPerPage;
      setData(items.slice(start, start + itemsPerPage));
    } catch (err) {
      setError(err.message || "Failed to fetch data");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [page, itemsPerPage]);

  const dependenciesKey = JSON.stringify(dependencies);

  useEffect(() => {
    refetch();
  }, [page, dependenciesKey, refetch]);

  return {
    data,
    page,
    setPage,
    total,
    loading,
    error,
    hasNextPage: page * itemsPerPage < total,
    hasPreviousPage: page > 1,
    refetch,
  };
}
