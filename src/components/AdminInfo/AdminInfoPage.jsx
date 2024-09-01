import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

import './AdminInfoPage.css';
import './AdminInfoPage-Dark.css';

const AdminInfoPage = () => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    return (
        <div className={`admin-info-container ${isDarkMode ? 'dark-mode' : ''}`}>
            {/* <button 
          className="dark-mode-button"
          onClick={toggleTheme}
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
        </button> */}
            <h1 className="admin-info-title">Admin Overview</h1>
            <section className="admin-info-section">
                <h2>Current Capabilities</h2>
                <div className="admin-info-content">
                    <h3>Manage Edits</h3>
                    <p>Admins have the ability to view all submitted edits. They can take various actions, including:</p>
                    <ul>
                        <li>Approve Edits</li>
                        <li>Reject Edits</li>
                        <li>Publish Edits</li>
                        <li>Mass Actions: Select multiple edits and apply actions simultaneously</li>
                    </ul>

                    <h3>Manage Ratings</h3>
                    <p>Admins can view all user-submitted ratings. Available actions include:</p>
                    <ul>
                        <li>View Ratings</li>
                        <li>Dismiss Ratings</li>
                    </ul>

                    <h3>Manage Comparisons</h3>
                    <p>Admins can view all comparisons submitted by users. Available actions include:</p>
                    <ul>
                        <li>View Comparisons</li>
                        <li>Dismiss Comparisons</li>
                    </ul>

                    <h3>Sorting and Filtering</h3>
                    <p>Admins can sort and filter edits, ratings, and comparisons based on various criteria to streamline their workflow.</p>
                </div>
            </section>

            <section className="admin-info-section">
                <h2>Upcoming Features</h2>
                <div className="admin-info-content">
                    <h3>Admin Logs</h3>
                    <p>A comprehensive log of all actions taken by each admin will be introduced. This feature will provide transparency and accountability.</p>

                    <h3>User Approval</h3>
                    <p>Admins may soon have the ability to approve new users, ensuring only authorized individuals gain access to certain features of the platform.</p>

                    <h3>Additional Enhancements</h3>
                    <p>Further enhancements to the admin capabilities are being planned to improve the management of the platform.</p>
                </div>
            </section>
        </div>
    );
};

export default AdminInfoPage;