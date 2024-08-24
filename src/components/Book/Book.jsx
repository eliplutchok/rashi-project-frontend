import './Book.css';
import './Book-Dark.css';
import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import useBookInfo from '../../hooks/useBookInfo';
import { generatePages } from '../../utils/bookUtils';
import { fetchReadingProgress } from '../../utils/readingProgress';
import { ThemeContext } from '../../context/ThemeContext';
import authService from '../../utils/authService';

const INITIAL_INDEX = 0;
const SCROLL_INTERVAL_MS = 100;
const PAGES_PER_VIEW = 5;
const DELTA_Y_DIVISOR = 10;
const INITIAL_PAGE = '2a';

const Book = ({ book, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(INITIAL_INDEX);
  const scrollTimeout = useRef(null);
  const carouselRef = useRef(null);
  const [jumpPage, setJumpPage] = useState('');
  const [loading, setLoading] = useState(true);
  const [continueReadingPage, setContinueReadingPage] = useState('');
  const [continueReadingPassage, setContinueReadingPassage] = useState('');
  const bookInfo = useBookInfo(book);

  const { isDarkMode } = useContext(ThemeContext);

  const navigate = useNavigate();
  const userId = authService.getUserId();

  useEffect(() => {
    const fetchContinueReading = async () => {
      try {
        const progress = await fetchReadingProgress(userId, bookInfo.book_id);
        if (progress) {
          setContinueReadingPage(progress.page_number);
          setContinueReadingPassage(progress.last_read_passage);
        } else {
          setContinueReadingPage(INITIAL_PAGE);
          setContinueReadingPassage(null);
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

  const adjustedPages = ['', '', ...pages, '', ''];

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - PAGES_PER_VIEW, INITIAL_INDEX));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + PAGES_PER_VIEW, adjustedPages.length - PAGES_PER_VIEW));
  }, [adjustedPages.length]);

  const handleMouseDown = (direction) => {
    scrollTimeout.current = setInterval(() => {
      direction === 'next' ? handleNext() : handlePrevious();
    }, SCROLL_INTERVAL_MS);
  };

  const handleMouseUp = () => {
    clearInterval(scrollTimeout.current);
  };

  const handleScroll = useCallback((e) => {
    if (e.deltaY > 0) {
      setCurrentIndex((prevIndex) => Math.min(prevIndex + Math.ceil(e.deltaY / DELTA_Y_DIVISOR), adjustedPages.length - PAGES_PER_VIEW));
    } else {
      setCurrentIndex((prevIndex) => Math.max(prevIndex - Math.ceil(Math.abs(e.deltaY) / DELTA_Y_DIVISOR), INITIAL_INDEX));
    }
  }, [adjustedPages.length]);

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
    if (continueReadingPage) {
      navigate(`/page/${book}/${continueReadingPage}?passageId=${continueReadingPassage}`);
    }
  };

  return (
    <div className={`book-page-wrapper-wrapper ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="book-page-wrapper">
        <div className="book-container page-selector-container">
          <button className="back-button" onClick={onBack}>Back</button>
          <div className="page-selector-container-content">
            <h3>{book}</h3>
            <div className="carousel-container">
              <button
                className="carousel-button"
                onMouseDown={() => handleMouseDown('previous')}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                disabled={currentIndex === INITIAL_INDEX}
                aria-label="Previous pages"
              >&#8249;</button>
              <div className="carousel" ref={carouselRef}>
                {adjustedPages.slice(currentIndex, currentIndex + PAGES_PER_VIEW).map((page, index) => (
                  <div
                    key={index}
                    className={`carousel-item ${index === 2 ? 'active' : ''}`}
                    onClick={() => page && navigate(`/page/${book}/${page}`)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={() => page && navigate(`/page/${book}/${page}`)}
                  >
                    {page || '\u00A0'} {/* Use non-breaking space for blanks */}
                  </div>
                ))}
              </div>
              <button
                className="carousel-button"
                onMouseDown={() => handleMouseDown('next')}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                disabled={currentIndex >= adjustedPages.length - PAGES_PER_VIEW}
                aria-label="Next pages"
              >&#8250;</button>
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
        </div>
        <div className="book-container book-info-container">
          <div className="book-info">
            {loading ? <div className="spinner"></div> : bookInfo.description}
          </div>
        </div>
        <div className="book-container continue-reading-container" onClick={handleContinueReading}>
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <div className='continue-reading-text'>
              <h4>{continueReadingPage === INITIAL_PAGE && !continueReadingPassage ? 'Start Reading' : 'Continue Reading'}</h4>
              <h2>{continueReadingPage}</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Book.propTypes = {
  book: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default Book;