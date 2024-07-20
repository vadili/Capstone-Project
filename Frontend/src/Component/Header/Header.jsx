import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import './Header.css';
import Logo from '../../assets/logo.png'
import { NotificationContext } from '../../App';

const Header = ({ showSavedInternships, showLikedInternships }) => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [notifications, setNotifications] = useContext(NotificationContext);
    const [userData, setUserData] = useState(null);
    const socket = useRef(null);

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
                } else {
                    console.error('Error fetching notifications:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

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

        fetchNotifications();
        fetchUserData();

        socket.current = io("http://localhost:3001", {
            withCredentials: true,
        });

        socket.current.on("announcement", () => {
            fetchNotifications()
        });

        return () => {
            socket.current.off("announcement");
            socket.current.disconnect();
        };
    }, []);

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <div className="header-left">
                    <div className="logo" onClick={() => navigate('/dashboard')}><img src={Logo}></img></div>
                </div>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarScroll">
                    <div className="nav-icons ms-auto">
                        <i className="fa-solid fa-bars icon menu-icon dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"></i>
                        <div className="dropdown-menu">
                            <div className='dropdown-container'>
                                {userData && userData.userType === 'student' && (
                                    <>
                                        <div className='dropdown-item' onClick={showSavedInternships}>Saved Internships</div>
                                        <div className='dropdown-item' onClick={showLikedInternships}>Liked Internships</div>
                                    </>
                                )}
                                {userData && userData.userType === 'recruiter' && (
                                    <>
                                        <div className='dropdown-item' onClick={() => navigate('/create-internship')}>Create New Internship</div>
                                        <div className='dropdown-item' onClick={() => navigate('/recruiter/internships')}>Created Internship</div>
                                    </>
                                )}
                            </div>
                        </div>
                        <i className="fa-solid fa-bell icon announcement-icon" onClick={() => navigate('/notifications')}>
                            {notifications.length > 0 && <span className="notification-badge">+ {notifications.length}</span>}
                        </i>
                        <i className="fa-solid fa-user icon profile-icon" onClick={() => navigate('/profile')}></i>
                        <button className="logout-button" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
