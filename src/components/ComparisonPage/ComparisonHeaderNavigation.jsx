import React, {useContext} from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const HeaderNavigation = ({ page, handleNextPage, handlePreviousPage }) => {
  const { isDarkMode } = useContext(ThemeContext);


  return(
  <div className={`fixed-page-butn ${isDarkMode ? 'dark-mode' : ''}`}>
    <button onClick={handleNextPage}>&#8249;</button>
    <div className="page-butn-div">{page}</div>
    <button onClick={handlePreviousPage}>&#8250;</button>
    
  </div>
)};

export default HeaderNavigation;