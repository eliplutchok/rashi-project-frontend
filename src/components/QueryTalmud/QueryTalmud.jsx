import React, { useState, useContext, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import ReactMarkdown from 'react-markdown';
import { ThemeContext } from '../../context/ThemeContext';
import QueryInput from './QueryInput';
import LoadingAnimation from './LoadingAnimation';
import SourcesList from './SourcesList';
import './QueryTalmud.css';
import './QueryTalmud-Dark.css';
import './loading-animation.css';

const QueryTalmud = () => {
    const [query, setQuery] = useState('');
    const [answer, setAnswer] = useState('');
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const { isDarkMode } = useContext(ThemeContext);

    useEffect(() => {
        let timer;
        if (loading) {
            setElapsedTime(0);
            timer = setInterval(() => {
                setElapsedTime(prevTime => prevTime + 0.01);
            }, 10);
        }
        return () => clearInterval(timer);
    }, [loading]);

    const handleQuerySubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get(
                `${process.env.REACT_APP_FLASK_API_URL}/query`,
                {
                    params: { query },
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            const { answer, relevant_passage_ids } = response.data.response;

            setAnswer(answer);

            const sourcesResponse = await axiosInstance.get(
                `${process.env.REACT_APP_API_URL}/getPassagesByIds`,
                {
                    params: { passage_ids: relevant_passage_ids },
                }
            );

            let data = sourcesResponse.data.filter(
                source => !source.text.includes('sample translation')
            );

            data.sort((a, b) => a.passage_id - b.passage_id);
            setSources(data);
        } catch (error) {
            console.error('Error fetching query or sources:', error);
            setError('An error occurred while processing your request.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`query-talmud-container ${isDarkMode ? "dark-mode" : ""}`}>
            <QueryInput 
                query={query} 
                setQuery={setQuery} 
                handleQuerySubmit={handleQuerySubmit} 
            />
            {loading && <LoadingAnimation elapsedTime={elapsedTime} />}
            {error && <p className="error-text">{error}</p>}
            {answer && (
                <div className="answer-container">
                    <ReactMarkdown className={`${loading ? "low-opacity-blur" : ""}`}>
                        {answer}
                    </ReactMarkdown>
                </div>
            )}
            {sources.length > 0 && (
                <SourcesList sources={sources} loading={loading} />
            )}
        </div>
    );
};

export default QueryTalmud;