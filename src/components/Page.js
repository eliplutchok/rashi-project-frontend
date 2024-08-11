import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from './axiosInstance';
import '../css/Page.css';

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
  const [rating, setRating] = useState(3);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const passageIdFromURL = new URLSearchParams(location.search).get('passageId');
    console.log('passageIdFromURL', passageIdFromURL);
    if (passageIdFromURL) {
        setSelectedPassageId(parseInt(passageIdFromURL));
    }

    const fetchTalmud = async () => {
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/page`, { params: { book, page } });
        const data = response.data;
        setTalmudText(data);
        if (passageIdFromURL) {
          const selectedPassage = data.find(passage => passage.id === parseInt(passageIdFromURL));
          if (selectedPassage) {
            handleTextClick(selectedPassage.hebrew_text, selectedPassage.english_text, selectedPassage.id, selectedPassage.translation_id);
          }
        }
      } catch (error) {
        console.error('Error fetching Talmud text:', error);
      }
    };

    const formatRashiText = (text) => {
      let textCopy = text;
      if (textCopy.includes('–')) {
          textCopy = textCopy.replace(/–([^:]*):/g, '.<span class="not-rashi-header">$1</span>:');
      } else {
          textCopy = textCopy.replace(/-([^:]*):/g, '.<span class="not-rashi-header">$1</span>:');
      }
      return textCopy;
    };

    const fetchRashi = async () => {
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/page`, { params: { book: `Rashi_on_${book}`, page } });
        const data = response.data;
        setRashiText(data.map(passage => ({ ...passage, hebrew_text: formatRashiText(passage.hebrew_text) })));
      } catch (error) {
        console.error('Error fetching Rashi text:', error);
      }
    };

    fetchTalmud();
    fetchRashi();
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
      await axiosInstance.post(`${process.env.REACT_APP_API_URL}/edits`, {
        passage_id: selectedPassageId,
        edited_text: editedTranslation,
        notes: 'User edited translation',
      });
      closeEditModal();
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
      await axiosInstance.post(`${process.env.REACT_APP_API_URL}/ratings`, {
        passage_id: selectedPassageId,
        rating,
        feedback,
        translation_id: selectedTranslationId,
      });
      closeRateModal();
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const renderText = (textArray) => {
    textArray.sort((a, b) => a.passage_number - b.passage_number);
    console.log('textArray', textArray[0]);
    return textArray.map((obj, index) => (
      <span
        key={index}
        className={`text-segment ${selectedPassageId === obj.id ? 'selected' : ''}`}
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
    const nextPage = getNextPage(page);
    if (nextPage) navigate(`/page/${book}/${nextPage}`);
  };

  const handlePreviousPage = () => {
    const previousPage = getPreviousPage(page);
    if (previousPage) navigate(`/page/${book}/${previousPage}`);
  };

  const handleNextTranslation = () => {
    let textToSearch = rashiText
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
    let textToSearch = rashiText
    if (!rashiText.find(passage => passage.id === selectedPassageId)) {
        textToSearch = talmudText;
    }
    const curentPassageNumber = textToSearch.find(passage => passage.id === selectedPassageId).passage_number;
    const previousPassage = textToSearch.find(passage => passage.passage_number === curentPassageNumber - 1);
    if (previousPassage) {
        handleTextClick(previousPassage.hebrew_text, previousPassage.english_text, previousPassage.id, previousPassage.translation_id);
    }
}

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
                <button onClick={openEditModal}>Edit</button>
                <button onClick={openRateModal}>Rate</button>
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
              <h3>Edit Translation</h3>
              <button className="close-button" onClick={closeEditModal}>X</button>
            </div>
            <h3
                dangerouslySetInnerHTML={{ __html: selectedText }}
            />
            <textarea
              value={editedTranslation}
              onChange={(e) => setEditedTranslation(e.target.value)}
            />
            <button onClick={handleEditSubmit}>Submit</button>
          </div>
        </div>
      )}
            {isEditModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Translation</h3>
              <button className="close-button" onClick={closeEditModal}>X</button>
            </div>
            <h3
                dangerouslySetInnerHTML={{ __html: selectedText }}
            />
            <textarea
              value={editedTranslation}
              onChange={(e) => setEditedTranslation(e.target.value)}
            />
            <button onClick={handleEditSubmit}>Submit</button>
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
            <h3
                dangerouslySetInnerHTML={{ __html: selectedText }}
            />
            <div className="rating-container">
              <span className={`rating-option ${rating === 1 ? 'selected' : ''}`} onClick={() => setRating(1)}>1<br />Terrible</span>
              <span className={`rating-option ${rating === 2 ? 'selected' : ''}`} onClick={() => setRating(2)}>2<br />Poor</span>
              <span className={`rating-option ${rating === 3 ? 'selected' : ''}`} onClick={() => setRating(3)}>3<br />Okay</span>
              <span className={`rating-option ${rating === 4 ? 'selected' : ''}`} onClick={() => setRating(4)}>4<br />Good</span>
              <span className={`rating-option ${rating === 5 ? 'selected' : ''}`} onClick={() => setRating(5)}>5<br />Great</span>
            </div>
            <textarea
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