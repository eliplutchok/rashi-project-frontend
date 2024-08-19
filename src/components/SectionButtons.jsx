import React from 'react';
import PropTypes from 'prop-types';
import '../css/Library.css';

const SectionButtons = ({ sections, activeSection, onSelectSection }) => (
  <div className={`library-sections ${activeSection ? 'all-buttons-small' : ''}`}>
    {sections.map((section, index) => (
      <button
        key={index}
        className={activeSection === section ? 'active' : ''}
        onClick={() => onSelectSection(section)}
      >
        {section}
      </button>
    ))}
  </div>
);

SectionButtons.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeSection: PropTypes.string,
  onSelectSection: PropTypes.func.isRequired,
};

export default SectionButtons;