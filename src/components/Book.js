import '../css/Book.css';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './axiosInstance';

const Book = ({ book, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollTimeout = useRef(null);
  const carouselRef = useRef(null);
  const [jumpPage, setJumpPage] = useState('');
  const [bookInfo, setBookInfo] = useState({});

  useEffect(() => {
    const fetchBookInfo = async () => {
      const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/bookInfo`, { params: { book } });
      const data =  response.data;
      setBookInfo(data);
    }
    fetchBookInfo();
    console.log('fetching book info');
  }, [book]);

  console.log(bookInfo);

  let numPages = bookInfo ? Math.ceil(bookInfo.length / 2) : 0;

  const generatePages = (numPages) => {
    const pages = [];
    const letters = ['a', 'b'];
  
    for (let i = 2; i <= numPages; i++) {
      pages.push(`${i}${letters[0]}`);
      if (i !== numPages || bookInfo.length % 2 === 0) {
        pages.push(`${i}${letters[1]}`);
      }
    }
  
    return pages;
  };

  const pages = generatePages(numPages);
  const navigate = useNavigate();

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 5, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 5, pages.length - 5));
  };

  const handleMouseDown = (direction) => {
    scrollTimeout.current = setInterval(() => {
      direction === 'next' ? handleNext() : handlePrevious();
    }, 100);
  };

  const handleMouseUp = () => {
    clearInterval(scrollTimeout.current);
  };

  const handleScroll = (e) => {
    if (e.deltaY > 0) {
      setCurrentIndex((prevIndex) => Math.min(prevIndex + Math.ceil(e.deltaY / 10), pages.length - 5));
    } else {
      setCurrentIndex((prevIndex) => Math.max(prevIndex - Math.ceil(Math.abs(e.deltaY) / 10), 0));
    }
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('wheel', handleScroll);
      return () => {
        carousel.removeEventListener('wheel', handleScroll);
      };
    }
  });

  const handleJumpChange = (e) => {
    setJumpPage(e.target.value);
  };

  const handleJumpSubmit = (e) => {
    e.preventDefault();
    if (pages.includes(jumpPage)) {
      navigate(`/page/${book}/${jumpPage}`);
    } else {
      alert('Invalid page number');
    }
  };

  return (
    <div className="book-container">
      <button className="back-button" onClick={onBack}>Back</button>
      <h3>{book}</h3>
      <div className="carousel-container">
        <button
          className="carousel-button"
          onMouseDown={() => handleMouseDown('previous')}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          disabled={currentIndex === 0}
        >&lt;</button>
        <div className="carousel" ref={carouselRef}>
          {pages.slice(currentIndex, currentIndex + 5).map((page, index) => (
            <div
              key={index}
              className={`carousel-item ${index === 2 ? 'active' : ''}`}
              onClick={() => navigate(`/page/${book}/${page}`)}
            >
              {page}
            </div>
          ))}
        </div>
        <button
          className="carousel-button"
          onMouseDown={() => handleMouseDown('next')}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          disabled={currentIndex >= pages.length - 5}
        >&gt;</button>
      </div>
      <form onSubmit={handleJumpSubmit} className="jump-form">
        <input
          type="text"
          value={jumpPage}
          onChange={handleJumpChange}
          placeholder="Enter page (e.g., 2a)"
        />
        <button type="submit">Go</button>
      </form>
    </div>
  );
};

export default Book;