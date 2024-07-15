import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';

const EditProfile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        userType: '',
        school: '',
        gpa: '',
        major: '',
        gender: '',
        raceEthnicity: '',
        technicalSkills: {},
        previousInternships: '',
        company: '',
        companyCulture: ''
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState({
        programmingLanguages: false,
        frameworksLibraries: false,
        databases: false
    });

    const toggleDropdown = (section) => {
        setDropdownOpen(prevState => ({
            ...prevState,
            [section]: !prevState[section]
        }));
    };

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        const [mainKey, subKey] = name.split('.');

        setFormData(prevState => {
            const updatedSkills = checked
                ? [...(prevState.technicalSkills[subKey] || []), value]
                : prevState.technicalSkills[subKey].filter(skill => skill !== value);

            return {
                ...prevState,
                technicalSkills: {
                    ...prevState.technicalSkills,
                    [subKey]: updatedSkills
                }
            };
        });
    };

    useEffect(() => {
        const fetchProfile = async () => {
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
                    setFormData(data);
                    setLoading(false);
                } else {
                    console.error('Error fetching profile data:', response.statusText);
                    setError('Error fetching profile data');
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
                setError('Error fetching profile data');
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleDefaultChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/user', {
                method: 'PUT',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                navigate('/profile');
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Update failed');
                console.error('Error updating profile:', errorData);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error updating profile:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Header />
            <div className='container'>
                <div>
                    <div class="card my-4 rounded-3 shadow-sm">
                        <div class="card-header py-3">
                            <h4 class="my-0 fw-normal">Edit Profile</h4>
                        </div>
                        <div class="card-body">
                            <form onSubmit={handleSubmit} class="needs-validation" novalidate="">
                                <div class="row g-3">
                                    <div class="col-sm-6">
                                        <label for="firstName" class="form-label">First name</label>
                                        <input type="text" class="form-control" name='firstName' id="firstName" value={formData.firstName} onChange={handleDefaultChange} required="" />
                                        <div class="invalid-feedback">
                                            Valid first name is required.
                                        </div>
                                    </div>

                                    <div class="col-sm-6">
                                        <label for="lastName" class="form-label">Last name</label>
                                        <input type="text" class="form-control" name='lastName' id="lastName" value={formData.lastName} onChange={handleDefaultChange} required="" />
                                        <div class="invalid-feedback">
                                            Valid last name is required.
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <label for="email" class="form-label">Email </label>
                                        <input type="email" class="form-control" id="email" name='email' placeholder="you@example.com" value={formData.email} onChange={handleDefaultChange} />
                                        <div class="invalid-feedback">
                                            Please enter a valid email address for shipping updates.
                                        </div>
                                    </div>

                                    <div class="col-md-3">
                                        <label for="type" class="form-label">User Type:</label>
                                        <select class="form-select" id="type" name='userType' value={formData.userType} onChange={handleDefaultChange} required="">
                                            <option value="student">Student</option>
                                            <option value="recruiter">Recruiter</option>
                                        </select>
                                        <div class="invalid-feedback">
                                            Please select a valid profile type.
                                        </div>
                                    </div>
                                    {formData.userType === 'student' && (
                                        <>
                                            <div class="col-12">
                                                <label for="school" class="form-label">School: </label>
                                                <input type="text" class="form-control" id="school" name='school' value={formData.school} onChange={handleDefaultChange} />
                                            </div>
                                            <div class="col-md-4">
                                                <label for="major" class="form-label">Major:</label>
                                                <select class="form-select" id="major" name='major' value={formData.major} onChange={handleDefaultChange} required="">
                                                    <option value="">Select Major</option>
                                                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                                                    <option value="Computer Science">Computer Science</option>
                                                    <option value="Computer Engineering">Computer Engineering</option>
                                                    <option value="CyberSecurity">Cyber Security</option>
                                                    <option value="Data Science">Data Science</option>
                                                    <option value="Information Technology">Information Technology</option>
                                                    <option value="Software Engineering">Software Engineering</option>
                                                    <option value="Web Development">Web Development</option>
                                                </select>
                                                <div class="invalid-feedback">
                                                    Please provide a valid major.
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <label for="gpa" class="form-label">GPA:</label>
                                                <select class="form-select" id="gpa" name='gpa' value={formData.gpa} onChange={handleDefaultChange}>
                                                    <option value="">Select GPA</option>
                                                    <option value="3.5 - 4.0">3.5 - 4.0</option>
                                                    <option value="3.0 - 3.49">3.0 - 3.49</option>
                                                    <option value="2.5 - 2.99">2.5 - 2.99</option>
                                                    <option value="2.0 - 2.49">2.0 - 2.49</option>
                                                    <option value="1.5 - 1.99">1.5 - 1.99</option>
                                                    <option value="1.0 - 1.49">1.0 - 1.49</option>
                                                    <option value="0.0 - 0.99">0.0 - 0.99</option>
                                                </select>
                                                <div class="invalid-feedback">
                                                    Please provide a valid GPA.
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <label for="gender" class="form-label">Gender:</label>
                                                <select class="form-select" id="gender" name='gender' value={formData.gender} onChange={handleDefaultChange}>
                                                    <option value="">Select Gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                <div class="invalid-feedback">
                                                    Please provide a valid gender.
                                                </div>
                                            </div>
                                            <div class="col-12">
                                                <label for="raceEthnicity" class="form-label">Race/Ethnicity:</label>
                                                <select class="form-select" id="raceEthnicity" name='raceEthnicity' value={formData.raceEthnicity} onChange={handleDefaultChange}>
                                                    <option value="">Select Race/Ethnicity</option>
                                                    <option value="American Indian Or Alaska Native (not Hispanic Or Latino)">American Indian or Alaska Native (not Hispanic or Latino)</option>
                                                    <option value="Asian (not Hispanic Or Latino)">Asian (not Hispanic or Latino)</option>
                                                    <option value="Black Or African American (not Hispanic Or Latino)">Black or African American (not Hispanic or Latino)</option>
                                                    <option value="Hispanic Or Latino">Hispanic or Latino</option>
                                                    <option value="White">White</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div class='col-1 col-md-3'>
                                                <label>Technical Skills:</label>
                                            </div>

                                            <div class="btn-group col-md-3 col-sm-12">
                                                <button class="btn text-truncate btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                    Programming Languages
                                                </button>
                                                <ul className="dropdown-menu">
                                                    {['JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'TypeScript', 'Go', 'Rust', 'R', 'SQL', 'HTML/CSS'].map(skill => (
                                                        <div class="dropdown-item" key={skill}>
                                                            <input class="form-check-input" type="checkbox" name={`technicalSkills.programmingLanguages`} value={skill} checked={formData.technicalSkills.programmingLanguages.includes(skill)} onChange={handleChange} id="flexCheckDefault" />
                                                            <label class="form-check-label" for="flexCheckDefault">
                                                                {skill}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div class="btn-group col-md-3 col-sm-12">
                                                <button class="btn btn-secondary text-truncate dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                    Frameworks And Libraries
                                                </button>
                                                <ul className="dropdown-menu">
                                                    {['React', 'Angular', 'Vue.js', 'Django', 'Flask', 'Ruby on Rails', 'Spring Boot', 'Express.js', 'ASP.NET', 'TensorFlow', 'PyTorch'].map(skill => (
                                                        <div class="dropdown-item" key={skill}>
                                                            <input class="form-check-input" type="checkbox" name={`technicalSkills.frameworksLibraries`} value={skill} checked={formData.technicalSkills.frameworksLibraries.includes(skill)} onChange={handleChange} id="flexCheckDefault" />
                                                            <label class="form-check-label" for="flexCheckDefault">
                                                                {skill}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div class="btn-group col-md-3 col-sm-12">
                                                <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                    Databases
                                                </button>
                                                <ul className="dropdown-menu">
                                                    {['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite', 'Oracle', 'Microsoft SQL Server', 'Firebase'].map(skill => (
                                                        <div class="dropdown-item" key={skill}>
                                                            <input class="form-check-input" type="checkbox" name={`technicalSkills.databases`} value={skill} checked={formData.technicalSkills.databases.includes(skill)} onChange={handleChange} id="flexCheckDefault" />
                                                            <label class="form-check-label" for="flexCheckDefault">
                                                                {skill}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className='col-3'>
                                                <label>Previous Internships:</label>
                                                <input type="text" class="form-control" name="previousInternships" value={formData.previousInternships} onChange={handleDefaultChange} />
                                            </div>
                                        </>)}
                                    {formData.userType === 'recruiter' && (
                                        <>
                                            <div class="col-12">
                                                <label>Company:</label>
                                                <input type="text" class="form-control" name="company" value={formData.company} onChange={handleDefaultChange} />
                                            </div>
                                            <div class="col-12">
                                                <label>Company Culture:</label>
                                                <input type="text" class="form-control" name="companyCulture" value={formData.companyCulture} onChange={handleDefaultChange} />
                                            </div>
                                        </>
                                    )}
                                </div>
                                <button class="btn w-100 btn-primary btn-lg" type="submit">Update Profile</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditProfile;
