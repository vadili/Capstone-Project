import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="header-left">
                <div className="logo" onClick={() => navigate('/')}>TechLive</div>
                <input type="text" placeholder="Search internships..." className="search-bar" />
            </div>
            <div className="nav-icons">
                <img src="/path/to/profile-icon.png" alt="Profile" className="icon" onClick={() => navigate('/profile')} />
                <button className="logout-button" onClick={handleLogout}>Logout</button>
                <img src="/path/to/menu-icon.png" alt="Menu" className="icon" />
                <img src="/path/to/announcement-icon.png" alt="Announcements" className="icon" />
            </div>
        </header>
    );
};

export default Header;
