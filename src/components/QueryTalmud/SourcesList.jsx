import React, { useState } from 'react';

const buildSourceUrl = (bookName, pageNumber, passageId) => {
    return `http://localhost:3000/page/${bookName}/${pageNumber}?passageId=${passageId}`;
};

const SourcesList = ({ sources, loading }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={`sources-container ${loading ? "sources-container-loading" : ""}`}>
            <div className="toggle-button" onClick={toggleCollapse}>
                {isCollapsed ? '► Sources' : '▲ Sources'}
            </div>
            {!isCollapsed && sources.map((source, index) => {
                const showHeader = index === 0 || sources[index - 1].name !== source.name || sources[index - 1].page_number !== source.page_number;

                return (
                    <a
                        key={source.passage_id}
                        href={buildSourceUrl(source.name, source.page_number, source.passage_id)}
                        className={`source-card ${!showHeader ? 'no-header' : ''}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <div className={`hebrew-text ${loading ? "low-opacity-blur" : ""}`}>
                            {showHeader && <h4>{source.name} {source.page_number}</h4>}
                            <div dangerouslySetInnerHTML={{ __html: source.hebrew_text }} />
                        </div>
                        <br />
                        <div className={`english-text ${loading ? "low-opacity-blur" : ""}`}>
                            <div dangerouslySetInnerHTML={{ __html: source.text }} />
                        </div>
                    </a>
                );
            })}
        </div>
    );
};

export default SourcesList;