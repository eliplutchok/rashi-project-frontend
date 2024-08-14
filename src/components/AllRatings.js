import React, { useState, useEffect } from 'react';
import useRatings from '../hooks/useRatings';
import { generateRatingsCSV } from '../utils/adminUtils';
import AllRatingsFilter from './AllRatingsFilter';
import AllRatingsActions from './AllRatingsActions';
import AllRatingsModal from './AllRatingsModal';
import axiosInstance from '../utils/axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import '../css/AllEdits.css';

const AllRatings = () => {
  const [filters, setFilters] = useState({ username: '', translation_status: '', rating_status: 'not viewed' });
  const [expandedRating, setExpandedRating] = useState(null);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAction, setSelectedAction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const { ratings, totalPages, fetchRatings } = useRatings(filters, currentPage, sortField, sortOrder);

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
    setIsLoading(true);
    try {
      const responseUrl = `${process.env.REACT_APP_API_URL}/ratings/${selectedAction}`;
      await axiosInstance.post(responseUrl, { rating_ids: selectedRatings });
      fetchRatings();
      setSelectedRatings([]);
      setSelectAll(false);
    } catch (error) {
      console.error(`Error performing ${selectedAction} on ratings:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIndividualAction = async (action, id) => {
    try {
      handleCloseModal();
      const responseUrl = `${process.env.REACT_APP_API_URL}/ratings/${action}`;
      await axiosInstance.post(responseUrl, { rating_ids: [id] });
      fetchRatings();
    } catch (error) {
      console.error(`Error performing ${action} on rating:`, error);
    }
  };

  const handleDownloadCSV = () => {
    const csvContent = generateRatingsCSV(ratings);

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

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  };

  const renderSortIcon = (field) => {
    if (sortField === field) {
      return sortOrder === 'asc' ? <FontAwesomeIcon icon={faSortUp} /> : <FontAwesomeIcon icon={faSortDown} />;
    }
    return <FontAwesomeIcon icon={faSort} />;
  };

  return (
    <div className="all-edits">
      <AllRatingsFilter filters={filters} handleInputChange={handleInputChange} />
      <AllRatingsActions
        selectedAction={selectedAction}
        handleActionSelect={handleActionSelect}
        handleConfirmAction={handleConfirmAction}
        handleDownloadCSV={handleDownloadCSV}
        isLoading={isLoading}
      />
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" checked={selectAll} onChange={handleSelectAllChange} /></th>
              <th className="table-sort-header" onClick={() => handleSort('username')}>
                <span>Username</span> <span className="sort-icon">{renderSortIcon('username')}</span>
              </th>
              <th className="table-sort-header" onClick={() => handleSort('text')}>
                <span>Translation</span> <span className="sort-icon">{renderSortIcon('text')}</span>
              </th>
              <th className="table-sort-header" onClick={() => handleSort('rating')}>
                <span>Rating</span> <span className="sort-icon">{renderSortIcon('rating')}</span>
              </th>
              <th className="table-sort-header" onClick={() => handleSort('feedback')}>
                <span>Feedback</span> <span className="sort-icon">{renderSortIcon('feedback')}</span>
              </th>
              <th className="table-sort-header" onClick={() => handleSort('creation_date')}>
                <span>Creation Date</span> <span className="sort-icon">{renderSortIcon('creation_date')}</span>
              </th>
              <th className="table-sort-header" onClick={() => handleSort('status')}>
                <span>Status</span> <span className="sort-icon">{renderSortIcon('status')}</span>
              </th>
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
                <td onClick={() => handleExpandClick(rating)}>{rating.username}</td>
                <td
                  className={expandedRating && expandedRating.rating_id === rating.rating_id ? 'expanded-text' : 'truncated-text'}
                  onClick={() => handleExpandClick(rating)}
                >
                  {rating.text}
                </td>
                <td onClick={() => handleExpandClick(rating)}>{rating.rating}</td>
                <td onClick={() => handleExpandClick(rating)}>{rating.feedback}</td>
                <td onClick={() => handleExpandClick(rating)}>{new Date(rating.creation_date).toLocaleString()}</td>
                <td onClick={() => handleExpandClick(rating)}>{rating.status}</td>
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
        <AllRatingsModal
          expandedRating={expandedRating}
          handleCloseModal={handleCloseModal}
          handleIndividualAction={handleIndividualAction}
        />
      )}
    </div>
  );
};

export default AllRatings;