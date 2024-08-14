import React from 'react';

const EditModal = ({ selectedText, editedTranslation, editNotes, setEditedTranslation, setEditNotes, handleEditSubmit, closeEditModal }) => (
  <div className="modal">
    <div className="modal-content">
      <div className="modal-header">
        <h3>Propose New Translation</h3>
        <button className="close-button" onClick={closeEditModal}>✖</button>
      </div>
      <h3 dangerouslySetInnerHTML={{ __html: selectedText }} />
      <div className="edit-translation-header">Edit translation:</div>
      <textarea
        className='edit-translation'
        value={editedTranslation}
        onChange={(e) => setEditedTranslation(e.target.value)}
      />
      <div className="edit-notes-header">Add notes about your edit (optional):</div>
      <textarea
        placeholder="Add notes here..."
        className='edit-notes'
        value={editNotes}
        onChange={(e) => setEditNotes(e.target.value)}
      />
      <button className="modal-submit-button" onClick={handleEditSubmit}>Submit</button>
    </div>
  </div>
);

export default EditModal;