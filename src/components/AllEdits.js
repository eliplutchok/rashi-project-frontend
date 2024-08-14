import React, { useState, useEffect } from 'react';
import useEdits from '../hooks/useEdits';
import { generateEditsCSV } from '../utils/adminUtils';
import axiosInstance from '../utils/axiosInstance';
import AllEditsFilter from './AllEditsFilter';
import AllEditsActions from './AllEditsActions';
import AllEditsModal from './AllEditsModal';
import '../css/AllEdits.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';

const AllEdits = () => {
  const [filters, setFilters] = useState({ book: '', page_number: '', status: 'proposed', username: '' });
  const [expandedEdit, setExpandedEdit] = useState(null);
  const [selectedEdits, setSelectedEdits] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAction, setSelectedAction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const { edits, totalPages, fetchEdits } = useEdits(filters, currentPage, sortField, sortOrder);

  useEffect(() => {
    const table = document.querySelector('table');
    const cols = table.querySelectorAll('th');
    let startX, startWidth;

    const initResize = (e) => {
      startX = e.clientX;
      startWidth = parseInt(document.defaultView.getComputedStyle(e.target.parentElement).width, 10);
      document.documentElement.addEventListener('mousemove', doResize, false);
      document.documentElement.addEventListener('mouseup', stopResize, false);
    };

    const doResize = (e) => {
      e.target.parentElement.style.width = (startWidth + e.clientX - startX) + 'px';
    };

    const stopResize = () => {
      document.documentElement.removeEventListener('mousemove', doResize, false);
      document.documentElement.removeEventListener('mouseup', stopResize, false);
    };

    cols.forEach((col) => {
      const resizer = document.createElement('div');
      resizer.className = 'resizer';
      col.appendChild(resizer);
      resizer.addEventListener('mousedown', initResize, false);
    });
  }, []);

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
    } else {
      setSelectedEdits(edits.map(edit => edit.translation_id));
    }
    setSelectAll(!selectAll);
  };

  const handleActionSelect = (e) => {
    setSelectedAction(e.target.value);
  };

  const handleConfirmAction = async () => {
    if (selectedEdits.length === 0 || !selectedAction) return;
    setIsLoading(true);
    try {
      const responseUrl = `${process.env.REACT_APP_API_URL}/edits/${selectedAction}`;
      await axiosInstance.post(responseUrl, { translation_ids: selectedEdits });
      fetchEdits();
      setSelectedEdits([]);
      setSelectAll(false);
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

  return (
    <div className="all-edits">
      <AllEditsFilter filters={filters} handleInputChange={handleInputChange} />
      <AllEditsActions
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

      {expandedEdit && (
        <AllEditsModal
          expandedEdit={expandedEdit}
          handleCloseModal={handleCloseModal}
          handleIndividualAction={handleIndividualAction}
        />
      )}
    </div>
  );
};

export default AllEdits;