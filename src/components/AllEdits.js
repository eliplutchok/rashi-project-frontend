import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from './axiosInstance';
import '../css/AllEdits.css';

const AllEdits = () => {
  const [edits, setEdits] = useState([]);
  const [filters, setFilters] = useState({ book: '', page_number: '', status: 'proposed', username: '' });
  const [expandedEdit, setExpandedEdit] = useState(null);
  const [selectedEdits, setSelectedEdits] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAction, setSelectedAction] = useState('');

  const fetchEdits = useCallback(async () => {
    try {
      const responseUrl = `${process.env.REACT_APP_API_URL}/allEdits`;
      let filters_copy = { ...filters, currentPage, limit: 20 };
      Object.keys(filters_copy).forEach(key => {
        if (filters_copy[key] === '') {
          delete filters_copy[key];
        }
      });
      const response = await axiosInstance.get(responseUrl, { params: filters_copy });
      setEdits(response.data.edits);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching edits:', error);
    }
  }, [filters, currentPage]);

  useEffect(() => {
    fetchEdits();
  }, [fetchEdits]);

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
    try {
      const responseUrl = `${process.env.REACT_APP_API_URL}/edits/${selectedAction}`;
      await axiosInstance.post(responseUrl, { translation_ids: selectedEdits });
      fetchEdits();
      setSelectedEdits([]);
      setSelectAll(false);
    } catch (error) {
      console.error(`Error performing ${selectedAction} on edits:`, error);
    }
  };

  const handleIndividualAction = async (action, id) => {
    try {
      const responseUrl = `${process.env.REACT_APP_API_URL}/edits/${action}`;
      await axiosInstance.post(responseUrl, { translation_ids: [id] });
      fetchEdits();
    } catch (error) {
      console.error(`Error performing ${action} on edit:`, error);
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const responseUrl = `${process.env.REACT_APP_API_URL}/allEdits`;
      const response = await axiosInstance.get(responseUrl, { params: { ...filters, fetchAll: true } });
      const allEdits = response.data.edits;
  
      const csvContent = [
        ['book_name', 'page_number', 'hebrew_text', 'text', 'notes', 'creation_date', 'status', 'username', 'translation_id'],
        ...allEdits.map(edit => [
          edit.book_name,
          edit.page_number,
          edit.hebrew_text,
          edit.text,
          edit.notes,
          new Date(edit.creation_date).toLocaleString(),
          edit.status,
          edit.username,
          edit.translation_id
        ].map(field => `"${String(field).replace(/"/g, '""')}"`)) // Wrap each field in double quotes and escape existing double quotes
      ]
        .map(e => e.join(','))
        .join('\n');
  
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

  return (
    <div className="all-edits">
      <div className="filters">
        <input
          type="text"
          name="book"
          placeholder="Book"
          value={filters.book}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="page_number"
          placeholder="Page"
          value={filters.page_number}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={filters.username}
          onChange={handleInputChange}
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleInputChange}
        >
          <option value="proposed">Proposed</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="published">Published</option>
          <option value="rejected">Rejected</option>
          <option value="all">All</option>
        </select>
      </div>
      <div className="actions">
        <div className="select-and-action">
            <select onChange={handleActionSelect} value={selectedAction}>
            <option value="" disabled>Select action</option>
            <option value="approve">Approve</option>
            <option value="reject">Reject</option>
            <option value="publish">Publish</option>
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
                <th>Book</th>
                <th>Page</th>
                <th>Passage</th>
                <th>Translation</th>
                <th>Notes</th>
                <th>Creation Date</th>
                <th>Status</th>
                <th>Username</th>
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
                <td>{edit.book_name}</td>
                <td>{edit.page_number}</td>
                <td><span dangerouslySetInnerHTML={{ __html: edit.hebrew_text }} /></td>
                <td
                    className={expandedEdit && expandedEdit.translation_id === edit.translation_id ? 'expanded-text' : 'truncated-text'}
                    onClick={() => handleExpandClick(edit)}
                >
                    {edit.text}
                </td>
                <td>{edit.notes}</td>
                <td>{new Date(edit.creation_date).toLocaleString()}</td>
                <td>{edit.status}</td>
                <td>{edit.username}</td>
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
        <div className="modal">
            <div className="modal-content">
            <button className="close-button" onClick={handleCloseModal}>Close</button>
            <div className="modal-details">
                <div className="detail-row">
                <span className="detail-title">Book:</span>
                <span className="detail-value">{expandedEdit.book_name}</span>
                </div>
                <div className="detail-row">
                <span className="detail-title">Page:</span>
                <span className="detail-value">{expandedEdit.page_number}</span>
                </div>
                <div className="detail-row">
                <span className="detail-title">Passage:</span>
                <span className="detail-value" dangerouslySetInnerHTML={{ __html: expandedEdit.hebrew_text }} />
                </div>
                <div className="detail-row">
                <span className="detail-title">Translation:</span>
                <span className="detail-value">{expandedEdit.text}</span>
                </div>
                <div className="detail-row">
                <span className="detail-title">Notes:</span>
                <span className="detail-value">{expandedEdit.notes}</span>
                </div>
                <div className="detail-row">
                <span className="detail-title">Creation Date:</span>
                <span className="detail-value">{new Date(expandedEdit.creation_date).toLocaleString()}</span>
                </div>
                <div className="detail-row">
                <span className="detail-title">Status:</span>
                <span className="detail-value">{expandedEdit.status}</span>
                </div>
                <div className="detail-row">
                <span className="detail-title">Username:</span>
                <span className="detail-value">{expandedEdit.username}</span>
                </div>
            </div>
            <div className="button-group">
                <button onClick={() => handleIndividualAction('approve', expandedEdit.translation_id)}>Approve</button>
                <button onClick={() => handleIndividualAction('reject', expandedEdit.translation_id)}>Reject</button>
                <button onClick={() => handleIndividualAction('publish', expandedEdit.translation_id)}>Publish</button>
            </div>
            <a
                href={`/page/${expandedEdit.book_name}/${expandedEdit.page_number}?passageId=${expandedEdit.passage_id}`}
                className="page-link"
            >
                Go to Passage
            </a>
            </div>
        </div>
        )}
    </div>
  );
};

export default AllEdits;