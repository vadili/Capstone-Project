import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import './SignupPage.css';

const SignupPage = () => {
    const [userType, setUserType] = useState('student');
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        userType: 'student',
        school: '',
        gpa: '',
        major: '',
        gender: '',
        raceEthnicity: '',
        technicalSkills: {
            programmingLanguages: [],
            frameworksLibraries: [],
            databases: [],
        },
        previousInternships: false,
        company: '',
        companyCulture: '',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith('technicalSkills.')) {
            const skillType = name.split('.')[1];
            const newSkills = checked
                ? [...formData.technicalSkills[skillType], value]
                : formData.technicalSkills[skillType].filter(skill => skill !== value);
            setFormData({
                ...formData,
                technicalSkills: {
                    ...formData.technicalSkills,
                    [skillType]: newSkills,
                },
            });
        } else {
            setFormData({
                ...formData,
                [name]: type === 'checkbox' ? checked : value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!!");
            return;
        }
        try {
            const response = await fetch('http://localhost:3001/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            navigate('/dashboard')
        } catch (error) {
            console.error('Error signing up', error);
        }
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
                            <select name="gpa" value={formData.gpa} onChange={handleChange}>
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
                                <option value="softwareEngineering">Software Engineering</option>
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
                                <option value="americanIndianOrAlaskaNativeNotHispanicOrLatino">American Indian or Alaska Native (not Hispanic or Latino)</option>
                                <option value="asianNotHispanicOrLatino">Asian (not Hispanic or Latino)</option>
                                <option value="blackOrAfricanAmericanNotHispanicOrLatino">Black or African American (not Hispanic or Latino)</option>
                                <option value="hispanicOrLatino">Hispanic or Latino</option>
                                <option value="white">White</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label>Technical Skills:</label>
                            <div>
                                <h4>Programming Languages</h4>
                                {['JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'TypeScript', 'Go', 'Rust', 'R', 'SQL', 'HTML/CSS'].map(skill => (
                                    <label key={skill}>
                                        <input
                                            type="checkbox"
                                            name="technicalSkills.programmingLanguages"
                                            value={skill}
                                            checked={formData.technicalSkills.programmingLanguages.includes(skill)}
                                            onChange={handleChange}
                                        />
                                        {skill}
                                    </label>
                                ))}
                            </div>
                            <div>
                                <h4>Frameworks and Libraries</h4>
                                {['React', 'Angular', 'Vue.js', 'Django', 'Flask', 'Ruby on Rails', 'Spring Boot', 'Express.js', 'ASP.NET', 'TensorFlow', 'PyTorch'].map(skill => (
                                    <label key={skill}>
                                        <input
                                            type="checkbox"
                                            name="technicalSkills.frameworksLibraries"
                                            value={skill}
                                            checked={formData.technicalSkills.frameworksLibraries.includes(skill)}
                                            onChange={handleChange}
                                        />
                                        {skill}
                                    </label>
                                ))}
                            </div>
                            <div>
                                <h4>Databases</h4>
                                {['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite', 'Oracle', 'Microsoft SQL Server', 'Firebase'].map(skill => (
                                    <label key={skill}>
                                        <input
                                            type="checkbox"
                                            name="technicalSkills.databases"
                                            value={skill}
                                            checked={formData.technicalSkills.databases.includes(skill)}
                                            onChange={handleChange}
                                        />
                                        {skill}
                                    </label>
                                ))}
                            </div>
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
