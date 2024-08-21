import axiosInstance from './axiosInstance';

export const formatRashiText = (text) => {
  let textCopy = text;
  if (textCopy.includes('–')) {
    textCopy = textCopy.replace(/–([^:]*):/g, '.<span class="not-rashi-header">$1</span>:');
  } else {
    textCopy = textCopy.replace(/-([^:]*):/g, '.<span class="not-rashi-header">$1</span>:');
  }
  return textCopy;
};


export const fetchTexts = async ({
  book,
  page,
  version,
  setTalmudText,
  setRashiText,
  setLoading,
  loadingTimeoutRef,
  abortControllerRef,
  debounceTimerRef,
  passageIdFromURL,
  setSelectedText,
  setSelectedTranslation,
  setSelectedPassageId
}) => {
  if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);

  loadingTimeoutRef.current = setTimeout(() => setLoading(true), 1000);

  if (abortControllerRef.current) abortControllerRef.current.abort();
  const controller = new AbortController();
  abortControllerRef.current = controller;

  try {
    const [talmudResponse, rashiResponse] = await Promise.all([
      axiosInstance.get(`${process.env.REACT_APP_API_URL}/page`, {
        params: { book, page, translation_version: 'published' },
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

    setTalmudText(talmudResponse.data);
    setRashiText(rashiData);

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
    } else {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => setLoading(false), 500);
    }
  }
};