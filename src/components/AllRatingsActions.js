import React from 'react';

const AllRatingsActions = ({ selectedAction, handleActionSelect, handleConfirmAction, handleDownloadCSV, isLoading }) => (
  <div className="actions">
    <div className="select-and-action">
      <select onChange={handleActionSelect} value={selectedAction}>
        <option value="" disabled>Select action</option>
        <option value="view">Mark as Viewed</option>
        <option value="dismiss">Dismiss</option>
      </select>
      <button onClick={handleConfirmAction} disabled={isLoading}>
        {isLoading ? <span className="spinner"></span> : 'Confirm Action'}
      </button>
    </div>
    <button onClick={handleDownloadCSV}>Download CSV</button>
  </div>
);

export default AllRatingsActions;