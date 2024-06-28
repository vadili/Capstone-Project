import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/dashboard');
    };

    return (
        <div className="login-page">
            <h2>Log in</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="email" required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" required />
                </div>
                <button type="submit">Log in</button>
            </form>
            <p>Don't have an account?</p>
            <button onClick={() => navigate('/signup')}>Sign Up</button>
        </div >
    );
};

export default LoginPage;
