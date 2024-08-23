import React, {useContext} from 'react';
// import '../css/ComparisonPageModal.css';
import { removeRashiPrefix } from '../../utils/adminUtils';
import { ThemeContext } from '../../context/ThemeContext';

const AllComparisonsModal = ({ expandedComparison, handleCloseModal, handleIndividualAction }) => (
  <div className="modal">
    <div className="modal-content">
      <button className="close-button" onClick={handleCloseModal}>✖</button>
      <div className="modal-details">
        <div className="detail-row">
          <span className="detail-title">Book</span>
          <span className="detail-value">{expandedComparison.book_name}</span>
        </div>
        <div className="detail-row">
          <span className="detail-title">Page</span>
          <span className="detail-value">{expandedComparison.page_number}</span>
        </div>
        <div className="detail-row">
          <span className="detail-title">Hebrew Text</span>
          <span className="detail-value" dangerouslySetInnerHTML={{ __html: expandedComparison.hebrew_text }} />
        </div>
        <div className="detail-row">
          <span className="detail-title">Translation One</span>
          <span className="detail-value">{expandedComparison.translation_one_text}</span>
        </div>
        <div className="detail-row">
          <span className="detail-title">Translation Two</span>
          <span className="detail-value">{expandedComparison.translation_two_text}</span>
        </div>
        <div className="detail-row">
          <span className="detail-title">Rating</span>
          <span className="detail-value">{expandedComparison.rating}</span>
        </div>
        <div className="detail-row">
          <span className="detail-title">Notes</span>
          <span className="detail-value">{expandedComparison.notes}</span>
        </div>
        <div className="detail-row">
          <span className="detail-title">Version Name</span>
          <span className="detail-value">{expandedComparison.version_name}</span>
        </div>
        <div className="detail-row">
          <span className="detail-title">Status</span>
          <span className="detail-value">{expandedComparison.status}</span>
        </div>
      </div>
      <div className="button-group">
        <button onClick={() => handleIndividualAction('approve', expandedComparison.comparison_id)}>Approve</button>
        <button onClick={() => handleIndividualAction('reject', expandedComparison.comparison_id)}>Reject</button>
      </div>
      <a
        href={`/comparisonPage/${removeRashiPrefix(expandedComparison.book_name)}/${expandedComparison.page_number}?version1=${expandedComparison.translation_one_version_name}&version2=${expandedComparison.translation_two_version_name}`}
        className="page-link"
      >
        Go to Passage
      </a>
    </div>
  </div>
);

export default AllComparisonsModal;