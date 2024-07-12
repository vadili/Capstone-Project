import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ showSavedInternships, showLikedInternships }) => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState("")
    const [userData, setUserData] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const toggleMenu = () => {
        setShowMenu(prev => !prev);

    };

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/notifications', {
                    headers: {
                        'Authorization': `${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data);
                    setUnreadCount(data.length);
                } else {
                    console.error('Error fetching notifications:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();

        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3001/api/user', {
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                } else {
                    console.error('Error fetching user data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);

            }
        };

        fetchUserData();
    }, []);

    return (
        <header className="header fixed-header">
            <div className="header-left">
                <div className="logo" onClick={() => navigate('/dashboard')}>TechLink</div>
            </div>
            <div className="nav-icons">
                <i className="fa-solid fa-bars icon menu-icon" onClick={toggleMenu}></i>
                {showMenu &&
                    <div className="dropdown-menu">
                        <div className='dropdown-container'>
                            {userData.userType === 'student' && (
                                <>
                                    <div className='dropdown-item' onClick={showSavedInternships}>Saved Internships</div>
                                    <div className='dropdown-item' onClick={showLikedInternships}>Liked Internships</div>
                                </>
                            )}
                            {userData.userType === 'recruiter' && (
                                <div className='dropdown-item' onClick={() => navigate('/create-internship')}>Create New Internship</div>
                            )}
                        </div>
                    </div>
                }
                <i className="fa-solid fa-bell icon announcement-icon" onClick={() => navigate('/notifications')}>
                    {unreadCount > 0 && <span className="notification-badge">+ {unreadCount}</span>}
                </i>
                <i className="fa-solid fa-user icon profile-icon" onClick={() => navigate('/profile')}></i>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
        </header>
    );
};

export default Header;
