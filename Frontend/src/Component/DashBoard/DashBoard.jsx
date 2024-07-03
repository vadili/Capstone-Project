import React, { useEffect, useState } from 'react';
import './DashBoard.css';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const DashBoard = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');

    useEffect(() => {
        const fetchFirstName = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3001/api/user', {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json',
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setFirstName(data.firstName);
                } else {
                    console.error('Error fetching user data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchFirstName();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="dashboard">
            <Header />
            <main className="main-content">
                <h1>Welcome to TechLink</h1>
                <p>Hi, {firstName}!</p>
                <p>You are one step closer to achieving your goals!</p>
            </main>
            <Footer />
        </div>
    );
};

export default DashBoard;
