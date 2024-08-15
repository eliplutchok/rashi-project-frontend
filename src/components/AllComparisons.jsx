import React, { useState, useEffect } from 'react';
import useComparisons from '../hooks/useComparisons'; // Custom hook for fetching comparisons
import { generateComparisonsCSV } from '../utils/adminUtils';
import AllComparisonsFilter from './AllComparisonsFilter';
import AllComparisonsActions from './AllComparisonsActions';
import AllComparisonsModal from './AllComparisonsModal';
import axiosInstance from '../utils/axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from './ConfirmationModal';
import '../css/AllEdits.css';

const AllComparisons = () => {
  const [filters, setFilters] = useState({ translation_one_id: '', translation_two_id: '', version_name: '', status: 'all' });
  const [expandedComparison, setExpandedComparison] = useState(null);
  const [selectedComparisons, setSelectedComparisons] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAction, setSelectedAction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAllPages, setIsLoadingAllPages] = useState(false);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [allPagesSelected, setAllPagesSelected] = useState(false);

  const { comparisons, totalPages, fetchComparisons } = useComparisons(filters, currentPage, sortField, sortOrder);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleExpandClick = (comparison) => {
    setExpandedComparison(comparison);
  };

  const handleCloseModal = () => {
    setExpandedComparison(null);
  };

  const handleCheckboxChange = (id) => {
    setSelectedComparisons((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter(comparisonId => comparisonId !== id) : [...prevSelected, id]
    );
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedComparisons([]);
    } else {
      setSelectedComparisons(comparisons.map(comparison => comparison.comparison_id));
    }
    setSelectAll(!selectAll);
  };

  const handleShowConfirmation = () => {
    setShowConfirmation(true);
  };

  const handleConfirmSelectAllPages = async () => {
    setShowConfirmation(false);
    setIsLoadingAllPages(true);
    try {
      const responseUrl = `${process.env.REACT_APP_API_URL}/allComparisons`;
      const response = await axiosInstance.get(responseUrl, { params: { ...filters, fetchAll: true } });
      const allComparisons = response.data.comparisons.map(comparison => comparison.comparison_id);
      setSelectedComparisons(allComparisons);
      setAllPagesSelected(true);
    } catch (error) {
      console.error('Error selecting all pages:', error);
    } finally {
      setIsLoadingAllPages(false);
    }
  };

  const handleDeselectAllPages = () => {
    setSelectedComparisons([]);
    setAllPagesSelected(false);
  };

  const handleActionSelect = (e) => {
    setSelectedAction(e.target.value);
  };

  const handleConfirmAction = async () => {
    if (selectedComparisons.length === 0 || !selectedAction) return;
    setIsLoading(true);
    try {
      const responseUrl = `${process.env.REACT_APP_API_URL}/comparisons/${selectedAction}`;
      await axiosInstance.post(responseUrl, { comparison_ids: selectedComparisons });
      fetchComparisons();
      setSelectedComparisons([]);
      setSelectAll(false);
      setAllPagesSelected(false);
    } catch (error) {
      console.error(`Error performing ${selectedAction} on comparisons:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIndividualAction = async (action, id) => {
    try {
      handleCloseModal();
      const responseUrl = `${process.env.REACT_APP_API_URL}/comparisons/${action}`;
      await axiosInstance.post(responseUrl, { comparison_ids: [id] });
      fetchComparisons();
    } catch (error) {
      console.error(`Error performing ${action} on comparison:`, error);
    }
  };

  const handleDownloadCSV = () => {
    const csvContent = generateComparisonsCSV(comparisons);

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'comparisons.csv');
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

  useEffect(() => {
    if (allPagesSelected) {
      document.body.classList.add('all-pages-selected');
    } else {
      document.body.classList.remove('all-pages-selected');
    }
  }, [allPagesSelected]);

  useEffect(() => {
    if (selectAll) {
      setSelectedComparisons(comparisons.map(comparison => comparison.comparison_id));
    }
  }, [selectAll, comparisons]);
  return (
    <div className="all-edits">
      <AllComparisonsFilter filters={filters} handleInputChange={handleInputChange} />
      <AllComparisonsActions
        selectedAction={selectedAction}
        selectedComparisons={selectedComparisons}
        handleActionSelect={handleActionSelect}
        handleConfirmAction={handleConfirmAction}
        handleDownloadCSV={handleDownloadCSV}
        isLoading={isLoading}
        handleShowConfirmation={allPagesSelected ? handleDeselectAllPages : handleShowConfirmation}
        isLoadingAllPages={isLoadingAllPages}
        allPagesSelected={allPagesSelected}
      />
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" checked={selectAll} onChange={handleSelectAllChange} /></th>
              <th className="table-sort-header" onClick={() => handleSort('book_name')}>
                <span>Book</span> <span className="sort-icon">{renderSortIcon('book_name')}</span>
              </th>
              <th className="table-sort-header" onClick={() => handleSort('page_number')}>
                <span>Page</span> <span className="sort-icon">{renderSortIcon('page_number')}</span>
                </th>
              <th className="table-sort-header" onClick={() => handleSort('hebrew_text')}>
                <span>Hebrew Text</span> <span className="sort-icon">{renderSortIcon('hebrew_text')}</span>
              </th>
              <th className="table-sort-header" onClick={() => handleSort('translation_one_text')}>
                <span>Translation One</span> <span className="sort-icon">{renderSortIcon('translation_one_text')}</span>
              </th>
              <th className="table-sort-header" onClick={() => handleSort('translation_two_text')}>
                <span>Translation Two</span> <span className="sort-icon">{renderSortIcon('translation_two_text')}</span>
              </th>
              <th className="table-sort-header" onClick={() => handleSort('rating')}>
                <span>Rating</span> <span className="sort-icon">{renderSortIcon('rating')}</span>
              </th>
              <th className="table-sort-header" onClick={() => handleSort('notes')}>
                <span>Notes</span> <span className="sort-icon">{renderSortIcon('notes')}</span>
              </th>
              <th className="table-sort-header" onClick={() => handleSort('version_name')}>
                <span>Version Name</span> <span className="sort-icon">{renderSortIcon('version_name')}</span>
              </th>
              <th className="table-sort-header" onClick={() => handleSort('status')}>
                <span>Status</span> <span className="sort-icon">{renderSortIcon('status')}</span>
              </th>
             
            </tr>
          </thead>
          <tbody>
            {comparisons.map(comparison => (
              <tr key={comparison.comparison_id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedComparisons.includes(comparison.comparison_id)}
                    onChange={() => handleCheckboxChange(comparison.comparison_id)}
                    className={allPagesSelected ? 'glowing-checkbox' : ''}
                  />
                </td>
                <td onClick={() => handleExpandClick(comparison)}>{comparison.book_name}</td>
                <td onClick={() => handleExpandClick(comparison)}>{comparison.page_number}</td>
                <td onClick={() => handleExpandClick(comparison)}>{comparison.hebrew_text}</td>
                <td onClick={() => handleExpandClick(comparison)}>{comparison.translation_one_text}</td>
                <td onClick={() => handleExpandClick(comparison)}>{comparison.translation_two_text}</td>
                <td onClick={() => handleExpandClick(comparison)}>{comparison.rating}</td>
                <td onClick={() => handleExpandClick(comparison)}>{comparison.notes}</td>
                <td onClick={() => handleExpandClick(comparison)}>{comparison.version_name}</td>
                <td onClick={() => handleExpandClick(comparison)}>{comparison.status}</td>
               
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

      {expandedComparison && (
        <AllComparisonsModal
          expandedComparison={expandedComparison}
          handleCloseModal={handleCloseModal}
          handleIndividualAction={handleIndividualAction}
        />
      )}

      {showConfirmation && (
        <ConfirmationModal
          message="Are you sure you want to select all pages?"
          onConfirm={handleConfirmSelectAllPages}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
};

export default AllComparisons;
             