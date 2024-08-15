import React from 'react';

const AllRatingsActions = ({ selectedAction, selectedRatings, handleActionSelect, handleConfirmAction, handleDownloadCSV, isLoading, handleShowConfirmation, isLoadingAllPages, allPagesSelected }) => (
  <div className="actions">
    <div className="select-and-action">
      <select onChange={handleActionSelect} value={selectedAction}>
        <option value="" disabled>Select action</option>
        <option value="view">Mark as Viewed</option>
        <option value="dismiss">Dismiss</option>
      </select>
      <button onClick={handleConfirmAction} disabled={isLoading || !selectedAction || selectedRatings.length === 0}>
        {isLoading ? <span className="spinner"></span> : 'Confirm Action'}
      </button>
      <button 
        className={`all-pages-button ${allPagesSelected ? 'selected' : ''}`} 
        onClick={handleShowConfirmation} 
        disabled={isLoadingAllPages}
      >
        {isLoadingAllPages ? <span className="spinner-for-button"></span> : allPagesSelected ? 'Deselect' : 'Select All Pages'}
      </button>
    </div>
    <button onClick={handleDownloadCSV}>Download CSV</button>
  </div>
);

export default AllRatingsActions;