import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Section from './Section';
import Book from '../Book/Book';
import SectionButtons from './SectionButtons';
import { ThemeContext } from '../../context/ThemeContext';
import './Library.css';
import './Library-Dark.css';

const SECTIONS = ['Mishnah', 'Talmud', 'Tanach', 'Mussar', 'Halacha', 'Kabbalah', 'Other'];

const Library = () => {
  const { section: urlSection, book: urlBook } = useParams();
  const [activeSection, setActiveSection] = useState(urlSection || null);
  const [activeBook, setActiveBook] = useState(urlBook || null);
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);

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

  // Determine the class name for the library container
  const libraryClassName = `library-container ${
    isDarkMode ? "dark-mode" : ""
  } ${!activeSection && !activeBook ? "library-unselected" : ""}`;

  return (
    <div className={libraryClassName}>
      <SectionButtons
        sections={SECTIONS}
        activeSection={activeSection}
        onSelectSection={handleSectionSelection}
      />
      {activeSection && !activeBook && (
        <Section section={activeSection} onBookSelect={handleBookSelection} />
      )}
      {activeBook && <Book book={activeBook} onBack={handleBackToSections} />}
    </div>
  );
};

export default Library;