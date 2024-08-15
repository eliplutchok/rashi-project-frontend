import React, { useState, useEffect } from 'react';
import useEdits from '../hooks/useEdits';
import { generateEditsCSV } from '../utils/adminUtils';
import axiosInstance from '../utils/axiosInstance';
import AllEditsFilter from './AllEditsFilter';
import AllEditsActions from './AllEditsActions';
import AllEditsModal from './AllEditsModal';
import ConfirmationModal from './ConfirmationModal';
import '../css/AllEdits.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';

const AllEdits = () => {
  const [filters, setFilters] = useState({ book: '', page_number: '', status: 'proposed', username: '', version_name: '' });
  const [expandedEdit, setExpandedEdit] = useState(null);
  const [selectedEdits, setSelectedEdits] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAction, setSelectedAction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAllPages, setIsLoadingAllPages] = useState(false);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showConfirmActionModal, setShowConfirmActionModal] = useState(false);
  const [allPagesSelected, setAllPagesSelected] = useState(false);

  const { edits, totalPages, fetchEdits, isLoading: editsLoading } = useEdits(filters, currentPage, sortField, sortOrder);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleExpandClick = (edit) => {
    setExpandedEdit(edit);
  };

  const handleCloseModal = () => {
    setExpandedEdit(null);
  };

  const handleCheckboxChange = (id) => {
    setSelectedEdits((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter(editId => editId !== id) : [...prevSelected, id]
    );
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedEdits([]);
      setAllPagesSelected(false);
    } else {
      setSelectedEdits(edits.map(edit => edit.translation_id));
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
      const responseUrl = `${process.env.REACT_APP_API_URL}/allEdits`;
      const response = await axiosInstance.get(responseUrl, { params: { ...filters, fetchAll: true } });
      const allEdits = response.data.edits.map(edit => edit.translation_id);
      setSelectedEdits(allEdits);
      setAllPagesSelected(true);
    } catch (error) {
      console.error('Error selecting all pages:', error);
    } finally {
      setIsLoadingAllPages(false);
    }
  };

  const handleDeselectAllPages = () => {
    setSelectedEdits([]);
    setAllPagesSelected(false);
  };

  const handleActionSelect = (e) => {
    setSelectedAction(e.target.value);
  };

  const handleShowConfirmActionModal = () => {
    setShowConfirmActionModal(true);
  };

  const handleConfirmAction = async () => {
    if (selectedEdits.length === 0 || !selectedAction) return;
    setIsLoading(true);
    setShowConfirmActionModal(false);
    try {
      const responseUrl = `${process.env.REACT_APP_API_URL}/edits/${selectedAction}`;
      await axiosInstance.post(responseUrl, { translation_ids: selectedEdits });
      fetchEdits();
      setSelectedEdits([]);
      setSelectAll(false);
      setAllPagesSelected(false);
    } catch (error) {
      console.error(`Error performing ${selectedAction} on edits:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIndividualAction = async (action, id) => {
    try {
      const responseUrl = `${process.env.REACT_APP_API_URL}/edits/${action}`;
      await axiosInstance.post(responseUrl, { translation_ids: [id] });
      fetchEdits();
      handleCloseModal();
    } catch (error) {
      console.error(`Error performing ${action} on edit:`, error);
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const responseUrl = `${process.env.REACT_APP_API_URL}/allEdits`;
      const response = await axiosInstance.get(responseUrl, { params: { ...filters, fetchAll: true } });
      const allEdits = response.data.edits;
      const csvContent = generateEditsCSV(allEdits);

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'edits.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
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

  return (
    <div className="all-edits">
      <AllEditsFilter filters={filters} handleInputChange={handleInputChange} />
      <AllEditsActions
        selectedAction={selectedAction}
        selectedEdits={selectedEdits}
        handleActionSelect={handleActionSelect}
        handleConfirmAction={handleShowConfirmActionModal}
        handleDownloadCSV={handleDownloadCSV}
        isLoading={isLoading}
        handleShowConfirmation={allPagesSelected ? handleDeselectAllPages : handleShowConfirmation}
        isLoadingAllPages={isLoadingAllPages}
        allPagesSelected={allPagesSelected}
      />
      <div className="table-wrapper">
        {isLoading || editsLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : (
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
                  <span>Passage</span> <span className="sort-icon">{renderSortIcon('hebrew_text')}</span>
                </th>
                <th className="table-sort-header" onClick={() => handleSort('text')}>
                  <span>Translation</span> <span className="sort-icon">{renderSortIcon('text')}</span>
                </th>
                <th className="table-sort-header" onClick={() => handleSort('notes')}>
                  <span>Notes</span> <span className="sort-icon">{renderSortIcon('notes')}</span>
                </th>
                <th className="table-sort-header" onClick={() => handleSort('creation_date')}>
                  <span>Creation Date</span> <span className="sort-icon">{renderSortIcon('creation_date')}</span>
                </th>
                <th className="table-sort-header" onClick={() => handleSort('status')}>
                  <span>Status</span> <span className="sort-icon">{renderSortIcon('status')}</span>
                </th>
                <th className="table-sort-header" onClick={() => handleSort('username')}>
                  <span>Username</span> <span className="sort-icon">{renderSortIcon('username')}</span>
                </th>
                <th className="table-sort-header" onClick={() => handleSort('version_name')}>
                  <span>Version Name</span> <span className="sort-icon">{renderSortIcon('version_name')}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {edits.map(edit => (
                <tr key={edit.translation_id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedEdits.includes(edit.translation_id)}
                      onChange={() => handleCheckboxChange(edit.translation_id)}
                      className={allPagesSelected ? 'glowing-checkbox' : ''}
                    />
                  </td>
                  <td onClick={() => handleExpandClick(edit)}>{edit.book_name}</td>
                  <td onClick={() => handleExpandClick(edit)}>{edit.page_number}</td>
                  <td onClick={() => handleExpandClick(edit)}><span dangerouslySetInnerHTML={{ __html: edit.hebrew_text }} /></td>
                  <td
                    className={expandedEdit && expandedEdit.translation_id === edit.translation_id ? 'expanded-text' : 'truncated-text'}
                    onClick={() => handleExpandClick(edit)}
                  >
                    {edit.text}
                  </td>
                  <td onClick={() => handleExpandClick(edit)}>{edit.notes}</td>
                  <td onClick={() => handleExpandClick(edit)}>{new Date(edit.creation_date).toLocaleString()}</td>
                  <td onClick={() => handleExpandClick(edit)}>{edit.status}</td>
                  <td onClick={() => handleExpandClick(edit)}>{edit.username}</td>
                  <td onClick={() => handleExpandClick(edit)}>{edit.version_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="pagination">
        <button onClick={() => handlePageChange('prev')} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => handlePageChange('next')} disabled={currentPage === totalPages}>Next</button>
      </div>

      {expandedEdit && (
        <AllEditsModal
          expandedEdit={expandedEdit}
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

      {showConfirmActionModal && (
        <ConfirmationModal
          message={`Are you sure you want to ${selectedAction} the selected edits?`}
          onConfirm={handleConfirmAction}
          onCancel={() => setShowConfirmActionModal(false)}
        />
      )}
    </div>
  );
};

export default AllEdits;