import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';

const useComparisons = (filters, currentPage, sortField, sortOrder) => {
  const [comparisons, setComparisons] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchComparisons = useCallback(async () => {
    setIsLoading(true);
    try {
      const responseUrl = `${process.env.REACT_APP_API_URL}/allComparisons`;
      let filters_copy = { ...filters, currentPage, sortField, sortOrder, limit: 20 };
      Object.keys(filters_copy).forEach(key => {
        if (filters_copy[key] === '') {
          delete filters_copy[key];
        }
      });
      const response = await axiosInstance.get(responseUrl, { params: filters_copy });
      setComparisons(response.data.comparisons);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching comparisons:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters, currentPage, sortField, sortOrder]);

  useEffect(() => {
    fetchComparisons();
  }, [fetchComparisons]);

  return { comparisons, totalPages, fetchComparisons, isLoading };
};

export default useComparisons;