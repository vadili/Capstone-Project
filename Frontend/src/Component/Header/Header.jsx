import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';


const Header = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    return (
        <header className="header fixed-header">
            <div className="header-left">
                <div className="logo" onClick={() => navigate('/dashboard')}>TechLink</div>
                <input type="text" placeholder="Search internships..." className="search-bar" />
            </div>
            <div className="nav-icons">
                <i className="fa-solid fa-bars icon menu-icon" onClick={toggleMenu}></i>
                {showMenu && (
                    <div className="dropdown-menu">
                        <div onClick={() => navigate('/create-internship')}>Create New Internship</div>
                    </div>
                )}
                <i className="fa-solid fa-bell icon announcement-icon"></i>
                <i className="fa-solid fa-user icon profile-icon" onClick={() => navigate('/profile')}></i>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
        </header>
    );
};

export default Header;
