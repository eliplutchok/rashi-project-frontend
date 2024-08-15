import '../css/Book.css';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import useBookInfo from '../hooks/useBookInfo';
import { generatePages } from '../utils/bookUtils';
import { fetchReadingProgress } from '../utils/readingProgress';
import authService from '../utils/authService';

const Book = ({ book, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollTimeout = useRef(null);
  const carouselRef = useRef(null);
  const [jumpPage, setJumpPage] = useState('');
  const [loading, setLoading] = useState(true);
  const [continueReadingPage, setContinueReadingPage] = useState('');
  const [continueReadingPassage, setContinueReadingPassage] = useState('');
  const bookInfo = useBookInfo(book);
  const navigate = useNavigate();
  const userId = authService.getUserId();

  useEffect(() => {
    const fetchContinueReading = async () => {
      try {
        const progress = await fetchReadingProgress(userId, bookInfo.book_id);
        if (progress) {
          setContinueReadingPage(progress.page_number);
          setContinueReadingPassage(progress.last_read_passage);
        }
      } catch (error) {
        console.error('Error fetching continue reading progress:', error);
      } finally {
        setLoading(false);
      }
    };

    if (bookInfo) {
      fetchContinueReading();
    }
  }, [bookInfo, userId]);

  const numPages = bookInfo ? Math.ceil(bookInfo.length / 2) : 0;
  const pages = generatePages(numPages, bookInfo.length);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 5, 0));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 5, pages.length - 5));
  }, [pages.length]);

  const handleMouseDown = (direction) => {
    scrollTimeout.current = setInterval(() => {
      direction === 'next' ? handleNext() : handlePrevious();
    }, 100);
  };

  const handleMouseUp = () => {
    clearInterval(scrollTimeout.current);
  };

  const handleScroll = useCallback((e) => {
    if (e.deltaY > 0) {
      setCurrentIndex((prevIndex) => Math.min(prevIndex + Math.ceil(e.deltaY / 10), pages.length - 5));
    } else {
      setCurrentIndex((prevIndex) => Math.max(prevIndex - Math.ceil(Math.abs(e.deltaY) / 10), 0));
    }
  }, [pages.length]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('wheel', handleScroll);
      return () => {
        carousel.removeEventListener('wheel', handleScroll);
      };
    }
  }, [handleScroll]);

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

  const handleContinueReading = () => {
    console.log('continueReadingPage', continueReadingPage);
    console.log('continueReadingPassage', continueReadingPassage);
    if (continueReadingPage) {
      console.log('continueReadingPage', continueReadingPage);
      console.log('continueReadingPassage', continueReadingPassage);
      navigate(`/page/${book}/${continueReadingPage}?passageId=${continueReadingPassage}`);
    }
  };

  return (
    <div className="book-page-wrapper">
      <div className="book-container book-info-container">
        <h4>Book Information</h4>
        <div className="book-info">
          {loading ? <div className="spinner"></div> : bookInfo.description}
        </div>
      </div>
      <div className="book-container page-selector-container">
        <button className="back-button" onClick={onBack}>Back</button>
        <h3>{book}</h3>
        <div className="carousel-container">
          <button
            className="carousel-button"
            onMouseDown={() => handleMouseDown('previous')}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            disabled={currentIndex === 0}
            aria-label="Previous pages"
          >&lt;</button>
          <div className="carousel" ref={carouselRef}>
            {pages.slice(currentIndex, currentIndex + 5).map((page, index) => (
              <div
                key={index}
                className={`carousel-item ${index === 2 ? 'active' : ''}`}
                onClick={() => navigate(`/page/${book}/${page}`)}
                role="button"
                tabIndex={0}
                onKeyPress={() => navigate(`/page/${book}/${page}`)}
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
            aria-label="Next pages"
          >&gt;</button>
        </div>
        <form onSubmit={handleJumpSubmit} className="jump-form">
          <input
            type="text"
            value={jumpPage}
            onChange={handleJumpChange}
            placeholder="Enter page (e.g., 2a)"
            aria-label="Jump to page"
          />
          <button type="submit">Go</button>
        </form>
      </div>
      <div className="book-container continue-reading-container" onClick={handleContinueReading}>
        {loading ? (
          <div className="spinner"></div>
        ) : (
          <div className='continue-reading-text'>
            <h4>Continue Reading</h4>
            <h2>{continueReadingPage}</h2>
          </div>
        )}
      </div>
    </div>
  );
};

Book.propTypes = {
  book: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default Book;