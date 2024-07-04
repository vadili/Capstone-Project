import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { firstName } = location.state || { firstName: 'User' };

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/dashboard');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="welcome-screen">
            <h1>Welcome to TechLink,</h1>
            <h2>Hi, {firstName}!</h2>
            <p>You are one step closer to achieving your goals!</p>
        </div>
    );
};

export default Welcome;
