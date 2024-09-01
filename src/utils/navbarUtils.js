const hebrewNumbers = [
    { value: 400, letter: "ת" },
    { value: 300, letter: "ש" },
    { value: 200, letter: "ר" },
    { value: 100, letter: "ק" },
    { value: 90, letter: "צ" },
    { value: 80, letter: "פ" },
    { value: 70, letter: "ע" },
    { value: 60, letter: "ס" },
    { value: 50, letter: "נ" },
    { value: 40, letter: "מ" },
    { value: 30, letter: "ל" },
    { value: 20, letter: "כ" },
    { value: 10, letter: "י" },
    { value: 9, letter: "ט" },
    { value: 8, letter: "ח" },
    { value: 7, letter: "ז" },
    { value: 6, letter: "ו" },
    { value: 5, letter: "ה" },
    { value: 4, letter: "ד" },
    { value: 3, letter: "ג" },
    { value: 2, letter: "ב" },
    { value: 1, letter: "א" }
];

function toHebrewNumber(num) {
    let result = '';
    hebrewNumbers.forEach(({ value, letter }) => {
        while (num >= value) {
            result += letter;
            num -= value;
        }
    });
    return result;
}

function convertPageNumberToHebrew(pageNumber) {
    // Split the number into the numeric part and the side ("a" or "b")
    const numericPart = parseInt(pageNumber.slice(0, -1), 10);
    const side = pageNumber.slice(-1);
    
    // Convert the numeric part to Hebrew
    const hebrewNum = toHebrewNumber(numericPart);
    
    // Determine the side (a -> ".", b -> ":")
    const sideSymbol = side === 'a' ? '.' : ':';
    
    return [hebrewNum, sideSymbol];
}

const bookNameMap = {
    "Berakhot": "ברכות",
    "Shabbat": "שבת",
    "Eiruvin": "עירובין",
    "Pesachim": "פסחים",
    "Yoma": "יומא",
    "Sukkah": "סוכה",
    "Beitzah": "ביצה",
    "Rosh Hashanah": "ראש השנה",
    "Taanit": "תענית",
    "Megillah": "מגילה",
    "Moed Kattan": "מועד קטן",
    "Hagigah": "חגיגה",
    "Gittin": "גיטין",
    "Ketubot": "כתובות",
    "Kiddushin": "קידושין",
    "Nazir": "נזיר",
    "Nedarim": "נדרים",
    "Sotah": "סוטה",
    "Yevamot": "יבמות",
    "Avodah Zarah": "עבודה זרה",
    "Bava Batra": "בבא בתרא",
    "Bava Kamma": "בבא קמא",
    "Bava Metzia": "בבא מציעא",
    "Horayot": "הוריות",
    "Makkot": "מכות",
    "Sanhedrin": "סנהדרין",
    "Shevuot": "שבועות",
    "Arakhin": "ערכין",
    "Bekhorot": "בכורות",
    "Chullin": "חולין",
    "Keritot": "כריתות",
    "Meilah": "מעילה",
    "Menachot": "מנחות",
    "Temurah": "תמורה",
    "Zevachim": "זבחים",
    "Niddah": "נדה"
  };
  
  function convertBookNameToHebrew(englishName) {
    return bookNameMap[englishName] || "Unknown Book";
  }
  

export { convertPageNumberToHebrew, convertBookNameToHebrew };