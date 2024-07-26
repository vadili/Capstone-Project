import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { firstName } = location.state || { firstName: 'User' };

    useEffect(() => {
        setLoading(true);
        const timer1 = setTimeout(() => {
            setLoading(false);
        }, 5000);

        const timer2 = setTimeout(() => {
            navigate('/dashboard');
        }, 10000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [navigate]);

    return (
        <>
            {loading && <div className='glimmer-overlay'></div>}
            <div className="welcome-screen">
                <h1>Welcome to TechLink,</h1>
                <h2>Hi, {firstName}!</h2>
                <p>You are one step closer to achieving your goals!</p>
            </div>
        </>
    );
};

export default Welcome;
