import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TextRendererTHD = ({ textArray, selectedPassageId, handleTextClick, jsonPassages, renderToDBMapping, textType }) => {
  const selectedElementRef = useRef(null);
  const location = useLocation();

  const removeNekudot = (text) => {
    return text.replace(/[\u0591-\u05C7]/g, '');
  };

  const scrollToElement = (element) => {
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleTextClickTemp = (id) => {
    let obj = textArray.find((obj) => obj.id === id);
    handleTextClick(obj.hebrew_text, obj.english_text, obj.id, obj.translation_id);
  };

  useEffect(() => {
    if (selectedPassageId && selectedElementRef.current) {
      scrollToElement(selectedElementRef.current);
    }
  }, [selectedPassageId]);

  useEffect(() => {
    const passageIdFromURL = parseInt(new URLSearchParams(location.search).get('passageId'), 10);

    if (textArray.length > 0) {
      textArray.sort((a, b) => a.passage_number - b.passage_number);

      if (!passageIdFromURL) {
        const firstPassage = textArray[0];
        if (firstPassage) {
          handleTextClick(firstPassage.hebrew_text, firstPassage.english_text, firstPassage.id, firstPassage.translation_id);
        }
      } else {
        const selectedPassage = textArray.find((passage) => passage.id === passageIdFromURL);
        if (selectedPassage) {
          const element = document.getElementById(`passage-${selectedPassage.id}`);
          if (element) {
            scrollToElement(element);
            handleTextClick(selectedPassage.hebrew_text, selectedPassage.english_text, selectedPassage.id, selectedPassage.translation_id);
          } else {
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

  let wordIndex = 0;
  let isHeader = false;

  return jsonPassages.map((line, index) => {
    return (
      <span
        key={index}
        className={`fade-in-element text-segment`}
        style={{
          marginTop: '70px',
          marginLeft: '300px',
          display: 'block',
          width: line.styles.width,
          position: 'absolute',
          top: line.styles.top,
          left: line.styles.left,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: index === jsonPassages.length - 1 ? '300px' : '0px',
        }}
      >
        {line.text.split(' ').map((word, i) => {
          const curPassageId = renderToDBMapping[wordIndex]?.passageId;

          // Identify header words based on the context (e.g., after colons or periods)
          let isCurWordHeader = isHeader
          if (word.includes('׃')) {
            isHeader = true;
          } else if (word.includes('.')) {
            isHeader = false;
          }

          wordIndex += 1;

          if (textType !== 'rashi') {
            isCurWordHeader = false;
          }

          return (
            <span
              key={i}
              style={{ whiteSpace: 'nowrap', fontWeight: isCurWordHeader ? 'bold' : 'normal' }} // Apply bold styling to header words
              ref={selectedPassageId === curPassageId ? selectedElementRef : null}
              className={`${selectedPassageId === curPassageId ? 'selected-word' : ''}`}
              onClick={() => handleTextClickTemp(curPassageId)}
              id={`passage-${curPassageId}`}
              dangerouslySetInnerHTML={{ __html: word }}
            />
          );
        })}
      </span>
    );
  });
};

export default TextRendererTHD;