import React, { useEffect, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

import './About.css';
import './About-Dark.css';

const SECTION_DELAY = 500;

const About = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  useEffect(() => {
    const sections = document.querySelectorAll('.about-section');
    sections.forEach((section, index) => {
      setTimeout(() => {
        section.classList.add('visible');
      }, index * SECTION_DELAY); // Delay each section by 500ms
    });
  }, []);

  return (
    <div className={`about-container ${isDarkMode ? 'dark-mode' : ''}`}>
       {/* <button 
          className="dark-mode-button"
          onClick={toggleTheme}
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
        </button> */}
      <h1>About Us</h1>
      <section className="about-section mission">
        <h2>Our Mission</h2>
        <p>
          At Arrowsmith, we are committed to leveraging advanced artificial intelligence technologies to translate Jewish texts with unparalleled accuracy. Our mission is to make these invaluable texts accessible to a global audience by ensuring our translations are both precise and meaningful.
        </p>
      </section>
      <section className="about-section what-we-do">
        <h2>What We Do</h2>
        <p>
          Our initial focus is a demonstration project on Rashi, the esteemed medieval Jewish commentator. Our expert team meticulously fine-tunes AI models to produce translations of Rashi's works. This platform allows users to explore these translations, suggest refinements, and provide ratings to enhance our efforts.
        </p>
      </section>
      <section className="about-section how-it-works">
        <h2>How It Works</h2>
        <p>
          Our platform offers a multifaceted engagement with the translations:
        </p>
        <ul>
          <li>Access translations and comprehend the text in their preferred language.</li>
          <li>Propose edits to enhance the accuracy and clarity of the translations.</li>
          <li>Rate the translations, providing critical feedback to help us gauge quality and implement necessary improvements.</li>
          <li>Compare different translations to identify the most accurate and insightful interpretations.</li>
        </ul>
      </section>
      <section className="about-section future-plans">
        <h2>Future Plans</h2>
        <p>
          As we continue refining our AI models, we aim to broaden our translation scope to encompass a wider array of Jewish texts. Our vision is to develop a comprehensive, AI-driven translation platform that caters to scholars, students, and enthusiasts of Jewish literature alike.
        </p>
      </section>
      <section className="about-section join-us">
        <h2>Join Us</h2>
        <p>
          We invite you to participate in this transformative journey. Your feedback, suggestions, and ratings are crucial in helping us perfect our translations. Together, we can make Jewish texts more accessible and comprehensible for everyone.
        </p>
      </section>
    </div>
  );
};

export default About;