import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import './EditProfile.css'
import EditProfilePicture from '../EditProfilePicture/EditProfilePicture';

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
        companyCulture: '',
        profilePicture: ''
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({
                ...formData,
                profilePicture: reader.result
            });
        };
        reader.readAsDataURL(selectedFile);
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

    const handleImageSave = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({
                ...formData,
                profilePicture: reader.result
            });
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(async () => {
            try {
                if (file) {
                    const formData = new FormData();
                    formData.append('profilePicture', file);

                    try {
                        const token = localStorage.getItem('token');
                        const response = await fetch('http://localhost:3001/api/user/profile-picture', {
                            method: 'PUT',
                            headers: {
                                'Authorization': token,
                            },
                            body: formData,
                        });

                    } catch (error) {
                        console.error('Error updating profile picture', error);
                    }
                }
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
            } finally {
                setLoading(false);
            }
        }, 5000);
    };

    return (
        <>
            <Header />
            {loading && <div className='glimmer-overlay'></div>}
            <div className='container'>
                <div>
                    <div className="card my-4 rounded-3 shadow-sm">
                        <div className="card-header py-3">
                            <h4 className="my-0 fw-normal">Edit Profile</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit} className="needs-validation" novalidate="">
                                <div className="row g-3">
                                    <div className='col-12 text-center'>
                                        <label>Profile Picture:</label>
                                        <EditProfilePicture currentPicture={formData.profilePicture} onSave={handleFileChange} />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor="firstName" className="form-label">First name</label>
                                        <input type="text" className="form-control" name='firstName' id="firstName" value={formData.firstName} onChange={handleDefaultChange} required="" />
                                        <div className="invalid-feedback">
                                            Valid first name is required.
                                        </div>
                                    </div>

                                    <div className="col-sm-6">
                                        <label htmlFor="lastName" className="form-label">Last name</label>
                                        <input type="text" className="form-control" name='lastName' id="lastName" value={formData.lastName} onChange={handleDefaultChange} required="" />
                                        <div className="invalid-feedback">
                                            Valid last name is required.
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="email" className="form-label">Email </label>
                                        <input type="email" className="form-control" id="email" name='email' placeholder="you@example.com" value={formData.email} onChange={handleDefaultChange} />
                                        <div className="invalid-feedback">
                                            Please enter a valid email address for shipping updates.
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <label htmlFor="type" className="form-label">User Type:</label>
                                        <select className="form-select" id="type" name='userType' value={formData.userType} onChange={handleDefaultChange} required="">
                                            <option value="student">Student</option>
                                            <option value="recruiter">Recruiter</option>
                                        </select>
                                        <div className="invalid-feedback">
                                            Please select a valid profile type.
                                        </div>
                                    </div>
                                    {formData.userType === 'student' && (
                                        <>
                                            <div className="col-12">
                                                <label htmlFor="school" className="form-label">School: </label>
                                                <input type="text" className="form-control" id="school" name='school' value={formData.school} onChange={handleDefaultChange} />
                                            </div>
                                            <div className="col-md-4">
                                                <label htmlFor="major" className="form-label">Major:</label>
                                                <select className="form-select" id="major" name='major' value={formData.major} onChange={handleDefaultChange} required="">
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
                                                <div className="invalid-feedback">
                                                    Please provide a valid major.
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <label htmlFor="gpa" className="form-label">GPA:</label>
                                                <select className="form-select" id="gpa" name='gpa' value={formData.gpa} onChange={handleDefaultChange}>
                                                    <option value="">Select GPA</option>
                                                    <option value="3.5 - 4.0">3.5 - 4.0</option>
                                                    <option value="3.0 - 3.49">3.0 - 3.49</option>
                                                    <option value="2.5 - 2.99">2.5 - 2.99</option>
                                                    <option value="2.0 - 2.49">2.0 - 2.49</option>
                                                    <option value="1.5 - 1.99">1.5 - 1.99</option>
                                                    <option value="1.0 - 1.49">1.0 - 1.49</option>
                                                    <option value="0.0 - 0.99">0.0 - 0.99</option>
                                                </select>
                                                <div className="invalid-feedback">
                                                    Please provide a valid GPA.
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <label htmlFor="gender" className="form-label">Gender:</label>
                                                <select className="form-select" id="gender" name='gender' value={formData.gender} onChange={handleDefaultChange}>
                                                    <option value="">Select Gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                <div className="invalid-feedback">
                                                    Please provide a valid gender.
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <label htmlFor="raceEthnicity" className="form-label">Race/Ethnicity:</label>
                                                <select className="form-select" id="raceEthnicity" name='raceEthnicity' value={formData.raceEthnicity} onChange={handleDefaultChange}>
                                                    <option value="">Select Race/Ethnicity</option>
                                                    <option value="American Indian Or Alaska Native (not Hispanic Or Latino)">American Indian or Alaska Native (not Hispanic or Latino)</option>
                                                    <option value="Asian (not Hispanic Or Latino)">Asian (not Hispanic or Latino)</option>
                                                    <option value="Black Or African American (not Hispanic or Latino)">Black or African American (not Hispanic or Latino)</option>
                                                    <option value="Hispanic Or Latino">Hispanic or Latino</option>
                                                    <option value="White">White</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div className='col-1 col-md-3'>
                                                <label>Technical Skills:</label>
                                            </div>

                                            <div className="btn-group col-md-3 col-sm-12">
                                                <button className="btn text-truncate text-dark btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                    Programming Languages
                                                </button>
                                                <ul className="dropdown-menu">
                                                    {['JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'TypeScript', 'Go', 'Rust', 'R', 'SQL', 'HTML/CSS'].map(skill => (
                                                        <div className="dropdown-item" key={skill}>
                                                            <input className="form-check-input" type="checkbox" name={`technicalSkills.programmingLanguages`} value={skill} checked={formData.technicalSkills.programmingLanguages.includes(skill)} onChange={handleChange} id="flexCheckDefault" />
                                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                {skill}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="btn-group col-md-3 col-sm-12">
                                                <button className="btn btn-secondary text-dark text-truncate dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                    Frameworks And Libraries
                                                </button>
                                                <ul className="dropdown-menu">
                                                    {['React', 'Angular', 'Vue.js', 'Django', 'Flask', 'Ruby on Rails', 'Spring Boot', 'Express.js', 'ASP.NET', 'TensorFlow', 'PyTorch'].map(skill => (
                                                        <div className="dropdown-item" key={skill}>
                                                            <input className="form-check-input" type="checkbox" name={`technicalSkills.frameworksLibraries`} value={skill} checked={formData.technicalSkills.frameworksLibraries.includes(skill)} onChange={handleChange} id="flexCheckDefault" />
                                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                {skill}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="btn-group col-md-3 col-sm-12">
                                                <button className="btn btn-secondary text-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                    Databases
                                                </button>
                                                <ul className="dropdown-menu">
                                                    {['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite', 'Oracle', 'Microsoft SQL Server', 'Firebase'].map(skill => (
                                                        <div className="dropdown-item" key={skill}>
                                                            <input className="form-check-input" type="checkbox" name={`technicalSkills.databases`} value={skill} checked={formData.technicalSkills.databases.includes(skill)} onChange={handleChange} id="flexCheckDefault" />
                                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                {skill}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className='col-3'>
                                                <label>Previous Internships:</label>
                                                <input type="text" className="form-control" name="previousInternships" value={formData.previousInternships} onChange={handleDefaultChange} />
                                            </div>
                                        </>)}
                                    {formData.userType === 'recruiter' && (
                                        <>
                                            <div className="col-12">
                                                <label>Company:</label>
                                                <input type="text" className="form-control" name="company" value={formData.company} onChange={handleDefaultChange} />
                                            </div>
                                            <div className="col-12">
                                                <label>Company Culture:</label>
                                                <input type="text" className="form-control" name="companyCulture" value={formData.companyCulture} onChange={handleDefaultChange} />
                                            </div>
                                        </>
                                    )}
                                </div>
                                <button className="btn w-100 text-dark btn-primary btn-lg" type="submit">Update Profile</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditProfile;
