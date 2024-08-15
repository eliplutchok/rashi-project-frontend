import axiosInstance from '../utils/axiosInstance';

export const fetchReadingProgress = async (userId, bookId = null) => {
  try {
    const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/getReadingProgress`, {
      params: { userId, bookId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching reading progress:', error);
    return null;
  }
};

export const updateReadingProgress = async (userId, bookId, lastReadPageId, lastReadPassageId) => {
  try {
    await axiosInstance.post(`${process.env.REACT_APP_API_URL}/updateReadingProgress`, {
      userId,
      bookId,
      lastReadPageId,
      lastReadPassageId,
    });
  } catch (error) {
    console.error('Error updating reading progress:', error);
  }
};