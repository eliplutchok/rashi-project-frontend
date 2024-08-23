import React, {useContext} from 'react';
import { ThemeContext } from '../../context/ThemeContext';

import './ComparisonPageModal.css';
import './ComparisonPageModal-Dark.css';

const ComparisonRateModal = ({ selectedText, translationOne, translationTwo, rating, setRating, feedback, setFeedback, handleRateSubmit, closeRateModal }) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
  <div className={`comparison-modal ${isDarkMode ? 'dark-mode' : ''}`}>
    <div className="comparison-modal-content">
      <div className="comparison-modal-header">
        <h3>Rate Comparison</h3>
        <button className="comparison-close-button" onClick={closeRateModal}>✖</button>
      </div>
      <div className="comparison-text-and-trans-for-rating">
        <div className="comparison-hebrew-div" dangerouslySetInnerHTML={{ __html: selectedText }} />
        <div className="comparison-translations-div-container">
          <div className="comparison-translation-div">
            <h4>Translation 1</h4>
            <div dangerouslySetInnerHTML={{ __html: translationOne.text }} />
          </div>
          <div className="comparison-translation-div">
            <h4>Translation 2</h4>
            <div dangerouslySetInnerHTML={{ __html: translationTwo.text }} />
          </div>
        </div>
      </div>
      <div className="comparison-rating-container">
        <span className={`comparison-rating-option ${rating === 1 ? 'comparison-selected' : ''}`} onClick={() => setRating(1)}><span className='comparison-rating-number'>1</span><br />1 is much better than 2</span>
        <span className={`comparison-rating-option ${rating === 2 ? 'comparison-selected' : ''}`} onClick={() => setRating(2)}><span className='comparison-rating-number'>2</span><br />1 is better than 2</span>
        <span className={`comparison-rating-option ${rating === 3 ? 'comparison-selected' : ''}`} onClick={() => setRating(3)}><span className='comparison-rating-number'>3</span><br />1 is slightly better than 2</span>
        <span className={`comparison-rating-option ${rating === 4 ? 'comparison-selected' : ''}`} onClick={() => setRating(4)}><span className='comparison-rating-number'>4</span><br />Both are equal</span>
        <span className={`comparison-rating-option ${rating === 5 ? 'comparison-selected' : ''}`} onClick={() => setRating(5)}><span className='comparison-rating-number'>5</span><br />2 is slightly better than 1</span>
        <span className={`comparison-rating-option ${rating === 6 ? 'comparison-selected' : ''}`} onClick={() => setRating(6)}><span className='comparison-rating-number'>6</span><br />2 is better than 1</span>
        <span className={`comparison-rating-option ${rating === 7 ? 'comparison-selected' : ''}`} onClick={() => setRating(7)}><span className='comparison-rating-number'>7</span><br />2 is much better than 1</span>
      </div>
      <textarea
        className="comparison-rate-modal-text-area"
        placeholder="Leave your feedback here..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
      <button className="comparison-modal-submit-button" onClick={handleRateSubmit}>Submit</button>
    </div>
  </div>
)};

export default ComparisonRateModal;