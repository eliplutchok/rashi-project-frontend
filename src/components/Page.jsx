import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
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
import {fetchTexts } from '../utils/pageUtils';

const Page = () => {
  const { book, page } = useParams();
  const location = useLocation();
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
  const [loading, setLoading] = useState(false);
  const [isHeldDown, setIsHeldDown] = useState(false);
  const [pageForDisplay, setpageForDisplay] = useState(null);
  const [shortLoading, setShortLoading] = useState(false);

  const bookInfo = useBookInfo(book);
  const loadingTimeoutRef = useRef(null);

  // AbortController for canceling ongoing requests
  const abortControllerRef = useRef(null);

  const handleHeldDownChange = (heldDown) => {
    setIsHeldDown(heldDown); // Update the isHeldDown state in Page component
  };

  const handlePageForDisplayChange = (page) => {
    setpageForDisplay(page);
  }

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

    fetchTexts({
      book,
      page,
      version,
      setTalmudText,
      setRashiText,
      setLoading,
      setShortLoading,
      loadingTimeoutRef,
      abortControllerRef,
      passageIdFromURL,
      setSelectedText,
      setSelectedTranslation,
      setSelectedPassageId
    });

    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    };
  }, [book, page, location, version]);

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

    const url = new URL(window.location);
    url.searchParams.set('passageId', passageId);
    window.history.pushState({}, '', url);

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
    <div className={`page-container ${loading ? 'loading' : isHeldDown ? 'loading' : ''} ${shortLoading ? 'short-loading' : ''}`}>
      <div className={`loading-overlay ${loading ? 'visible' : ''}`}>
      </div>
      <div className={`pageForDisplay-hidden ${isHeldDown ? 'pageForDisplay' : ''}`}>
          {pageForDisplay && <p>{pageForDisplay}</p>}
        </div>
      <HeaderNavigation
        page={page}
        onHeldDownChange={handleHeldDownChange}
        handlePageForDisplayChange={handlePageForDisplayChange}
        bookInfo={bookInfo}
      />
      <div className="content-and-translation-container">
        <div className="content-container">
          <div className="column talmud">
            <div className={`text-container ${shortLoading ? 'short-loading' : ''}`}>
              <TextRenderer
                textArray={talmudText}
                selectedPassageId={selectedPassageId}
                handleTextClick={handleTextClick}
              />
            </div>
          </div>
          <div className="column rashi">
            <div className={`text-container ${shortLoading ? 'short-loading' : ''}`}>
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
          // set isBold if its rashi
          isBold={rashiText.find(passage => passage.id === selectedPassageId)}
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