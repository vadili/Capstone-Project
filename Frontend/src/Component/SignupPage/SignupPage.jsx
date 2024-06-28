import React from 'react';
import './SignupPage.css';

const SignupPage = () => {
    return (
        <div className="signup-page">
            <h2>Sign Up</h2>
            <form>
                <div>
                    <label>Name:</label>
                    <input type="text" required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" required />
                </div>
                <div>
                    <label>Role:</label>
                    <select required>
                        <option value="student">Student</option>
                        <option value="recruiter">Recruiter</option>
                    </select>
                </div>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignupPage;
