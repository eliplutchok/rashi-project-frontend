import React, { useRef, useEffect } from 'react';

const ComparisonPageTextRenderer = ({ textArray, selectedPassageId, handleTextClick }) => {
  const selectedElementRef = useRef(null);

  const removeNekudot = (text) => {
    // This regex pattern matches all Hebrew diacritical marks (nekudot and cantillation marks)
    return text.replace(/[\u0591-\u05C7]/g, '');

  };

  useEffect(() => {
    if (selectedElementRef.current) {
      selectedElementRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedPassageId]);

  textArray.sort((a, b) => a.passage_number - b.passage_number);

  return textArray.map((obj, index) => (
    <span
      key={index}
      ref={selectedPassageId === obj.id ? selectedElementRef : null}
      className={`fade-in-element text-segment ${selectedPassageId === obj.id ? 'selected' : ''}`}
      onClick={() => handleTextClick(obj.hebrew_text, obj.translations, obj.id)}
      dangerouslySetInnerHTML={{ __html: removeNekudot(obj.hebrew_text) }}
    />
  ));
};

export default ComparisonPageTextRenderer;