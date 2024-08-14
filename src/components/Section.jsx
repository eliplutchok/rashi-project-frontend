import '../css/Section.css';
import React from 'react';
import PropTypes from 'prop-types';
import { books } from '../data/books';

const Section = ({ section, onBookSelect }) => {
  const sectionBooks = books[section];

  if (!sectionBooks) {
    return <div className="section-container">Invalid section selected</div>;
  }

  return (
    <div className="section-container">
      <div className="section-books">
        {Object.keys(sectionBooks).map((subsection, index) => (
          <div key={index} className="subsection">
            <h3>{subsection}</h3>
            <div className="books">
              {sectionBooks[subsection].map((book, index) => (
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

Section.propTypes = {
  section: PropTypes.string.isRequired,
  onBookSelect: PropTypes.func.isRequired,
};

export default Section;