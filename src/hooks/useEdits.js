import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';

const useEdits = (filters, currentPage, sortField, sortOrder) => {
    const [edits, setEdits] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    // const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const fetchEdits = useCallback(async () => {
      setIsLoading(true);
      try {
        // await delay(1000);
        const responseUrl = `${process.env.REACT_APP_API_URL}/allEdits`;
        let filters_copy = { ...filters, currentPage, sortField, sortOrder, limit: 20 };
        Object.keys(filters_copy).forEach(key => {
          if (filters_copy[key] === '') {
            delete filters_copy[key];
          }
        });
        const response = await axiosInstance.get(responseUrl, { params: filters_copy });
        setEdits(response.data.edits);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching edits:', error);
      } finally {
        setIsLoading(false);
      }
    }, [filters, currentPage, sortField, sortOrder]);
  
    useEffect(() => {
      fetchEdits();
    }, [fetchEdits]);
  
    return { edits, totalPages, fetchEdits, isLoading };
  };

export default useEdits;