import React from 'react';
import '../css/TranslationFooter.css';

const TranslationFooter = ({ selectedText, selectedTranslation, openEditModal, openRateModal, handleNextTranslation, handlePreviousTranslation }) => (
  selectedText && (
    <div className="sticky-translation-footer">
      <div className='sticky-translation-footer-content'>
        <button className="translation-nav-button" onClick={handleNextTranslation}>&#8249;</button>
        <div className="translation-box">
          <p>{selectedTranslation}</p>
          <div className="translation-buttons">
            <button onClick={openEditModal}>Edit</button>
            <button onClick={openRateModal}>Rate</button>
          </div>
        </div>
        <button className="translation-nav-button" onClick={handlePreviousTranslation}>&#8250;</button>
      </div>
    </div>
  )
);

export default TranslationFooter;