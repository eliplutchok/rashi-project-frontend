import React from 'react';

const HeaderNavigation = ({ page, handleNextPage, handlePreviousPage }) => (
  <div className="fixed-page-butn">
    <button onClick={handleNextPage}>&#8249;</button>
    <div className="page-butn-div">{page}</div>
    <button onClick={handlePreviousPage}>&#8250;</button>
    
  </div>
);

export default HeaderNavigation;