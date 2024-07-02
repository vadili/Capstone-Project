import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
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

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/user', {
                method: 'DELETE',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                localStorage.removeItem('token');
                navigate('/signup-step-1');
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Delete failed');
                console.error('Error deleting profile:', errorData);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error deleting profile:', error);
        }
    };

    return (
        <div className='profile-container'>
            <div className="profile">
                <h1>Profile</h1>
                {error && <p className="error-message">{error}</p>}
                <div className="profile-fields">
                    <div className="profile-field">
                        <label>First Name:</label>
                        <input type="text" value={formData.firstName} readOnly />
                    </div>
                    <div className="profile-field">
                        <label>Last Name:</label>
                        <input type="text" value={formData.lastName} readOnly />
                    </div>
                    <div className="profile-field">
                        <label>Email:</label>
                        <input type="email" value={formData.email} readOnly />
                    </div>
                    <div className="profile-field">
                        <label>User Type:</label>
                        <input type="text" value={formData.userType} readOnly />
                    </div>
                    {formData.userType === 'student' && (
                        <>
                            <div className="profile-field">
                                <label>School:</label>
                                <input type="text" value={formData.school} readOnly />
                            </div>
                            <div className="profile-field">
                                <label>GPA:</label>
                                <input type="text" value={formData.gpa} readOnly />
                            </div>
                            <div className="profile-field">
                                <label>Major:</label>
                                <input type="text" value={formData.major} readOnly />
                            </div>
                            <div className="profile-field">
                                <label>Gender:</label>
                                <input type="text" value={formData.gender} readOnly />
                            </div>
                            <div className="profile-field">
                                <label>Race/Ethnicity:</label>
                                <input type="text" value={formData.raceEthnicity} readOnly />
                            </div>
                            <div className="profile-field">
                                <label>Technical Skills:</label>
                                <input type="text" value={JSON.stringify(formData.technicalSkills)} readOnly />
                            </div>
                            <div className="profile-field">
                                <label>Previous Internships:</label>
                                <input type="text" value={formData.previousInternships} readOnly />
                            </div>
                        </>
                    )}
                    {formData.userType === 'recruiter' && (
                        <>
                            <div className="profile-field">
                                <label>Company:</label>
                                <input type="text" value={formData.company} readOnly />
                            </div>
                            <div className="profile-field">
                                <label>Company Culture:</label>
                                <input type="text" value={formData.companyCulture} readOnly />
                            </div>
                        </>
                    )}
                </div>
                <div className="button-group">
                    <button onClick={() => navigate('/profile/edit')}>Edit Profile</button>
                    <button onClick={handleDelete}>Delete Profile</button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
