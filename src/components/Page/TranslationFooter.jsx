import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

import './TranslationFooter.css';
import './TranslationFooter-Dark.css';

const TranslationFooter = ({ selectedText, selectedTranslation, openEditModal, openRateModal, handleNextTranslation, handlePreviousTranslation, isBold }) => {
  const [showButtons, setShowButtons] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);

  const toggleButtons = () => {
    setShowButtons(!showButtons);
  };

  useEffect(() => {
    // Add event listener for keydown events
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        handleNextTranslation();
      } else if (event.key === 'ArrowRight') {
        handlePreviousTranslation(); 
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNextTranslation, handlePreviousTranslation]);

  return (
    selectedText && (
      <div className={`sticky-translation-footer  ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className='sticky-translation-footer-content'>
          <button className="translation-nav-button" onClick={handleNextTranslation}>&#8249;</button>
          <div className="translation-box" onClick={toggleButtons}>
            <p style={{ fontWeight: isBold ? 'bold' : 'normal' }}
            dangerouslySetInnerHTML={{ __html: selectedTranslation }}></p>
            {showButtons && (
              <div className="translation-buttons">
                <button onClick={openEditModal}>Edit</button>
                <button onClick={openRateModal}>Rate</button>
              </div>
            )}
          </div>
          <button className="translation-nav-button" onClick={handlePreviousTranslation}>&#8250;</button>
        </div>
      </div>
    )
  );
};

export default TranslationFooter;