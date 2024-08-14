import React from 'react';

const AllRatingsFilter = ({ filters, handleInputChange }) => (
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
);

export default AllRatingsFilter;