import React from 'react';
import './FeedbackModal.css';

const FeedbackModal = ({ isOpen, onClose, onSubmit, comment, setComment, message, placeholder }) => {
    if (!isOpen) return null;

    return (
        <div className="feedback-modal-overlay">
            <div className="feedback-modal-content">
                <h2 className="feedback-modal-header">Feedback</h2>
                <h2 className="feedback-modal-message">{message}</h2>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={placeholder}
                />
                <div className="feedback-modal-actions">
                    <button className="feedback-modal-button cancel" onClick={onClose}>Cancel</button>
                    <button className="feedback-modal-button submit" onClick={onSubmit}>Submit</button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;