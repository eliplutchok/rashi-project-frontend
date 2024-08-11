import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Section from './Section';
import Book from './Book';
import '../css/Library.css';

const Library = () => {
  const sections = ['Tanach', 'Mishnah', 'Talmud', 'Halacha', 'Midrash', 'Tosefta', 'Kabbalah'];
  const { section: urlSection, book: urlBook } = useParams();
  const [activeSection, setActiveSection] = useState(urlSection || null);
  const [activeBook, setActiveBook] = useState(urlBook || null);
  const navigate = useNavigate();

  useEffect(() => {
    if (urlSection) {
      setActiveSection(urlSection);
    }
    if (urlBook) {
      setActiveBook(urlBook);
    }
  }, [urlSection, urlBook]);

  useEffect(() => {
    const path = activeSection ? `/library/${activeSection}` : '/library';
    if (activeBook) {
      navigate(`${path}/${activeBook}`, { replace: true });
    } else {
      navigate(path, { replace: true });
    }
  }, [activeSection, activeBook, navigate]);

  const handleSectionSelection = (section) => {
    setActiveSection(section);
    setActiveBook(null); // Reset active book when section changes
  };

  const handleBookSelection = (book) => {
    setActiveBook(book);
  };

  const handleBackToSections = () => {
    setActiveBook(null);
  };

  return (
    <div className="library-container">
      {!activeSection && (
        <div className="library-sections">
          {sections.map((section, index) => (
            <button
              key={index}
              className={activeSection === section ? 'active' : ''}
              onClick={() => handleSectionSelection(section)}
            >
              {section}
            </button>
          ))}
        </div>
      )}
      {activeSection && !activeBook && (
        <Section section={activeSection} onBookSelect={handleBookSelection} />
      )}
      {activeBook && <Book book={activeBook} onBack={handleBackToSections} />}
    </div>
  );
};

export default Library;