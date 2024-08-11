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
      Torah: ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy'],
      Prophets: ['Joshua', 'Judges', 'Samuel', 'Kings', 'Isaiah', 'Jeremiah', 'Ezekiel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'],
      Writings: ['Psalms', 'Proverbs', 'Job', 'Song of Songs', 'Ruth', 'Lamentations', 'Ecclesiastes', 'Esther', 'Daniel', 'Ezra', 'Nehemiah', 'Chronicles'],
    },
    Mishnah: {
      Zeraim: ['Berakhot', 'Peah', 'Demai', 'Kilayim', 'Sheviit', 'Terumot', 'Maaserot', 'Maaser Sheni', 'Hallah', 'Orlah', 'Bikkurim'],
      Moed: ['Shabbat', 'Eruvin', 'Pesahim', 'Shekalim', 'Yoma', 'Sukkah', 'Beitzah', 'Rosh Hashanah', 'Taanit', 'Megillah', 'Moed Katan', 'Hagigah'],
      Nashim: ['Yevamot', 'Ketubot', 'Nedarim', 'Nazir', 'Sotah', 'Gittin', 'Kiddushin'],
      Nezikin: ['Bava Kamma', 'Bava Metzia', 'Bava Batra', 'Sanhedrin', 'Makkot', 'Shevuot', 'Eduyot', 'Avodah Zarah', 'Avot', 'Horayot'],
      Kodshim: ['Zevahim', 'Menahot', 'Chullin', 'Bechorot', 'Arachin', 'Temurah', 'Keritot', 'Meilah', 'Tamid', 'Middot', 'Kinnim'],
      Taharot: ['Kelim', 'Ohalot', 'Nega\'im', 'Parah', 'Tohorot', 'Mikvaot', 'Niddah', 'Machshirin', 'Zavim', 'Tevul Yom', 'Yadayim', 'Uktzin'],
    },
    Halacha: {
      OrachChaim: ['Shulchan Aruch', 'Mishnah Berurah'],
      YorehDeah: ['Shulchan Aruch', 'Mishnah Berurah'],
    },
    Midrash: {
      Rabbah: ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy'],
    },
    Tosefta: {
      Zeraim: ['Berakhot', 'Peah', 'Demai', 'Kilayim', 'Sheviit', 'Terumot', 'Maaserot', 'Maaser Sheni', 'Hallah', 'Orlah', 'Bikkurim'],
      Moed: ['Shabbat', 'Eruvin', 'Pesahim', 'Shekalim', 'Yoma', 'Sukkah', 'Beitzah', 'Rosh Hashanah', 'Taanit', 'Megillah', 'Moed Katan', 'Hagigah'],
      Nashim: ['Yevamot', 'Ketubot', 'Nedarim', 'Nazir', 'Sotah', 'Gittin', 'Kiddushin'],
      Nezikin: ['Bava Kamma', 'Bava Metzia', 'Bava Batra', 'Sanhedrin', 'Makkot', 'Shevuot', 'Eduyot', 'Avodah Zarah', 'Avot', 'Horayot'],
      Kodshim: ['Zevahim', 'Menahot', 'Chullin', 'Bechorot', 'Arachin', 'Temurah', 'Keritot', 'Meilah', 'Tamid', 'Middot', 'Kinnim'],
      Taharot: ['Kelim', 'Ohalot', 'Nega\'im', 'Parah', 'Tohorot', 'Mikvaot', 'Niddah', 'Machshirin', 'Zavim', 'Tevul Yom', 'Yadayim', 'Uktzin'],
    },
    Kabbalah: {
      Zohar: ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy'],
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