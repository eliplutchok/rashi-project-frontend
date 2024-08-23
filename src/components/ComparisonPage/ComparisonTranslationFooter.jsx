import React, {useContext} from 'react';
import { ThemeContext } from '../../context/ThemeContext';

import './ComparisonTranslationFooter.css';
import './ComparisonTranslationFooter-Dark.css';

const ComparisonTranslationFooter = ({
  selectedText,
  translationOne,
  translationTwo,
  openRateModal,
  handleNextTranslation,
  handlePreviousTranslation
}) => {

  const { isDarkMode } = useContext(ThemeContext);

  return (
  selectedText && (
    <div className={`comparison-sticky-translation-footer ${isDarkMode ? 'dark-mode' : ''}`} >
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
)};

export default ComparisonTranslationFooter;