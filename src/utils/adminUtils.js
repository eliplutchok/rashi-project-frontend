export const removeRashiPrefix = (bookName) => {
    if (bookName.startsWith("Rashi_on_")) {
      return bookName.replace("Rashi_on_", "");
    }
    return bookName;
  };
  
  export const generateEditsCSV = (edits) => {
    const csvContent = [
      ['book_name', 'page_number', 'hebrew_text', 'text', 'notes', 'creation_date', 'status', 'username', 'translation_id'],
      ...edits.map(edit => [
        edit.book_name,
        edit.page_number,
        edit.hebrew_text,
        edit.text,
        edit.notes,
        new Date(edit.creation_date).toLocaleString(),
        edit.status,
        edit.username,
        edit.translation_id
      ].map(field => `"${String(field).replace(/"/g, '""')}"`)) // Wrap each field in double quotes and escape existing double quotes
    ]
      .map(e => e.join(','))
      .join('\n');
  
    return csvContent;
  };

  export const generateRatingsCSV = (ratings) => {
    const csvContent = [
      ['Username', 'Translation', 'Rating', 'Feedback', 'Creation Date', 'Status'],
      ...ratings.map(rating => [
        rating.username,
        rating.text,
        rating.rating,
        rating.feedback,
        new Date(rating.creation_date).toLocaleString(),
        rating.status
      ].map(field => `"${String(field).replace(/"/g, '""')}"`)) // Wrap each field in double quotes and escape existing double quotes
    ]
      .map(e => e.join(','))
      .join('\n');
  
    return csvContent;
  };