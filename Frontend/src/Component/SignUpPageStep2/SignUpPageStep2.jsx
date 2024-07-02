import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SignUpPageStep2.css'

const SignUpPageStep2 = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const initialFormData = location.state?.formData || {};
    const [formData, setFormData] = useState({
        ...initialFormData,
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

    const [dropdownOpen, setDropdownOpen] = useState({
        programmingLanguages: false,
        frameworksLibraries: false,
        databases: false,
    });

    useEffect(() => {
        if (!location.state?.formData) {
            navigate('/signup-step-1');
        }
    }, [location.state, navigate]);

    const toggleDropdown = (name) => {
        setDropdownOpen((prevState) => ({
            ...prevState,
            [name]: !prevState[name],
        }));
    };

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
                [name]: value,
            });
        }
        console.log('Form Data:', formData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const parsedFormData = {
            ...formData,
            previousInternships: formData.previousInternships ? parseInt(formData.previousInternships, 10) : null,
            technicalSkills: JSON.stringify(formData.technicalSkills),  // Ensure it's JSON
            school: formData.school || null,
            gpa: formData.gpa || null,
            major: formData.major || null,
            gender: formData.gender || null,
            raceEthnicity: formData.raceEthnicity || null,
            company: formData.company || null,
            companyCulture: formData.companyCulture || null,
        };
        try {
            const response = await fetch('http://localhost:3001/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(parsedFormData)
            });
            if (response.ok) {
                navigate('/dashboard');
            } else {
                const errorData = await response.json();
                console.error('Signup failed:', errorData);
            }
        } catch (error) {
            console.error('Error signing up', error);
        }
    };

    return (
        <div className='parent-signup-page-step2'>
            <div className="signup-page-step2">
                <h2>Sign Up - Step 2</h2>
                <form onSubmit={handleSubmit}>
                    {formData.userType === 'student' && (
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
                                <div className="dropdown-section">
                                    <button type="button" onClick={() => toggleDropdown('programmingLanguages')}>Programming Languages</button>
                                    {dropdownOpen.programmingLanguages && (
                                        <div className="dropdown-menu">
                                            {['JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'TypeScript', 'Go', 'Rust', 'R', 'SQL', 'HTML/CSS'].map(skill => (
                                                <label key={skill}>
                                                    <input
                                                        type="checkbox"
                                                        name={`technicalSkills.programmingLanguages`}
                                                        value={skill}
                                                        checked={formData.technicalSkills.programmingLanguages.includes(skill)}
                                                        onChange={handleChange}
                                                    />
                                                    {skill}
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="dropdown-section">
                                    <button type="button" onClick={() => toggleDropdown('frameworksLibraries')}>Frameworks and Libraries</button>
                                    {dropdownOpen.frameworksLibraries && (
                                        <div className="dropdown-menu">
                                            {['React', 'Angular', 'Vue.js', 'Django', 'Flask', 'Ruby on Rails', 'Spring Boot', 'Express.js', 'ASP.NET', 'TensorFlow', 'PyTorch'].map(skill => (
                                                <label key={skill}>
                                                    <input
                                                        type="checkbox"
                                                        name={`technicalSkills.frameworksLibraries`}
                                                        value={skill}
                                                        checked={formData.technicalSkills.frameworksLibraries.includes(skill)}
                                                        onChange={handleChange}
                                                    />
                                                    {skill}
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="dropdown-section">
                                    <button type="button" onClick={() => toggleDropdown('databases')}>Databases</button>
                                    {dropdownOpen.databases && (
                                        <div className="dropdown-menu">
                                            {['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite', 'Oracle', 'Microsoft SQL Server', 'Firebase'].map(skill => (
                                                <label key={skill}>
                                                    <input
                                                        type="checkbox"
                                                        name={`technicalSkills.databases`}
                                                        value={skill}
                                                        checked={formData.technicalSkills.databases.includes(skill)}
                                                        onChange={handleChange}
                                                    />
                                                    {skill}
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label>Previous Internships:</label>
                                <select name="previousInternships" value={formData.previousInternships} onChange={handleChange}>
                                    <option value="">Select Number of Internships</option>
                                    {[...Array(10).keys()].map(num => (
                                        <option key={num + 1} value={num + 1}>{num + 1}</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}
                    {formData.userType === 'recruiter' && (
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
                    {/* <button className="button"> <a href="/signup-step-2">Sign Up</a></button> */}
                </form>
            </div>
        </div>
    );
};

export default SignUpPageStep2;
