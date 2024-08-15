import React from 'react';

const AllComparisonsFilter = ({ filters, handleInputChange }) => (
  <div className="filters">
    <input
      type="text"
      name="translation_one_id"
      placeholder="Translation One ID"
      value={filters.translation_one_id}
      onChange={handleInputChange}
    />
    <input
      type="text"
      name="translation_two_id"
      placeholder="Translation Two ID"
      value={filters.translation_two_id}
      onChange={handleInputChange}
    />
    <input
      type="text"
      name="version_name"
      placeholder="Version Name"
      value={filters.version_name}
      onChange={handleInputChange}
    />
    <select
      name="status"
      value={filters.status}
      onChange={handleInputChange}
    >
      <option value="all">All</option>
      <option value="pending">Pending</option>
      <option value="approved">Approved</option>
      <option value="rejected">Rejected</option>
    </select>
  </div>
);

export default AllComparisonsFilter;