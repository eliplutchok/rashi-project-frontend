import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TextRenderer = ({ textArray, selectedPassageId, handleTextClick }) => {
  const selectedElementRef = useRef(null);
  const location = useLocation();


  const removeNekudot = (text) => {
    // This regex pattern matches all Hebrew diacritical marks (nekudot and cantillation marks)
    return text.replace(/[\u0591-\u05C7]/g, '');
  };

  useEffect(() => {
    const passageIdFromURL = parseInt(new URLSearchParams(location.search).get('passageId'), 10);
    
    if (textArray.length > 0 && passageIdFromURL) {
      const selectedPassage = textArray.find(passage => passage.id === passageIdFromURL);
      
      if (selectedPassage) {
        // Use setTimeout to wait for the render to complete
        setTimeout(() => {
          const element = document.getElementById(`passage-${selectedPassage.id}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 0); // The delay can be 0ms as it just queues the callback after rendering
      }
    }
  }, [location, textArray]);

  useEffect(() => {
    if (selectedElementRef.current) {
      setTimeout(() => {
        selectedElementRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300); // Delay scrolling to ensure content is fully loaded
    }
  }, [selectedPassageId, location]);

  textArray.sort((a, b) => a.passage_number - b.passage_number);

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