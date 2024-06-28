import React, { useState } from 'react';
import './SignupPage.css';

const SignupPage = () => {
    const [userType, setUserType] = useState('student');
    const [formData, setFormData] = useState({
        userId: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        school: '',
        gpa: '',
        major: '',
        gender: '',
        raceEthnicity: '',
        technicalSkills: '',
        previousInternships: false,
        company: '',
        companyCulture: '',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className="signup-page">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>User Type:</label>
                    <select name="userType" value={userType} onChange={(e) => setUserType(e.target.value)}>
                        <option value="student">Student</option>
                        <option value="recruiter">Recruiter</option>
                    </select>
                </div>
                <div>
                    <label>First Name:</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div>
                    <label>Last Name:</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                </div>

                {userType === 'student' && (
                    <>
                        <div>
                            <label>School:</label>
                            <input type="text" name="school" value={formData.school} onChange={handleChange} />
                        </div>
                        <div>
                            <label>GPA:</label>
                            <select name="gpa" value={formData.gpa} onChange={handleChange} placeholder="Optional">
                                <option value="">Select GPA</option>
                                <option value="3.5-4.0">3.5 - 4.0</option>
                                <option value="3.0-3.49">3.0 - 3.49</option>
                                <option value="2.5-2.99">2.5 - 2.99</option>
                                <option value="2.0-2.49">2.0 - 2.49</option>
                                <option value="1.5-1.99">1.5 - 1.99</option>
                                <option value="1.0-1.49">1.0 - 1.49</option>
                                <option value="0.0-0.99">0.0 - 0.99</option>

                            </select>
                        </div>
                        <div>
                            <label>Major:</label>
                            <select name="major" value={formData.major} onChange={handleChange} required>
                                <option value="">Select Major</option>
                                <option value="artificialIntelligence">Artificial Intelligence</option>
                                <option value="computerScience">Computer Science</option>
                                <option value="computerEngineering">Computer Engineering</option>
                                <option value="cyberSecurity">Cyber Security</option>
                                <option value="dataScience">Data Science</option>
                                <option value="informationTechnology">Information Technology</option>
                                <option value="softwareengineering">Software Engineering</option>
                                <option value="webDevelopment">Web Development</option>

                            </select>
                        </div>
                        <div>
                            <label>Gender:</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} required>
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label>Race/Ethnicity:</label>
                            <select name="raceEthnicity" value={formData.raceEthnicity} onChange={handleChange} required>
                                <option value="">Select Race/Ethnicity</option>
                                <option value="americanidianoralaskanative(nothispanicorlatino)">American Indian or Alaska Native(not Hispanic or Latino)</option>
                                <option value="asian(nothispanicorlatino)">Asian(not Hispanic or Latino)</option>
                                <option value="blackorafricanamerican(nothispanicorlatino)">Black or African American(not Hispanic or Latino)</option>
                                <option value="hispanicorlatino">Hispanic or Latino</option>
                                <option value="white">White</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label>
                                Previous Internships:
                                <input type="checkbox" name="previousInternships" checked={formData.previousInternships} onChange={handleChange} />
                            </label>
                        </div>
                    </>
                )}
                {userType === 'recruiter' && (
                    <>
                        <div>
                            <label>Company:</label>
                            <input type="text" name="company" value={formData.company} onChange={handleChange} />
                        </div>
                        <div>
                            <label>Company Culture:</label>
                            <input type="text" name="companyCulture" value={formData.companyCulture} onChange={handleChange} />
                        </div>
                    </>
                )}
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignupPage;
