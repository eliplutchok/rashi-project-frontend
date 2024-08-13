import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from './axiosInstance';
import '../css/Page.css';
// import useWebSocket from './useWebSocket';

const Page = () => {
  const { book, page } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [talmudText, setTalmudText] = useState([]);
  const [rashiText, setRashiText] = useState([]);
  const [selectedText, setSelectedText] = useState(null);
  const [selectedTranslation, setSelectedTranslation] = useState('');
  const [selectedTranslationId, setSelectedTranslationId] = useState(null);
  const [selectedPassageId, setSelectedPassageId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [editedTranslation, setEditedTranslation] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [rating, setRating] = useState(3);
  const [feedback, setFeedback] = useState('');
  const selectedElementRef = useRef(null);

  // useWebSocket((data) => {
  //   // Handle the received message here
  //   console.log('WebSocket message in Page component:', data);
  // });

  useEffect(() => {
    const passageIdFromURL = new URLSearchParams(location.search).get('passageId');
    if (passageIdFromURL) {
      setSelectedPassageId(parseInt(passageIdFromURL));
    }

    const fetchTexts = async () => {
      try {
        const [talmudResponse, rashiResponse] = await Promise.all([
          axiosInstance.get(`${process.env.REACT_APP_API_URL}/page`, { params: { book, page } }),
          axiosInstance.get(`${process.env.REACT_APP_API_URL}/page`, { params: { book: `Rashi_on_${book}`, page } }),
        ]);

        const formatRashiText = (text) => {
          let textCopy = text;
          if (textCopy.includes('–')) {
            textCopy = textCopy.replace(/–([^:]*):/g, '.<span class="not-rashi-header">$1</span>:');
          } else {
            textCopy = textCopy.replace(/-([^:]*):/g, '.<span class="not-rashi-header">$1</span>:');
          }
          return textCopy;
        };

        const rashiData = rashiResponse.data.map(passage => ({ ...passage, hebrew_text: formatRashiText(passage.hebrew_text) }));
        setTalmudText(talmudResponse.data);
        setRashiText(rashiData);

        if (passageIdFromURL) {
          const selectedPassage = talmudResponse.data.find(passage => passage.id === parseInt(passageIdFromURL));
          if (selectedPassage) {
            handleTextClick(selectedPassage.hebrew_text, selectedPassage.english_text, selectedPassage.id, selectedPassage.translation_id);
          }
        }
      } catch (error) {
        console.error('Error fetching texts:', error);
      }
    };

    fetchTexts();
  }, [book, page, location]);

  const handleTextClick = (text, translation, passageId, translationId) => {
    setSelectedText(text);
    setSelectedTranslation(translation);
    setSelectedPassageId(passageId);
    setSelectedTranslationId(translationId);
  };

  const openEditModal = () => {
    setEditedTranslation(selectedTranslation);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleEditSubmit = async () => {
    try {
      closeEditModal();
      await axiosInstance.post(`${process.env.REACT_APP_API_URL}/edits`, {
        passage_id: selectedPassageId,
        edited_text: editedTranslation,
        notes: editNotes,
      });
      
    } catch (error) {
      console.error('Error submitting edit:', error);
    }
  };

  const openRateModal = () => {
    setIsRateModalOpen(true);
  };

  const closeRateModal = () => {
    setIsRateModalOpen(false);
  };

  const handleRateSubmit = async () => {
    try {
      closeRateModal();
      await axiosInstance.post(`${process.env.REACT_APP_API_URL}/ratings`, {
        passage_id: selectedPassageId,
        rating,
        feedback,
        translation_id: selectedTranslationId,
      });
      
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  // setSelectedText rashiText with lowest passage_number
  useEffect(() => {
    const selectInitialText = async () => {
      if (rashiText.length > 0) {
        const lowestPassageNumber = Math.min(...rashiText.map(passage => passage.passage_number));
        const selectedPassage = rashiText.find(passage => passage.passage_number === lowestPassageNumber);
        handleTextClick(selectedPassage.hebrew_text, selectedPassage.english_text, selectedPassage.id, selectedPassage.translation_id);
      }
    };

    selectInitialText();
  }, [rashiText]);

  useEffect(() => {
    if (selectedElementRef.current) {
      selectedElementRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedText]);

  const renderText = (textArray) => {
    textArray.sort((a, b) => a.passage_number - b.passage_number);
    return textArray.map((obj, index) => (
      <span
        key={index}
        ref={selectedPassageId === obj.id ? selectedElementRef : null}
        className={`fade-in-element text-segment ${selectedPassageId === obj.id ? 'selected' : ''}`}
        onClick={() => handleTextClick(obj.hebrew_text, obj.english_text, obj.id, obj.translation_id)}
        dangerouslySetInnerHTML={{ __html: obj.hebrew_text }}
      />
    ));
  };

  const getNextPage = (currentPage) => {
    const match = currentPage.match(/(\d+)([ab])/);
    if (!match) return null;
    let [, num, letter] = match;
    num = parseInt(num, 10);
    return letter === 'a' ? `${num}b` : `${num + 1}a`;
  };

  const getPreviousPage = (currentPage) => {
    const match = currentPage.match(/(\d+)([ab])/);
    if (!match) return null;
    let [, num, letter] = match;
    num = parseInt(num, 10);
    return letter === 'b' ? `${num}a` : num > 2 ? `${num - 1}b` : null;
  };

  const handleNextPage = () => {
    let bookLength = (rashiText && rashiText[0] && rashiText[0].length + 2) || 0;
    let lastPage = bookLength % 2 === 0 ? `${bookLength / 2}b` : `${(bookLength - 1)/2}a`;
    if (page === lastPage) return;
    const nextPage = getNextPage(page);
    if (nextPage) navigate(`/page/${book}/${nextPage}`);
  };

  const handlePreviousPage = () => {
    if (page === '2a') return;
    const previousPage = getPreviousPage(page);
    if (previousPage) navigate(`/page/${book}/${previousPage}`);
  };

  const handleNextTranslation = () => {
    let textToSearch = rashiText;
    // if selected text is not in rashiText, search in talmudText
    if (!rashiText.find(passage => passage.id === selectedPassageId)) {
      textToSearch = talmudText;
    }
    const curentPassageNumber = textToSearch.find(passage => passage.id === selectedPassageId).passage_number;
    const nextPassage = textToSearch.find(passage => passage.passage_number === curentPassageNumber + 1);
    if (nextPassage) {
      handleTextClick(nextPassage.hebrew_text, nextPassage.english_text, nextPassage.id, nextPassage.translation_id);
    }
  };

  const handlePreviousTranslation = () => {
    let textToSearch = rashiText;
    if (!rashiText.find(passage => passage.id === selectedPassageId)) {
      textToSearch = talmudText;
    }
    const curentPassageNumber = textToSearch.find(passage => passage.id === selectedPassageId).passage_number;
    const previousPassage = textToSearch.find(passage => passage.passage_number === curentPassageNumber - 1);
    if (previousPassage) {
      handleTextClick(previousPassage.hebrew_text, previousPassage.english_text, previousPassage.id, previousPassage.translation_id);
    }
  };

  return (
    <div className="page-container">
      <div className="fixed-page-butn">
        <button onClick={handleNextPage}>&#8249;</button>
        <div className="page-butn-div">{page}</div>
        <button onClick={handlePreviousPage}>&#8250;</button>
      </div>
      <div className="content-and-translation-container">
        <div className="content-container">
          <div className="column talmud">
            <div className="text-container">
              {renderText(talmudText)}
            </div>
          </div>
          <div className="column rashi">
            <div className="text-container">
              {renderText(rashiText)}
            </div>
          </div>
        </div>
        {selectedText && (
          <div className="sticky-translation-footer">
            <div className='sticky-translation-footer-content'>
            <button className="translation-nav-button" onClick={handleNextTranslation}>&#8249;</button>
              <div className="translation-box">
                <p>{selectedTranslation}</p>
                <div className="translation-buttons">
                  <button onClick={openEditModal}>Edit</button>
                  <button onClick={openRateModal}>Rate</button>
                </div>
              </div>
              <button className="translation-nav-button" onClick={handlePreviousTranslation}>&#8250;</button>
              
            </div>
          </div>
        )}
      </div>
            {isEditModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Propose New Translation</h3>
              <button className="close-button" onClick={closeEditModal}>✖</button>
            </div>
            <h3
                dangerouslySetInnerHTML={{ __html: selectedText }}
            />
            
            <div className="edit-translation-header">
              Edit translation:
            </div>
            <textarea
              className='edit-translation'
              value={editedTranslation}
              onChange={(e) => setEditedTranslation(e.target.value)}
            />
            <div className="edit-notes-header">
              Add notes about your edit (optional):
            </div>
            <textarea
              placeholder="Add notes here..."
              className='edit-notes'
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
            />
            <button className="modal-submit-button" onClick={handleEditSubmit}>Submit</button>
          </div>
        </div>
      )}
      {isRateModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Rate Translation</h3>
              <button className="close-button" onClick={closeRateModal}>X</button>
            </div>
            <div className="text-and-trans-for-rating">
              <div
                  className="hebrew-div"
                  dangerouslySetInnerHTML={{ __html: selectedText }}
              />
              <div
                  className="translation-div"
                  dangerouslySetInnerHTML={{ __html: selectedTranslation }}
              />
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
      )}
    </div>
  );
};

export default Page;