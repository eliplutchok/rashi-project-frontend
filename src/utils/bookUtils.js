export const generatePages = (numPages, bookInfoLength) => {
    const pages = [];
    const letters = ['a', 'b'];
  
    for (let i = 2; i <= numPages; i++) {
      pages.push(`${i}${letters[0]}`);
      if (i !== numPages || bookInfoLength % 2 === 0) {
        pages.push(`${i}${letters[1]}`);
      }
    }
  
    return pages;
  };