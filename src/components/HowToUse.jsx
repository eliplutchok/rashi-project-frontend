import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/HowToUse.css';

import introImage from '../assets/images/library-talmud-open.jpg';
import exploreImage from '../assets/images/page-of-talmud.jpg';
import editImage from '../assets/images/editing-image.jpg';
import rateImage from '../assets/images/rating-image.jpg';
import compareImage from '../assets/images/comparisons-image.jpg';
import progressImage from '../assets/images/progress-shot.jpg';
import startedImage from '../assets/images/library-page.jpg';

const HowToUse = () => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const sections = document.querySelectorAll('section');
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.6 // Adjust threshold to determine when a section is considered "in view"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);

    sections.forEach(section => {
      observer.observe(section);
    });

    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  const handleScroll = (event, id) => {
    event.preventDefault();
    const target = document.getElementById(id);
    const offset = 70; // Adjust the offset value to your preference
    const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };

  return (
    <div className="how-to-use-wrapper">
      <nav className="side-nav">
        <ul>
          <li>
            <a 
              href="#intro-section" 
              onClick={(e) => handleScroll(e, 'intro-section')}
              className={activeSection === 'intro-section' ? 'active' : ''}
            >
              • Enhance
            </a>
          </li>
          <li>
            <a 
              href="#explore-section" 
              onClick={(e) => handleScroll(e, 'explore-section')}
              className={activeSection === 'explore-section' ? 'active' : ''}
            >
              • Explore
            </a>
          </li>
          <li>
            <a 
              href="#edit-section" 
              onClick={(e) => handleScroll(e, 'edit-section')}
              className={activeSection === 'edit-section' ? 'active' : ''}
            >
              • Edit
            </a>
          </li>
          <li>
            <a 
              href="#rate-section" 
              onClick={(e) => handleScroll(e, 'rate-section')}
              className={activeSection === 'rate-section' ? 'active' : ''}
            >
              • Rate
            </a>
          </li>
          <li>
            <a 
              href="#compare-section" 
              onClick={(e) => handleScroll(e, 'compare-section')}
              className={activeSection === 'compare-section' ? 'active' : ''}
            >
              • Compare
            </a>
          </li>
          <li>
            <a 
              href="#progress-section" 
              onClick={(e) => handleScroll(e, 'progress-section')}
              className={activeSection === 'progress-section' ? 'active' : ''}
            >
              • Progress
            </a>
          </li>
          <li>
            <a 
              href="#getting-started-section" 
              onClick={(e) => handleScroll(e, 'getting-started-section')}
              className={activeSection === 'getting-started-section' ? 'active' : ''}
            >
              • Get Started
            </a>
          </li>
        </ul>
      </nav>

      <div className="how-to-use-container">
        <h2>How to Use this Website</h2>
        
        <section id="intro-section" className="intro-section">
          <h3>Enhance and Refine Torah Translations</h3>
          <p>
            Our platform is dedicated to providing accurate and meaningful translations of Torah texts. We’re currently showcasing a demo focused on Rashi’s commentary on the Talmud, with AI-generated English translations. Your participation in this project is crucial. By editing and rating translations, you directly contribute to refining our models, helping us—and others—achieve better translations for these sacred texts.
          </p>
          <div className="image-container">
            <Link to="/library"> 
              <img src={startedImage} alt="Getting Started" />
            </Link>
          </div>
        </section>
        
        <section id="explore-section" className="explore-section">
          <h3>Explore Talmud and Rashi</h3>
          <p>
            Dive into the texts with ease. Each page presents the Talmud text alongside Rashi’s commentary, accompanied by AI-generated English translations. Navigate through the texts, select passages, and engage with the material in a meaningful way.
          </p>
          <div className="image-container">
            <Link to="/page/Megillah/3a?passageId=7177">
              <img src={exploreImage} alt="Explore" />
            </Link>
          </div>
        </section>
        
        <section id="edit-section" className="edit-section">
          <h3>Contribute by Editing Translations</h3>
          <p>
            You can propose edits to translations by clicking on the text. While your edits will be reviewed by an admin before publication, every suggestion you make helps us improve the accuracy of future translations. Your edits are invaluable in fine-tuning our translation models.
          </p>
          <div className="image-container">
            <Link to="/page/Megillah/3a?passageId=7177">
              <img src={editImage} alt="Edit Translations" />
            </Link>
          </div>
        </section>
        
        <section id="rate-section" className="rate-section">
          <h3>Rate and Influence Translation Quality</h3>
          <p>
            Your ratings are another vital contribution. By rating the translations, you provide essential feedback that influences how we refine our models. Each rating helps guide the development of more accurate and nuanced translations, making this a collaborative effort.
          </p>
          <div className="image-container">
            <Link to="/page/Megillah/3a?passageId=7177">
              <img src={rateImage} alt="Rate Translations" />
            </Link>
          </div>
        </section>
        
        <section id="compare-section" className="compare-section">
          <h3>Compare Translations Side by Side</h3>
          <p>
            For a deeper understanding, visit the comparison page where you can view two translations side by side. This feature allows you to compare different interpretations and provide ratings, helping us continuously improve the quality of our translations.
          </p>
          <div className="image-container">
            <Link to="/comparisonPage/Megillah/3a">
              <img src={compareImage} alt="Compare Translations" />
            </Link>
          </div>
        </section>
        
        <section id="progress-section" className="progress-section">
          <h3>Seamless Reading Experience</h3>
          <p>
            The platform automatically tracks your reading progress. Whether you log out or switch devices, you can resume your studies exactly where you left off. This ensures a smooth and uninterrupted learning experience.
          </p>
          <div className="image-container">
            <Link to="/library/Talmud/Megillah">
              <img src={progressImage} alt="Reading Progress" />
            </Link>
          </div>
        </section>
        
        <section id="getting-started-section" className="getting-started-section">
          <h3>Get Started Today</h3>
          <p>
            Join us in enhancing the understanding of Torah texts. Explore, edit, rate, and compare translations—all while contributing to a larger community effort to improve the accuracy and quality of sacred text translations. Your involvement makes a difference.
          </p>
          <div className="image-container">
            <Link to="/library/Talmud">
              <img src={introImage} alt="Introduction" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HowToUse;