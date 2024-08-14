import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import '../css/Page.css';
import HeaderNavigation from './HeaderNavigation';
import ComparisonPageTextRenderer from './ComparisonPageTextRenderer';
import ComparisonTranslationFooter from './ComparisonTranslationFooter';
import ComparisonRateModal from './ComparisonRateModal';

// http://localhost:3000/comparisonPage/Megillah/3a?version1=gpt-4o-naive&version2=claude-opus-naive

const ComparisonPage = () => {
  const { book, page } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const version1 = searchParams.get('version1');
  const version2 = searchParams.get('version2');

  const [passages, setPassages] = useState([]);
  const [talmudText, setTalmudText] = useState([]);
  const [rashiText, setRashiText] = useState([]);
  const [selectedText, setSelectedText] = useState(null);
  const [translationOne, setTranslationOne] = useState({});
  const [translationTwo, setTranslationTwo] = useState({});
  const [selectedPassageId, setSelectedPassageId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [editedTranslation, setEditedTranslation] = useState('');
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
          axiosInstance.get(`${process.env.REACT_APP_API_URL}/comparisonPage`, { params: { book, page } }),
          axiosInstance.get(`${process.env.REACT_APP_API_URL}/comparisonPage`, { params: { book: `Rashi_on_${book}`, page } }),
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
        setPassages([...talmudResponse.data, ...rashiData]);

        if (passageIdFromURL) {
          const selectedPassage = talmudResponse.data.find(passage => passage.id === parseInt(passageIdFromURL));
          if (selectedPassage) {
            handleTextClick(selectedPassage.hebrew_text, selectedPassage.translations, selectedPassage.id);
          }
        } else {
          selectInitialText(talmudResponse.data, rashiData);
        }
      } catch (error) {
        console.error('Error fetching texts:', error);
      }
    };

    fetchTexts();
  }, [book, page, location]);

  const selectInitialText = (talmudData, rashiData) => {
    if (talmudData.length > 0) {
      const lowestPassageNumberTalmud = Math.min(...talmudData.map(passage => passage.passage_number));
      const selectedTalmudPassage = talmudData.find(passage => passage.passage_number === lowestPassageNumberTalmud);
      handleTextClick(selectedTalmudPassage.hebrew_text, selectedTalmudPassage.translations, selectedTalmudPassage.id);
    }
    if (rashiData.length > 0) {
      const lowestPassageNumberRashi = Math.min(...rashiData.map(passage => passage.passage_number));
      const selectedRashiPassage = rashiData.find(passage => passage.passage_number === lowestPassageNumberRashi);
      handleTextClick(selectedRashiPassage.hebrew_text, selectedRashiPassage.translations, selectedRashiPassage.id);
    }
  };

  const handleTextClick = (text, translations, passageId) => {
    setSelectedText(text);
    setSelectedPassageId(passageId);
    const translationOne = translations.find(translation => translation.version_name === version1);
    const translationTwo = translations.find(translation => translation.version_name === version2);
    setTranslationOne(translationOne ? translationOne : {});
    setTranslationTwo(translationTwo ? translationTwo : {});
  };

  const openEditModal = () => {
    setEditedTranslation(translationOne.text || '');
    setIsEditModalOpen(true);
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

      await axiosInstance.post(`${process.env.REACT_APP_API_URL}/comparisons`, {
        translation_one_id: translationOne.translation_id, // Ensure the translationOne and translationTwo contain the necessary IDs
        translation_two_id: translationTwo.translation_id,
        rating,
        version_name: "default", // Or whichever version name is relevant
        status: 'completed', // Assuming you have a status to set
        notes: feedback,
      });
      setFeedback('');
    } catch (error) {
      console.error('Error submitting comparison:', error);
    }
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
    let bookLength = (talmudText && talmudText[0] && talmudText[0].length + 2) || 0;
    let lastPage = bookLength % 2 === 0 ? `${bookLength / 2}b` : `${(bookLength - 1) / 2}a`;
    if (page === lastPage) return;
    const nextPage = getNextPage(page);
    // http://localhost:3000/comparisonPage/Megillah/3a?version1=gpt-4o-naive&version2=claude-opus-naive
    if (nextPage) navigate(`/comparisonPage/${book}/${nextPage}?version1=${version1}&version2=${version2}`);
  };

  const handlePreviousPage = () => {
    if (page === '2a') return;
    const previousPage = getPreviousPage(page);
    if (previousPage) navigate(`/comparisonPage/${book}/${previousPage}?version1=${version1}&version2=${version2}`);
  };

  const handleNextTranslation = () => {
    let textToSearch = rashiText;
    if (!rashiText.find(passage => passage.id === selectedPassageId)) {
      textToSearch = talmudText;
    }
    const currentPassageNumber = textToSearch.find(passage => passage.id === selectedPassageId).passage_number;
    const nextPassage = textToSearch.find(passage => passage.passage_number === currentPassageNumber + 1);
    if (nextPassage) {
      handleTextClick(nextPassage.hebrew_text, nextPassage.translations, nextPassage.id);
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
      handleTextClick(previousPassage.hebrew_text, previousPassage.translations, previousPassage.id);
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
              <ComparisonPageTextRenderer
                textArray={talmudText}
                selectedPassageId={selectedPassageId}
                handleTextClick={handleTextClick}
              />
            </div>
          </div>
          <div className="column rashi">
            <div className="text-container">
            <ComparisonPageTextRenderer
                textArray={rashiText}
                selectedPassageId={selectedPassageId}
                handleTextClick={handleTextClick}
              />
            </div>
          </div>
        </div>
        <ComparisonTranslationFooter
          selectedText={selectedText}
          translationOne={translationOne.text}
          translationTwo={translationTwo.text}
          openEditModal={openEditModal}
          openRateModal={openRateModal}
          handleNextTranslation={handleNextTranslation}
          handlePreviousTranslation={handlePreviousTranslation}
        />
      </div>
      {isRateModalOpen && (
        <ComparisonRateModal
          selectedText={selectedText}
          translationOne={translationOne}
          translationTwo={translationTwo}
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

export default ComparisonPage;