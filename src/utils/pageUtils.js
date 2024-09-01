import axiosInstance from './axiosInstance';

export const formatRashiText = (text) => {
    let formattedText;
    // Find the first occurrence of a dash and split the text into header and body
    if (text.includes('–')) {
        const splitText = text.split('–', 2);
        const header = splitText[0];
        const body = splitText[1] ? splitText[1] : '';
    
        // Wrap the header in the rashi-header class
        const formattedHeader = `<span class="rashi-header">${header}.</span>`;
    
        // Combine the formatted header with the body of the text
        formattedText = `${formattedHeader} ${body}`;
    } else {
        const splitText = text.split('-', 2);
        const header = splitText[0];
        const body = splitText[1] ? splitText[1] : '';
    
        // Wrap the header in the rashi-header class
        const formattedHeader = `<span class="rashi-header">${header}.</span>`;
    
        // Combine the formatted header with the body of the text
        formattedText = `${formattedHeader} ${body}`;
    }
    // Return the fully formatted text
    return formattedText;
  };

  export const formatRashiTextByWords = (jsonDataRashi) => {
    let insideHeader = false; // A flag to know if we are inside a header
    let formattedRashiData = [];
  
    jsonDataRashi.forEach((passage, passageIndex) => {
      let words = passage.text.split(' ');
      let formattedWords = words.map((word, wordIndex) => {
        if (word.includes('׃')) {
          // If we encounter a colon, the header starts right after this word
          insideHeader = true;
        }
  
        if (insideHeader) {
          word = `<span class="rashi-header">${word}</span>`;
        }
  
        if (word.includes('.')) {
          // If we encounter a period, the header ends with this word
          insideHeader = false;
        }
  
        return word;
      });
  
      formattedRashiData.push({
        ...passage,
        text: formattedWords.join(' ') // Join the words back into a line
      });
    });
  
    return formattedRashiData;
  };


export const fetchTexts = async ({
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
}) => {
  setShortLoading(true);
  if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);

  loadingTimeoutRef.current = setTimeout(() => setLoading(true), 1000);

  if (abortControllerRef.current) abortControllerRef.current.abort();
  const controller = new AbortController();
  abortControllerRef.current = controller;

  try {
    const [talmudResponse, rashiResponse] = await Promise.all([
      axiosInstance.get(`${process.env.REACT_APP_API_URL}/page`, {
        params: { book, page, translation_version: "Sefaria-William-Davidson" },
        signal: controller.signal,
      }),
      axiosInstance.get(`${process.env.REACT_APP_API_URL}/page`, {
        params: { book: `Rashi_on_${book}`, page, translation_version: version },
        signal: controller.signal,
      }),
    ]);

    const rashiData = rashiResponse.data.map(passage => ({
      ...passage,
      hebrew_text: formatRashiText(passage.hebrew_text),
    }));

    // remove duplicates from rashiData
    const rashiDataIds = rashiData.map(passage => passage.id);
    const uniqueRashiData = rashiData.filter((passage, index) => rashiDataIds.indexOf(passage.id) === index);


    setTalmudText(talmudResponse.data);
    setRashiText(uniqueRashiData);

    

    if (passageIdFromURL) {
      const selectedPassage = talmudResponse.data.find(passage => passage.id === parseInt(passageIdFromURL)) ||
        rashiData.find(passage => passage.id === parseInt(passageIdFromURL));
        
      if (selectedPassage) {
        setSelectedText(selectedPassage.hebrew_text);
        setSelectedTranslation(selectedPassage.english_text);
        setSelectedPassageId(selectedPassage.id);
      }
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Error fetching texts:', error);
    }
  } finally {
    // Clear the loading timeout and reset it to false only if it was not set to true
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
      setLoading(false);
    }
    setShortLoading(false);
  }
};