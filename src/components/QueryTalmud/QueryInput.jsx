import React, { useState } from 'react';

const QueryInput = ({ query, setQuery, handleQuerySubmit }) => {
    const [isClicked, setIsClicked] = useState(false);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleClick();
        }
    };

    const handleClick = () => {
        setIsClicked(true);
        handleQuerySubmit();
        setTimeout(() => setIsClicked(false), 200); // Reset the click state after animation
    };

    return (
        <div className="query-input-container">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Query the Talmud..."
                className="query-input"
            />
            <button 
                onClick={handleClick} 
                className={`query-submit-button ${isClicked ? 'clicked' : ''}`}
            >
                Submit
            </button>
        </div>
    );
};

export default QueryInput;