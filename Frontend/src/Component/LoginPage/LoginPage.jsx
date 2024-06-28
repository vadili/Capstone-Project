import React from 'react';
import './LoginPage.css';

const LoginPage = () => {

    return (
        <div className="login-page">
            <h2>Log in</h2>
            <form>
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
            <button ><a href="/signup"> Sign up</a></button>
        </div >
    );
};

export default LoginPage;
