import React from 'react';

const LoadingAnimation = ({ elapsedTime }) => (
    <div className="loader-container">
        <div className="scroll-loader">
        <div className="seconds">{elapsedTime.toFixed(2)}</div>
            <div className="scroll-text">
                
                <div className="message">Queries can take anywhere from 5 to 20 seconds to process.</div>
            </div>
        </div>
    </div>
);

export default LoadingAnimation;