import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TextRenderer = ({ textArray, selectedPassageId, handleTextClick }) => {
  const selectedElementRef = useRef(null);
  const location = useLocation();

  const removeNekudot = (text) => {
    // This regex pattern matches all Hebrew diacritical marks (nekudot and cantillation marks)
    return text.replace(/[\u0591-\u05C7]/g, '');
  };

  // Function to handle scrolling
  const scrollToElement = (element) => {
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useEffect(() => {
    // Scroll to the selected passage when selectedPassageId changes
    if (selectedPassageId && selectedElementRef.current) {
      scrollToElement(selectedElementRef.current);
    }
  }, [selectedPassageId]);

  useEffect(() => {
    const passageIdFromURL = parseInt(new URLSearchParams(location.search).get('passageId'), 10);

    if (textArray.length > 0) {
      textArray.sort((a, b) => a.passage_number - b.passage_number);
      
      if (!passageIdFromURL) {
        // If no passage ID is in the URL, trigger handleTextClick for the first passage
        const firstPassage = textArray[0];
        if (firstPassage) {
          handleTextClick(firstPassage.hebrew_text, firstPassage.english_text, firstPassage.id, firstPassage.translation_id);
        }
      } else {
        // If a passage ID is in the URL, find the corresponding passage
        const selectedPassage = textArray.find((passage) => passage.id === passageIdFromURL);
        if (selectedPassage) {
          // Check if the element is already rendered, and if not, wait for it
          const element = document.getElementById(`passage-${selectedPassage.id}`);
          if (element) {
            scrollToElement(element);
            handleTextClick(selectedPassage.hebrew_text, selectedPassage.english_text, selectedPassage.id, selectedPassage.translation_id);
          } else {
            // Retry after a short delay
            setTimeout(() => {
              const element = document.getElementById(`passage-${selectedPassage.id}`);
              if (element) {
                scrollToElement(element);
                handleTextClick(selectedPassage.hebrew_text, selectedPassage.english_text, selectedPassage.id, selectedPassage.translation_id);
              }
            }, 300);
          }
        }
      }
    }
  }, [textArray]);

  return textArray.map((obj, index) => (
    <span
      key={index}
      ref={selectedPassageId === obj.id ? selectedElementRef : null}
      className={`fade-in-element text-segment ${selectedPassageId === obj.id ? 'selected' : ''}`}
      onClick={() => handleTextClick(obj.hebrew_text, obj.english_text, obj.id, obj.translation_id)}
      dangerouslySetInnerHTML={{ __html: removeNekudot(obj.hebrew_text) }}
      id={`passage-${obj.id}`}
    />
  ));
};

export default TextRenderer;