import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TextRendererTHD = ({ textArray, selectedPassageId, handleTextClick, jsonPassages }) => {
  const selectedElementRef = useRef(null);
  const location = useLocation();

  const removeNekudot = (text) => {
    // This regex pattern matches all Hebrew diacritical marks (nekudot and cantillation marks)
    return text.replace(/[\u0591-\u05C7]/g, '');
  };

  const removeNekudotAndHTML = (text) => {
    // Remove HTML tags and Hebrew diacritical marks (nekudot and cantillation marks)
    return text.replace(/<[^>]*>/g, '').replace(/[\u0591-\u05C7]/g, '');
  };

  const removeNonHebrewAndSpaces = (text) => {
    // This regex matches any character that is not a Hebrew letter or a space
    return text.replace(/[^ \u05D0-\u05EA]/g, '');
  };
  
  // Example usage:
  const cleanedText = removeNonHebrewAndSpaces("שָׁלוֹם! This is a test: שָׁלוֹם, 123.");
  console.log(cleanedText); // Output: "שלום שלום"

  // Function to handle scrolling
  const scrollToElement = (element) => {
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const extractWords = (array, textKey) => {
    return array.reduce((acc, obj) => {
      const cleanedText = obj[textKey].trim().replace(/\s+/g, ' ');
      return acc.concat(cleanedText.split(' '));
    }, []);
  };

  const findFirstDifference = (array1, array2) => {
    const minLength = Math.min(array1.length, array2.length);
    
    for (let i = 0; i < minLength; i++) {
      if (array1[i] !== array2[i]) {
        return { index: i, word1: array1[i], word2: array2[i] };
      }
    }
    
    if (array1.length !== array2.length) {
      return { 
        index: minLength, 
        word1: array1[minLength] || 'End of array1', 
        word2: array2[minLength] || 'End of array2' 
      };
    }
    
    return null; // No difference found
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

  
  const cleanTextArray = textArray.map((obj) => {
    return {
      ...obj,
      hebrew_text: removeNonHebrewAndSpaces(obj.hebrew_text),
    };
  });
  const cleanJsonPassages = jsonPassages.map((obj) => {
    return {
      ...obj,
      text: removeNonHebrewAndSpaces(obj.text),
    };
  });
  console.log('text array', textArray);
  console.log('cleanTextArray', cleanTextArray);
  console.log('cleanjsonPassages', jsonPassages);
  console.log('cleanjsonPassages', cleanJsonPassages);

  const allWordsTextArray = extractWords(cleanTextArray, 'hebrew_text');
  const allWordsJsonPassages = extractWords(cleanJsonPassages, 'text');

  const firstDifference = findFirstDifference(allWordsTextArray, allWordsJsonPassages);
  console.log('firstDifference', firstDifference);
  console.log('allWordsTextArray', allWordsTextArray);
  console.log('allWordsJsonPassages', allWordsJsonPassages);

  return jsonPassages.map((line, index) => (
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
        display: 'flex', // Use Flexbox
        justifyContent: 'space-between', // Distribute space between words
        alignItems: 'center', // Align items to center vertically
        paddingBottom: index === jsonPassages.length - 1 ? '300px' : '0px', // 100px margin for the last line
      }}
    >
      {line.text.split(' ').map((word, i) => (
        <span key={i} style={{ whiteSpace: 'nowrap' }}>
          {removeNekudot(word)}
        </span>
      ))}
    </span>
  ));

  // return textArray.map((obj, index) => (
  //   <span
  //     key={index}
  //     ref={selectedPassageId === obj.id ? selectedElementRef : null}
  //     className={`fade-in-element text-segment ${selectedPassageId === obj.id ? 'selected' : ''} ${index < 5 ? 'special-rashi-lines' : ''}`}
  //     onClick={() => handleTextClick(obj.hebrew_text, obj.english_text, obj.id, obj.translation_id)}
  //     dangerouslySetInnerHTML={{ __html: removeNekudot(obj.hebrew_text) }}
  //     id={`passage-${obj.id}`}
  //   />
  // ));
};

export default TextRendererTHD;