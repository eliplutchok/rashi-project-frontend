import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const HeaderNavigation = ({ onHeldDownChange, handlePageForDisplayChange, bookInfo }) => {
  const intervalRef = useRef(null);
  const navigate = useNavigate();
  const { book, page } = useParams();
  const location = useLocation();
  const version = new URLSearchParams(location.search).get('version') || 'published';
  const [isHeldDown, setIsHeldDown] = useState(false);
  const [displayedPage, setDisplayedPage] = useState(page);
  const holdTimeoutRef = useRef(null);

  const getNextPage = (currentPage) => {

    if (!currentPage) return null;
    const match = currentPage.match(/(\d+)([ab])/);
    if (!match) return null;
    let [, num, letter] = match;
    num = parseInt(num, 10);

    const lastPage = bookInfo ? bookInfo.length : 0;

    if (lastPage % 2 === 0) {
      if (num === (lastPage)/2 && letter === 'b') return null;
    } else {
      if (num === (lastPage + 1)/2) return null;
    }
    return letter === 'a' ? `${num}b` : `${num + 1}a`;
  };

  const getPreviousPage = (currentPage) => {
    if (!currentPage) return null;
    const match = currentPage.match(/(\d+)([ab])/);
    if (!match) return null;
    let [, num, letter] = match;
    num = parseInt(num, 10);
    return letter === 'b' ? `${num}a` : num > 2 ? `${num - 1}b` : null;
  };

  const handlePageChange = useCallback((newPage) => {
    if (newPage) {
      navigate(`/page/${book}/${newPage}?version=${version}`);
    }
  }, [book, navigate, version]);

  const startHoldAction = useCallback((getPageFn) => {

    holdTimeoutRef.current = setTimeout(() => {
      onHeldDownChange(true); // Notify parent that the button is held down
      setIsHeldDown(true);
      window.scrollTo(0, 0);
    }, 200); // Set delay to 500ms

    let currentPage = displayedPage;
    let delay = 300; // Initial delay

    const action = () => {
      const newPage = getPageFn(currentPage);
      if (newPage && newPage !== currentPage) {
        setDisplayedPage(newPage); // Update the displayed page
        currentPage = newPage;
        handlePageForDisplayChange(newPage); // Notify parent of the page change
      }
    };

    action(); // Trigger the action immediately

    intervalRef.current = setInterval(() => {
      action();
      delay = 100; // Decrease the delay after the first iteration
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(action, delay);
    }, delay);
  }, [displayedPage, handlePageForDisplayChange]);

  const stopHoldAction = useCallback(() => {
    clearInterval(intervalRef.current);
    clearTimeout(holdTimeoutRef.current); // Clear the timeout if the button is released before 500ms

    if (isHeldDown) {
      onHeldDownChange(false); // Notify parent that the button is no longer held down
    }
    
    handlePageChange(displayedPage); // Navigate to the final page when the button is released
    // window.scrollTo(0, 0);
    setIsHeldDown(false);
  }, [handlePageChange, displayedPage, onHeldDownChange, isHeldDown]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed-page-butn">
      <button
        onMouseDown={() => startHoldAction(getNextPage)}
        onMouseUp={stopHoldAction}
      >
        &#8249;
      </button>
      <div className="page-butn-div">{displayedPage}</div>
      <button
        onMouseDown={() => {
          startHoldAction(getPreviousPage)}
        }
        onMouseUp={stopHoldAction}
      >
        &#8250;
      </button>
    </div>
  );
};

export default HeaderNavigation;
