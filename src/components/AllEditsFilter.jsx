import React from 'react';

const AllEditsFilter = ({ filters, handleInputChange }) => (
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
);

export default AllEditsFilter;