import React, { useState, useContext, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import ReactMarkdown from 'react-markdown';
import { ThemeContext } from '../../context/ThemeContext';
import QueryInput from './QueryInput';
import LoadingAnimation from './LoadingAnimation';
import SourcesList from './SourcesList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faCopy } from '@fortawesome/free-solid-svg-icons';
import FeedbackModal from './FeedbackModal';
import { ToastContainer, toast, Slide, Bounce, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './QueryTalmud.css';
import './QueryTalmud-Dark.css';
import './loading-animation.css';

const QueryTalmud = () => {
    const [query, setQuery] = useState('');
    const [answer, setAnswer] = useState('');
    const [run_id, setRunId] = useState('');
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const { isDarkMode } = useContext(ThemeContext);
    
    const [score, setScore] = useState(null); // 1 for thumbs up, -1 for thumbs down
    const [comment, setComment] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalPlaceholder, setModalPlaceholder] = useState('');

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
            const raw_response = await axiosInstance.get(
                `${process.env.REACT_APP_API_URL}/queryTalmudDeep`,
                {
                    params: { query },
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            console.log(raw_response);
            const { answer, relevant_passage_ids, run_id } = raw_response.data;

            setAnswer(answer);
            setRunId(run_id);

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
            toast.error("An error occurred while processing your request.", {
                theme: isDarkMode ? "dark" : "light",
                transition: Bounce,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFeedbackSubmit = async () => {
        if (!run_id) return;
        
        try {
            setShowModal(false);
            setComment('');
            toast.success("Feedback submitted", {
                theme: isDarkMode ? "dark" : "light",
                transition: Slide,
            });
            await axiosInstance.get(
                `${process.env.REACT_APP_API_URL}/submitFeedback`,
                {
                    params: {score, comment, run_id},
                    headers: { 'Content-Type': 'application/json' },
                },
            );
            // toast.success("Feedback received successfully", {
            //     theme: isDarkMode ? "dark" : "light",
            // });
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setError('An error occurred while submitting your feedback.');
            toast.error("An error occurred while submitting your feedback.", {
                theme: isDarkMode ? "dark" : "light",
                transition: Bounce,
            });
        } 
    };

    const handleThumbsUp = () => {
        setScore(1);
        setModalPlaceholder("What did you like about this response?");
        setShowModal(true);
    };

    const handleThumbsDown = () => {
        setScore(-1);
        setModalPlaceholder("What did you not like about this response?");
        setShowModal(true);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(answer);
        toast.info("Response copied to clipboard!",{
            theme: isDarkMode ? "dark" : "light",
            transition: Zoom,
            autoClose: 1000,
            hideProgressBar: true,
        });
    };

    return (
        <div className={`query-talmud-container ${isDarkMode ? "dark-mode" : ""}`}>
            <QueryInput 
                query={query} 
                setQuery={setQuery} 
                handleQuerySubmit={handleQuerySubmit} 
            />
            {loading && <LoadingAnimation elapsedTime={elapsedTime} />}
            {answer && (
                <div className="answer-container">
                    <div className='answer-text-container'>
                        <ReactMarkdown className={`${loading ? "low-opacity-blur" : ""}`}>
                            {answer}
                        </ReactMarkdown>
                    </div>
                    <div className={`query-feedback ${loading ? "low-opacity-blur" : ""}`}>
                        <div className="query-feedback-thumbs">
                            <button className="thumbs thumbs-up" onClick={handleThumbsUp}>
                                <FontAwesomeIcon icon={faThumbsUp} />
                            </button>
                            <button className="thumbs thumbs-down" onClick={handleThumbsDown}>
                                <FontAwesomeIcon icon={faThumbsDown} />
                            </button>
                            <button className="copy-response" onClick={handleCopy}>
                                <FontAwesomeIcon icon={faCopy} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {sources.length > 0 && (
                <SourcesList sources={sources} loading={loading} />
            )}
            <FeedbackModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleFeedbackSubmit}
                comment={comment}
                setComment={setComment}
                message="Please provide details: (optional)"
                placeholder={modalPlaceholder}
            />
            <ToastContainer
            position="bottom-right"
            />
        </div>
    );
};

export default QueryTalmud;