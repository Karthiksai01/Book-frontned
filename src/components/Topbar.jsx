import React from 'react';

const Topbar = () => {
    return (
        <header className="topbar">
            <div className="search-bar">
                <input type="text" placeholder="Search..." />
            </div>
            <div className="topbar-actions">
                <button className="action-btn">Notifications</button>
                <button className="action-btn">Help</button>
            </div>
        </header>
    );
};

export default Topbar;
