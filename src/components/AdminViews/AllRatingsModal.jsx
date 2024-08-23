import React, {useContext} from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { removeRashiPrefix } from '../../utils/adminUtils';

const AllRatingsModal = ({ expandedRating, handleCloseModal, handleIndividualAction }) => (
  <div className="modal">
    <div className="modal-content">
      <button className="close-button" onClick={handleCloseModal}>✖</button>
      <div className="modal-details">
        <div className="detail-row">
          <span className="detail-title">Username</span>
          <span className="detail-value">{expandedRating.username}</span>
        </div>
        <div className="detail-row">
          <span className="detail-title">Passage</span>
          <span className="detail-value">{expandedRating.hebrew_text}</span>
        </div>
        <div className="detail-row">
          <span className="detail-title">Translation</span>
          <span className="detail-value">{expandedRating.text}</span>
        </div>
        <div className="detail-row">
          <span className="detail-title">Translation Status</span>
          <span className="detail-value">{expandedRating.translation_status}</span>
        </div>
        <div className="detail-row">
          <span className="detail-title">Rating</span>
          <span className="detail-value">{expandedRating.rating}</span>
        </div>
        <div className="detail-row">
          <span className="detail-title">Feedback</span>
          <span className="detail-value">{expandedRating.feedback}</span>
        </div>
        <div className="detail-row">
          <span className="detail-title">Creation Date</span>
          <span className="detail-value">{new Date(expandedRating.creation_date).toLocaleString()}</span>
        </div>
        <div className="detail-row">
          <span className="detail-title">Status</span>
          <span className="detail-value">{expandedRating.status}</span>
        </div>
      </div>
      <div className="button-group">
        <button onClick={() => handleIndividualAction('view', expandedRating.rating_id)}>Mark as Viewed</button>
        <button onClick={() => handleIndividualAction('dismiss', expandedRating.rating_id)}>Dismiss</button>
      </div>
      <a
        href={`/page/${removeRashiPrefix(expandedRating.book_name)}/${expandedRating.page_number}?passageId=${expandedRating.passage_id}`}
        className="page-link"
      >
        Go to Passage
      </a>
    </div>
  </div>
);

export default AllRatingsModal;