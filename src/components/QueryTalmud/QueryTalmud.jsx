import React, { useState, useContext } from 'react';
import axios from 'axios'; // for the Python server
import axiosInstance from '../../utils/axiosInstance'; // for the Node backend
import ReactMarkdown from 'react-markdown';
import { ThemeContext } from '../../context/ThemeContext';
import './QueryTalmud.css'; // Import the CSS file

const QueryTalmud = () => {
    const [query, setQuery] = useState('');
    const [answer, setAnswer] = useState('');
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { isDarkMode } = useContext(ThemeContext);

    const handleQueryChange = (e) => {
        setQuery(e.target.value);
    };

    const handleQuerySubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            // Call the Python server to get the answer and relevant passage IDs
            let url = `${process.env.REACT_APP_FLASK_API_URL}/query`;

            const response = await axiosInstance.get(url, {
                params: { query },
                headers: { 
                    'Content-Type': 'application/json'
                },
                useCredentials: false
            });
            const { answer, relevant_passage_ids } = response.data.response;

            setAnswer(answer);

            // Call the Node backend to get the sources by IDs
            const sourcesResponse = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/getPassagesByIds`, {
                params: { passage_ids: relevant_passage_ids }   
            });

            let data = sourcesResponse.data;
            // filter out the sources that their translation contains "sample translation"
            data = data.filter(source => !source.text.includes('sample translation'));
            // sort the sources by passage ID
            data.sort((a, b) => a.passage_id - b.passage_id);
            console.log('Sources:', data);

            setSources(data);
        } catch (error) {
            console.error('Error fetching query or sources:', error);
            setError('An error occurred while processing your request.');
        } finally {
            setLoading(false);
        }
    };

    const buildSourceUrl = (bookName, pageNumber, passageId) => {
        return `http://localhost:3000/page/${bookName}/${pageNumber}?passageId=${passageId}`;
    };

    return (
        <div className={`query-talmud-container ${isDarkMode ? "dark-mode" : ""}`}>
            <div className="query-input-container">
                <input
                    type="text"
                    value={query}
                    onChange={handleQueryChange}
                    placeholder="Query the Talmud..."
                    className="query-input"
                />
                <button onClick={handleQuerySubmit} className="query-submit-button">
                    Submit
                </button>
            </div>
            
            {loading && <div className="spinner"></div>}
            
            {error && <p className="error-text">{error}</p>}

            {answer && (
                <div className="answer-container">
                    <h3>Answer</h3>
                    <ReactMarkdown>{answer}</ReactMarkdown>
                </div>
            )}

            {sources.length > 0 && (
                <div className="sources-container">
                    {/* <h3>Sources</h3> */}
                    {sources.map((source, index) => {
                        // Check if the previous source has the same h4 value
                        const showHeader = index === 0 || sources[index - 1].name !== source.name || sources[index - 1].page_number !== source.page_number;
                        
                        return (
                            <a 
                                key={source.passage_id} 
                                href={buildSourceUrl(source.name, source.page_number, source.passage_id)}
                                className={`source-card ${!showHeader ? 'no-header' : ''}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                               
                                <div className="hebrew-text">
                                {showHeader && <h4>{source.name} {source.page_number}</h4>}
                                    <div  dangerouslySetInnerHTML={{ __html: source.hebrew_text }} />
                                </div>
                                <br />
                                <div className="english-text">
            
                                    <div dangerouslySetInnerHTML={{ __html: source.text }} />
                                </div>
                            </a>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default QueryTalmud;