import React from 'react';
import '../css/ComparisonTranslationFooter.css';

const ComparisonTranslationFooter = ({
  selectedText,
  translationOne,
  translationTwo,
  openRateModal,
  handleNextTranslation,
  handlePreviousTranslation
}) => (
  selectedText && (
    <div className="comparison-sticky-translation-footer" >
      <div className='comparison-sticky-translation-footer-content'>
        <button className="comparison-translation-nav-button" onClick={handleNextTranslation}>&#8249;</button>
        <div className="comparison-translation-box" onClick={openRateModal}>
          <div className="comparison-translation-box-content">
            <div className="comparison-translation-item comparison-translation-one">
              <p dangerouslySetInnerHTML={{ __html: translationOne }}></p>
            </div>
            <div className="comparison-translation-item comparison-translation-two">
              <p dangerouslySetInnerHTML={{ __html: translationTwo }}></p>
            </div>
          </div>
        </div>
        <button className="comparison-translation-nav-button" onClick={handlePreviousTranslation}>&#8250;</button>
      </div>
    </div>
  )
);

export default ComparisonTranslationFooter;