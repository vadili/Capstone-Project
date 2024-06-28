import React, { useEffect, useState } from 'react';
import './DashBoard.css';
import { Navigate, useNavigate } from 'react-router-dom';

const DashBoard = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');

    useEffect(() => {
        const fetchFirstName = async () => {
            try {
                const response = await fetch('/api/user');
                const data = await response.json();
                setFirstName(data.firstName);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchFirstName();
    }, []);

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="logo">TechLink</div>
                <nav className="nav-bar">
                    <div className="menu-icon">
                        <img src="/icons/menu.svg" alt="Menu" />
                        <div className="dropdown-menu">
                            <a href="/profile">Profile</a>
                            <a href="/settings">Settings</a>
                        </div>
                    </div>
                    <div className="announcement-icon">
                        <img src="/icons/announcement.svg" alt="Announcements" />
                    </div>
                    <div className="profile-icon">
                        <img src="/icons/profile.svg" alt="Profile" />
                    </div>
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                </nav>
            </header>
            <main className="dashboard-content">
                <div className="welcome-message">
                    <h1>Welcome to TechLink</h1>
                    <h2>Hi, {firstName}</h2>
                    <p>You are one step closer to achieving your goals!</p>
                </div>
            </main>
            <footer className="dashboard-footer">
                <div className="footer-info">
                    <div className="address">
                        <p>Contact Us:</p>
                        <address>
                            2983 Ocala Ct, San Jose, CA
                            <br />
                            Email: techlink@gmail.com
                            <br />
                            Phone: (806) 471-4304
                        </address>
                    </div>
                    <div className="social-links">
                        <a href="https://instagram.com">Instagram</a>
                        <a href="https://linkedin.com">LinkedIn</a>
                        <a href="https://facebook.com">Facebook</a>
                    </div>
                    <div className="footer-links">
                        <a href="/privacy-policy">Privacy Policy</a>
                        <a href="/terms-of-service">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default DashBoard;
