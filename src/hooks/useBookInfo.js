import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const useBookInfo = (book) => {
  const [bookInfo, setBookInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const fetchBookInfo = async () => {
      setIsLoading(true);
      // await delay(3000);
      const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/bookInfo`, { params: { book } });
      setBookInfo(response.data);
      setIsLoading(false);
    };
    fetchBookInfo();
  }, [book]);

  return bookInfo;
};

export default useBookInfo;