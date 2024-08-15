import React from 'react';

const AllComparisonsActions = ({ selectedAction, selectedComparisons, handleActionSelect, handleConfirmAction, handleDownloadCSV, isLoading, handleShowConfirmation, isLoadingAllPages, allPagesSelected }) => (
  <div className="actions">
    <div className="select-and-action">
      <select onChange={handleActionSelect} value={selectedAction}>
        <option value="" disabled>Select action</option>
        <option value="approve">Approve</option>
        <option value="reject">Reject</option>
      </select>
      <button onClick={handleConfirmAction} disabled={!selectedAction || selectedComparisons.length === 0 || isLoading}>
        {isLoading ? <span className="spinner"></span> : 'Confirm Action'}
      </button>
      <button 
        className={`all-pages-button ${allPagesSelected ? 'selected' : ''}`} 
        onClick={handleShowConfirmation} 
        disabled={isLoadingAllPages}
      >
        {isLoadingAllPages ? <span className="spinner"></span> : allPagesSelected ? 'Deselect' : 'Select All Pages'}
      </button>
    </div>
    <button onClick={handleDownloadCSV}>Download CSV</button>
  </div>
);

export default AllComparisonsActions;