import React, { useRef, useEffect } from 'react';

const TextRenderer = ({ textArray, selectedPassageId, handleTextClick }) => {
  const selectedElementRef = useRef(null);

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
      onClick={() => handleTextClick(obj.hebrew_text, obj.english_text, obj.id, obj.translation_id)}
      dangerouslySetInnerHTML={{ __html: obj.hebrew_text }}
    />
  ));
};

export default TextRenderer;