import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';

const useRatings = (filters, currentPage, sortField, sortOrder) => {
  const [ratings, setRatings] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRatings = useCallback(async () => {
    try {
      const responseUrl = `${process.env.REACT_APP_API_URL}/allRatings`;
      let filters_copy = { ...filters, currentPage, sortField, sortOrder, limit: 20 };
      Object.keys(filters_copy).forEach(key => {
        if (filters_copy[key] === '') {
          delete filters_copy[key];
        }
      });
      const response = await axiosInstance.get(responseUrl, { params: filters_copy });
      setRatings(response.data.ratings);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  }, [filters, currentPage, sortField, sortOrder]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  return { ratings, totalPages, fetchRatings };
};

export default useRatings;