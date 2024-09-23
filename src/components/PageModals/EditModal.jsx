import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import './PageModal.css';
import './PageModal-Dark.css';

const EditModal = ({
  selectedText,
  editedTranslation,
  editNotes,
  setEditedTranslation,
  setEditNotes,
  handleEditSubmit,
  closeEditModal,
}) => {
  const { isDarkMode } = useContext(ThemeContext);

  const modules = {
    toolbar: [
      ['bold', 'italic'], // Include both bold and italic options
    ],
  };
  
  const formats = ['bold', 'italic'];

  return (
    <div className={`modal ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Propose New Translation</h3>
          <button className="close-button" onClick={closeEditModal}>
            ✖
          </button>
        </div>
        <h3 dangerouslySetInnerHTML={{ __html: selectedText }} />
        <div className="edit-translation-header">Edit translation:</div>
        <ReactQuill
          className="edit-translation"
          value={editedTranslation}
          onChange={setEditedTranslation}
          modules={modules}
          formats={formats}
        />
        <div className="edit-notes-header">
          Add notes about your edit (optional):
        </div>
        <textarea
          placeholder="Add notes here..."
          className="edit-notes"
          value={editNotes}
          onChange={(e) => setEditNotes(e.target.value)}
        />
        <button className="modal-submit-button" onClick={handleEditSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default EditModal;