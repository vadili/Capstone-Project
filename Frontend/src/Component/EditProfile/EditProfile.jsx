import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css';
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
            <div className='parent-edit-profile'>
                <div className="edit-profile">
                    <h1>Edit Profile</h1>
                    {error && <p className="error-message">{error}</p>}
                    <form onSubmit={handleSubmit}>
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
                            <label>User Type:</label>
                            <select name="userType" value={formData.userType} onChange={handleChange}>
                                <option value="student">Student</option>
                                <option value="recruiter">Recruiter</option>
                            </select>
                        </div>
                        {formData.userType === 'student' && (
                            <>
                                <div>
                                    <label>School:</label>
                                    <input type="text" name="school" value={formData.school} onChange={handleChange} />
                                </div>
                                <div>
                                    <label>GPA:</label>
                                    <input type="text" name="gpa" value={formData.gpa} onChange={handleChange} />
                                </div>
                                <div>
                                    <label>Major:</label>
                                    <input type="text" name="major" value={formData.major} onChange={handleChange} />
                                </div>
                                <div>
                                    <label>Gender:</label>
                                    <input type="text" name="gender" value={formData.gender} onChange={handleChange} />
                                </div>
                                <div>
                                    <label>Race/Ethnicity:</label>
                                    <input type="text" name="raceEthnicity" value={formData.raceEthnicity} onChange={handleChange} />
                                </div>
                                <div>
                                    <label>Technical Skills:</label>
                                    <input type="text" name="technicalSkills" value={JSON.stringify(formData.technicalSkills)} onChange={handleChange} />
                                </div>
                                <div>
                                    <label>Previous Internships:</label>
                                    <input type="text" name="previousInternships" value={formData.previousInternships} onChange={handleChange} />
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
                        <button type="submit">Update Profile</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditProfile;
