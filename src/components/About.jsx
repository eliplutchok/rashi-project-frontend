import React, { useEffect } from 'react';
import '../css/About.css';

const About = () => {
  useEffect(() => {
    const sections = document.querySelectorAll('.about-section');
    sections.forEach((section, index) => {
      setTimeout(() => {
        section.classList.add('visible');
      }, index * 500); // Delay each section by 500ms
    });
  }, []);

  return (
    <div className="about-container">
      <h1>About Us</h1>
      <section className="about-section mission">
        <h2>Our Mission</h2>
        <p>
          At Arrowsmith, we are dedicated to harnessing the power of artificial intelligence to translate Jewish texts. Our goal is to make these texts accessible to a wider audience by providing accurate and meaningful translations.
        </p>
      </section>
      <section className="about-section what-we-do">
        <h2>What We Do</h2>
        <p>
          We are starting with a demo on Rashi, a prominent medieval Jewish commentator. Our team employs various strategies to fine-tune AI models to create translations of Rashi's works. This website serves as a platform where users can view these translations, suggest edits, and provide ratings.
        </p>
      </section>
      <section className="about-section how-it-works">
        <h2>How It Works</h2>
        <p>
          Users can engage with the translations in multiple ways:
        </p>
        <ul>
          <li>Viewing translations and understanding the text in their preferred language.</li>
          <li>Suggesting edits to improve the accuracy and readability of the translations.</li>
          <li>Rating the translations to help us understand the quality and make necessary adjustments.</li>
          <li>Comparing translations to determine the most accurate and meaningful interpretations.</li>
        </ul>
      </section>
      <section className="about-section future-plans">
        <h2>Future Plans</h2>
        <p>
          As we continue to develop and fine-tune our models, we plan to expand our translations to include a broader range of Jewish texts. Our vision is to create a comprehensive AI-driven translation platform that serves scholars, students, and anyone interested in Jewish literature.
        </p>
      </section>
      <section className="about-section join-us">
        <h2>Join Us</h2>
        <p>
          We invite you to join us on this journey. Your feedback, suggestions, and ratings are invaluable in helping us improve and refine our translations. Together, we can make Jewish texts more accessible and comprehensible for everyone.
        </p>
      </section>
    </div>
  );
};

export default About;