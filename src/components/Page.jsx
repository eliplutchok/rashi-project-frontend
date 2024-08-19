import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import '../css/Page.css';
import HeaderNavigation from './HeaderNavigation';
import TextRenderer from './TextRenderer';
import TranslationFooter from './TranslationFooter';
import EditModal from './EditModal';
import RateModal from './RateModal';
import { updateReadingProgress } from '../utils/readingProgress';
import useBookInfo from '../hooks/useBookInfo';
import authService from '../utils/authService';

const Page = () => {
  const { book, page } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [version, setVersion] = useState(new URLSearchParams(location.search).get('version') || 'published');
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
  const [bookId, setBookId] = useState(null);
  const [pageId, setPageId] = useState(null);
  const [userId, setUserId] = useState(null);
  const bookInfo = useBookInfo(book);

  useEffect(() => {
    // Fetch the user ID when the component mounts
    const fetchUserId = () => {
      const id = authService.getUserId(); // Retrieve the user ID from authService
      setUserId(id);
    };
    
    fetchUserId();
  }, []);

  useEffect(() => {
    const passageIdFromURL = new URLSearchParams(location.search).get('passageId');
    if (passageIdFromURL) {
      setSelectedPassageId(parseInt(passageIdFromURL));
    }

    // const versionNameFromURL = new URLSearchParams(location.search).get('version');
    // if (versionNameFromURL) {
    //   console.log('Version name from URL:', versionNameFromURL);
    //   setVersion(versionNameFromURL);
    // }


    const fetchTexts = async () => {
      console.log('Fetching texts...');
      console.log('Book:', book);
      console.log('Page:', page);
      console.log('Version:', version);
      try {
        const [talmudResponse, rashiResponse] = await Promise.all([
          axiosInstance.get(`${process.env.REACT_APP_API_URL}/page`, { params: { book, page, translation_version: 'published' } }),
          axiosInstance.get(`${process.env.REACT_APP_API_URL}/page`, { params: { book: `Rashi_on_${book}`, page, translation_version: version } }),
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
          } else {
            const selectedRashiPassage = rashiData.find(passage => passage.id === parseInt(passageIdFromURL));
            if (selectedRashiPassage) {
              handleTextClick(selectedRashiPassage.hebrew_text, selectedRashiPassage.english_text, selectedRashiPassage.id, selectedRashiPassage.translation_id);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching texts:', error);
      }
    };

    fetchTexts();
  }, [book, page, location]);

  useEffect(() => {
    const currentBookId = bookInfo ? bookInfo.book_id : null;
    let currentPageId = null;
    if (rashiText.length > 0) {
      currentPageId = rashiText[0].page_id;
    } else if (talmudText.length > 0) {
      currentPageId = talmudText[0].page_id;
    }
    setBookId(currentBookId);
    setPageId(currentPageId);
    if (currentBookId && currentPageId) {
      updateReadingProgress(userId, currentBookId, currentPageId, selectedPassageId || null);
    }
  }, [bookInfo, rashiText, talmudText, selectedPassageId, userId]);

  const handleTextClick = (text, translation, passageId, translationId) => {
    setSelectedText(text);
    setSelectedTranslation(translation);
    setSelectedPassageId(passageId);
    setSelectedTranslationId(translationId);

    // Update reading progress when a passage is selected
    if (bookId && pageId) {
      updateReadingProgress(userId, bookId, pageId, passageId);
    }
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
      if (rashiText.length > 0 && selectedPassageId === null) {
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

  const handleNextPage = async () => {
    const nextPage = getNextPage(page);
    setSelectedPassageId(null);
    if (nextPage) {
      navigate(`/page/${book}/${nextPage}`);
    }
  };

  const handlePreviousPage = async () => {
    const previousPage = getPreviousPage(page);
    if (previousPage) {
      navigate(`/page/${book}/${previousPage}`);
    }
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