import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ showSavedInternships, showLikedInternships }) => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/notifications', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUnreadCount(data.length);
                } else {
                    console.error('Error fetching notifications:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchUnreadCount();
    }, []);

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
                        <div onClick={showSavedInternships}>Saved Internships</div>
                        <div onClick={showLikedInternships}>Liked Internships</div>
                        <div onClick={() => navigate('/create-internship')}>Create New Internship</div>
                    </div>
                )}
                <i className="fa-solid fa-bell icon announcement-icon" onClick={() => navigate('/notifications')}>
                    {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                </i>
                <i className="fa-solid fa-user icon profile-icon" onClick={() => navigate('/profile')}></i>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
        </header>
    );
};

export default Header;
