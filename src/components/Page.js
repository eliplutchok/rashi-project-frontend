import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import '../css/Page.css';
import HeaderNavigation from './HeaderNavigation';
import TextRenderer from './TextRenderer';
import TranslationFooter from './TranslationFooter';
import EditModal from './EditModal';
import RateModal from './RateModal';

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
    if (!rashiText.find(passage => passage.id === selectedPassageId)) {
      textToSearch = talmudText;
    }
    const currentPassageNumber = textToSearch.find(passage => passage.id === selectedPassageId).passage_number;
    const nextPassage = textToSearch.find(passage => passage.passage_number === currentPassageNumber + 1);
    if (nextPassage) {
      handleTextClick(nextPassage.hebrew_text, nextPassage.english_text, nextPassage.id, nextPassage.translation_id);
    }
  };

  const handlePreviousTranslation = () => {
    let textToSearch = rashiText;
    if (!rashiText.find(passage => passage.id === selectedPassageId)) {
      textToSearch = talmudText;
    }
    const currentPassageNumber = textToSearch.find(passage => passage.id === selectedPassageId).passage_number;
    const previousPassage = textToSearch.find(passage => passage.passage_number === currentPassageNumber - 1);
    if (previousPassage) {
      handleTextClick(previousPassage.hebrew_text, previousPassage.english_text, previousPassage.id, previousPassage.translation_id);
    }
  };

  return (
    <div className="page-container">
      <HeaderNavigation
        page={page}
        handleNextPage={handleNextPage}
        handlePreviousPage={handlePreviousPage}
      />
      <div className="content-and-translation-container">
        <div className="content-container">
          <div className="column talmud">
            <div className="text-container">
              <TextRenderer
                textArray={talmudText}
                selectedPassageId={selectedPassageId}
                handleTextClick={handleTextClick}
              />
            </div>
          </div>
          <div className="column rashi">
            <div className="text-container">
              <TextRenderer
                textArray={rashiText}
                selectedPassageId={selectedPassageId}
                handleTextClick={handleTextClick}
              />
            </div>
          </div>
        </div>
        <TranslationFooter
          selectedText={selectedText}
          selectedTranslation={selectedTranslation}
          openEditModal={openEditModal}
          openRateModal={openRateModal}
          handleNextTranslation={handleNextTranslation}
          handlePreviousTranslation={handlePreviousTranslation}
        />
      </div>
      {isEditModalOpen && (
        <EditModal
          selectedText={selectedText}
          editedTranslation={editedTranslation}
          editNotes={editNotes}
          setEditedTranslation={setEditedTranslation}
          setEditNotes={setEditNotes}
          handleEditSubmit={handleEditSubmit}
          closeEditModal={closeEditModal}
        />
      )}
      {isRateModalOpen && (
        <RateModal
          selectedText={selectedText}
          selectedTranslation={selectedTranslation}
          rating={rating}
          setRating={setRating}
          feedback={feedback}
          setFeedback={setFeedback}
          handleRateSubmit={handleRateSubmit}
          closeRateModal={closeRateModal}
        />
      )}
    </div>
  );
};

export default Page;