import '../css/Section.css';
import React from 'react';

const Section = ({ section, onBookSelect }) => {
  const books = {
    Talmud: {
      Zeraim: ['Berakhot'],
      Moed: ['Shabbat', 'Eruvin', 'Pesahim', 'Shekalim', 'Rosh Hashanah', 'Yoma', 'Succah', 'Betzah', 'Ta\'anit', 'Megillah', 'Moed Katan', 'Hagigah'],
      Nashim: ['Yevamot', 'Ketubot', 'Nedarim', 'Nazir', 'Sotah', 'Gittin', 'Kiddushin'],
      Nezikin: ['Bava Kamma', 'Bava Metzia', 'Bava Batra', 'Sanhedrin', 'Makkot', 'Shevuot', 'Avodah Zarah', 'Horayot'],
      Kodshim: ['Zevahim', 'Menahot', 'Hullin', 'Bekhorot', 'Arakhin', 'Temurah', 'Keretot', 'Me\'ilah'],
      Taharot: ['Niddah'],
    },
    Tanach: {
    },
    Mishnah: {
    },
    Halacha: {},
    Midrash: {
    },
    Tosefta: {

    },
    Kabbalah: {
    },
  };

  return (
    <div className="section-container">
      <div className="section-books">
        {Object.keys(books[section]).map((subsection, index) => (
          <div key={index} className="subsection">
            <h3>{subsection}</h3>
            <div className="books">
              {books[section][subsection].map((book, index) => (
                <button key={index} onClick={() => onBookSelect(book)}>
                  {book}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Section;