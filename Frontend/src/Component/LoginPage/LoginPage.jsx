import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = ({ setUser }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', `Bearer ${data.token}`);
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
                navigate('/welcome', { state: { firstName: data.user.firstName } });
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Login failed');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Log in</h2>
                {error && <p className="error-message">{error}</p>}
                <div className="input-group">
                    <label className={formData.email ? 'filled' : ''}>Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email} onChange={handleChange} required
                    />
                </div>
                <div className="input-group">
                    <label className={formData.password ? 'filled' : ''}>Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password" value={formData.password} onChange={handleChange} required
                    />
                </div>
                <button type="submit" className="login-button">Log in</button>
                <p>Don't have an account?</p>
                <button type="button" onClick={() => navigate('/signup-step-1')} className="signup-button">Sign Up</button>
            </form>
        </div>
    );
};

export default LoginPage;
