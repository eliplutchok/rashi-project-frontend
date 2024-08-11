import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from './axiosInstance';
import '../css/AllEdits.css';

const AllRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [filters, setFilters] = useState({ username: '', translation_status: '', rating_status: 'not viewed' });
  const [expandedRating, setExpandedRating] = useState(null);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAction, setSelectedAction] = useState('');

  
  const fetchRatings = useCallback(async () => {
    try {
      const responseUrl = `${process.env.REACT_APP_API_URL}/allRatings`;
      let filters_copy = { ...filters, currentPage, limit: 20 };
      Object.keys(filters_copy).forEach(key => {
        if (filters_copy[key] === '') {
          delete filters_copy[key];
        }
      });
      const response = await axiosInstance.get(responseUrl, { params: filters_copy });
      setRatings(response.data.ratings);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  }, [filters, currentPage]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleExpandClick = (rating) => {
    setExpandedRating(rating);
  };

  const handleCloseModal = () => {
    setExpandedRating(null);
  };

  const handleCheckboxChange = (id) => {
    setSelectedRatings((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter(ratingId => ratingId !== id) : [...prevSelected, id]
    );
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedRatings([]);
    } else {
      setSelectedRatings(ratings.map(rating => rating.rating_id));
    }
    setSelectAll(!selectAll);
  };

  const handleActionSelect = (e) => {
    setSelectedAction(e.target.value);
  };

  const handleConfirmAction = async () => {
    if (selectedRatings.length === 0 || !selectedAction) return;
    try {
      const responseUrl = `${process.env.REACT_APP_API_URL}/ratings/${selectedAction}`;
      await axiosInstance.post(responseUrl, { rating_ids: selectedRatings });
      fetchRatings();
      setSelectedRatings([]);
      setSelectAll(false);
    } catch (error) {
      console.error(`Error performing ${selectedAction} on ratings:`, error);
    }
  };

  const handleIndividualAction = async (action, id) => {
    try {
      const responseUrl = `${process.env.REACT_APP_API_URL}/ratings/${action}`;
      await axiosInstance.post(responseUrl, { rating_ids: [id] });
      fetchRatings();
    } catch (error) {
      console.error(`Error performing ${action} on rating:`, error);
    }
  };

  const handleDownloadCSV = () => {
    const csvContent = [
      ['Username', 'Translation', 'Rating', 'Feedback', 'Creation Date', 'Status'],
      ...ratings.map(rating => [
        rating.username,
        rating.text,
        rating.rating,
        rating.feedback,
        new Date(rating.creation_date).toLocaleString(),
        rating.status
      ])
    ]
      .map(e => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'ratings.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="all-edits">
      <div className="filters">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={filters.username}
          onChange={handleInputChange}
        />
        <select
          name="translation_status"
          value={filters.translation_status}
          onChange={handleInputChange}
        >
          <option value="">Translation Status</option>
          <option value="approved">Approved</option>
          <option value="published">Published</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          name="rating_status"
          value={filters.rating_status}
          onChange={handleInputChange}
        >
          <option value="not viewed">Not Viewed</option>
          <option value="viewed">Viewed</option>
          <option value="dismissed">Dismissed</option>
        </select>
      </div>
      <div className="actions">
      <div className="select-and-action">
        <select onChange={handleActionSelect} value={selectedAction}>
          <option value="" disabled>Select action</option>
          <option value="view">Mark as Viewed</option>
          <option value="dismiss">Dismiss</option>
        </select>
        <button onClick={handleConfirmAction}>Confirm Action</button>
        </div>
        <button onClick={handleDownloadCSV}>Download CSV</button>
      </div>
      <div className="table-wrapper">
        <table>
            <thead>
            <tr>
                <th><input type="checkbox" checked={selectAll} onChange={handleSelectAllChange} /></th>
                <th>Username</th>
                <th>Translation</th>
                <th>Rating</th>
                <th>Feedback</th>
                <th>Creation Date</th>
                <th>Status</th>
            </tr>
            </thead>
            <tbody>
            {ratings.map(rating => (
                <tr key={rating.rating_id}>
                <td>
                    <input
                    type="checkbox"
                    checked={selectedRatings.includes(rating.rating_id)}
                    onChange={() => handleCheckboxChange(rating.rating_id)}
                    />
                </td>
                <td>{rating.username}</td>
                <td
                    className={expandedRating && expandedRating.rating_id === rating.rating_id ? 'expanded-text' : 'truncated-text'}
                    onClick={() => handleExpandClick(rating)}
                >
                    {rating.text}
                </td>
                <td>{rating.rating}</td>
                <td>{rating.feedback}</td>
                <td>{new Date(rating.creation_date).toLocaleString()}</td>
                <td>{rating.status}</td>
                </tr>
            ))}
            </tbody>
        </table>
      </div>
      <div className="pagination">
        <button onClick={() => handlePageChange('prev')} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => handlePageChange('next')} disabled={currentPage === totalPages}>Next</button>
      </div>

      {expandedRating && (
        <div className="modal">
            <div className="modal-content">
            <button className="close-button" onClick={handleCloseModal}>Close</button>
            <div className="modal-details">
                <div className="detail-row">
                <span className="detail-title">Username:</span>
                <span className="detail-value">{expandedRating.username}</span>
                </div>
                <div className="detail-row">
                <span className="detail-title">Translation:</span>
                <span className="detail-value">{expandedRating.text}</span>
                </div>
                <div className="detail-row">
                <span className="detail-title">Rating:</span>
                <span className="detail-value">{expandedRating.rating}</span>
                </div>
                <div className="detail-row">
                <span className="detail-title">Feedback:</span>
                <span className="detail-value">{expandedRating.feedback}</span>
                </div>
                <div className="detail-row">
                <span className="detail-title">Creation Date:</span>
                <span className="detail-value">{new Date(expandedRating.creation_date).toLocaleString()}</span>
                </div>
                <div className="detail-row">
                <span className="detail-title">Status:</span>
                <span className="detail-value">{expandedRating.status}</span>
                </div>
            </div>
            <div className="button-group">
                <button onClick={() => handleIndividualAction('view', expandedRating.rating_id)}>Mark as Viewed</button>
                <button onClick={() => handleIndividualAction('dismiss', expandedRating.rating_id)}>Dismiss</button>
            </div>
            </div>
        </div>
        )}
    </div>
  );
};

export default AllRatings;