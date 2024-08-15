import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const useBookInfo = (book) => {
  const [bookInfo, setBookInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBookInfo = async () => {
      setIsLoading(true);
      const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/bookInfo`, { params: { book } });
      setBookInfo(response.data);
      setIsLoading(false);
    };
    fetchBookInfo();
  }, [book]);

  return bookInfo;
};

export default useBookInfo;