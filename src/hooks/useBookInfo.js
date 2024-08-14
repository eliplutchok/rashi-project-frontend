import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const useBookInfo = (book) => {
  const [bookInfo, setBookInfo] = useState({});

  useEffect(() => {
    const fetchBookInfo = async () => {
      const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/bookInfo`, { params: { book } });
      setBookInfo(response.data);
    };
    fetchBookInfo();
  }, [book]);

  return bookInfo;
};

export default useBookInfo;