import React, {useContext} from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { removeRashiPrefix } from '../../utils/adminUtils';

const AllEditsModal = ({ expandedEdit, handleCloseModal, handleIndividualAction }) => (
  <div className="modal">
    <div className="modal-content">
      <button className="close-button" onClick={handleCloseModal}>✖</button>
      <div className="modal-details">
        <div className="detail-row">
          <span className="detail-title">Book</span>
          <span className="detail-value">{expandedEdit.book_name}</span>
        </div>
        <div className="detail-row">
          <span className="detail-title">Page</span>
          <span className="detail-value">{expandedEdit.page_number}</span>
        </div>
        <div className="detail-row">
          <span className="detail-title">Passage</span>
          <span className="detail-value" dangerouslySetInnerHTML={{ __html: expandedEdit.hebrew_text }} />
        </div>
        <div className="detail-row">
          <span className="detail-title">Translation</span>
          <span className="detail-value">{expandedEdit.text}</span>
        </div>
        <div className="detail-row">
          <span className="detail-title">Notes</span>
          <span className="detail-value">{expandedEdit.notes}</span>
        </div>
        <div className="detail-row">
          <span className="detail-title">Creation Date</span>
          <span className="detail-value">{new Date(expandedEdit.creation_date).toLocaleString()}</span>
        </div>
        <div className="detail-row">
          <span className="detail-title">Status</span>
          <span className="detail-value">{expandedEdit.status}</span>
        </div>
        <div className="detail-row">
          <span className="detail-title">Username</span>
          <span className="detail-value">{expandedEdit.username}</span>
        </div>
      </div>
      <div className="button-group">
        <button onClick={() => handleIndividualAction('approve', expandedEdit.translation_id)}>Approve</button>
        <button onClick={() => handleIndividualAction('reject', expandedEdit.translation_id)}>Reject</button>
        <button onClick={() => handleIndividualAction('publish', expandedEdit.translation_id)}>Publish</button>
      </div>
      <a
        href={`/page/${removeRashiPrefix(expandedEdit.book_name)}/${expandedEdit.page_number}?passageId=${expandedEdit.passage_id}`}
        className="page-link"
      >
        Go to Passage
      </a>
    </div>
  </div>
);

export default AllEditsModal;