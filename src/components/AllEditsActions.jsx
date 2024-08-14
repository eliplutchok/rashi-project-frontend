import React from 'react';

const AllEditsActions = ({ selectedAction, handleActionSelect, handleConfirmAction, handleDownloadCSV, isLoading }) => (
  <div className="actions">
    <div className="select-and-action">
      <select onChange={handleActionSelect} value={selectedAction}>
        <option value="" disabled>Select action</option>
        <option value="approve">Approve</option>
        <option value="reject">Reject</option>
        <option value="publish">Publish</option>
      </select>
      <button onClick={handleConfirmAction}>
      {isLoading ? <span className="spinner"></span> : 'Confirm Action'}
      </button>
    </div>
    <button onClick={handleDownloadCSV}>Download CSV</button>
  </div>
);

export default AllEditsActions;