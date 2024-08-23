import React, {useContext} from 'react';
import { ThemeContext } from '../../context/ThemeContext';

import './PageModal.css';
import './PageModal-Dark.css';

const RateModal = ({ selectedText, selectedTranslation, rating, setRating, feedback, setFeedback, handleRateSubmit, closeRateModal }) => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
  <div className={`modal ${isDarkMode ? 'dark-mode' : ''}`}>
    <div className="modal-content">
      <div className="modal-header">
        <h3>Rate Translation</h3>
        <button className="close-button" onClick={closeRateModal}>✖</button>
      </div>
      <div className="text-and-trans-for-rating">
        <div className="hebrew-div" dangerouslySetInnerHTML={{ __html: selectedText }} />
        <div className="translation-div" dangerouslySetInnerHTML={{ __html: selectedTranslation }} />
      </div>
      <div className="rating-container">
        <span className={`rating-option ${rating === 1 ? 'selected' : ''}`} onClick={() => setRating(1)}>1<br />Terrible</span>
        <span className={`rating-option ${rating === 2 ? 'selected' : ''}`} onClick={() => setRating(2)}>2<br />Poor</span>
        <span className={`rating-option ${rating === 3 ? 'selected' : ''}`} onClick={() => setRating(3)}>3<br />Okay</span>
        <span className={`rating-option ${rating === 4 ? 'selected' : ''}`} onClick={() => setRating(4)}>4<br />Good</span>
        <span className={`rating-option ${rating === 5 ? 'selected' : ''}`} onClick={() => setRating(5)}>5<br />Great</span>
      </div>
      <textarea
        className="rate-modal-text-area"
        placeholder="Leave your feedback here..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
      <button onClick={handleRateSubmit}>Submit</button>
    </div>
  </div>
)};

export default RateModal;