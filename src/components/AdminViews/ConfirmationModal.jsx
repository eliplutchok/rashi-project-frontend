import React, {useContext} from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import './ConfirmationModal.css';
import './ConfirmationModal-Dark.css';

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {

  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className={`confirmation-modal-overlay ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Confirmation</h2>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-confirm" onClick={onConfirm}>Confirm</button>
          <button className="btn btn-cancel" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;