import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import Header from '../Header/Header';

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
        technicalSkills: {
            programmingLanguages: [],
            frameworksLibraries: [],
            databases: []
        },
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

    const formatTechnicalSkills = (skills) => {
        const {
            programmingLanguages = [],
            frameworksLibraries = [],
            databases = []
        } = skills;
        const allSkills = [
            ...programmingLanguages,
            ...frameworksLibraries,
            ...databases
        ];
        return allSkills.join(', ');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (<>
        <Header />
        <div className='profile-container'>
            <div className="profile">
                <h1>Profile</h1>
                {error && <p className="error-message">{error}</p>}
                <div className="profile-fields">
                    <div className="profile-field">
                        <label>First Name:</label>
                        <p>{formData.firstName}</p>
                    </div>
                    <div className="profile-field">
                        <label>Last Name:</label>
                        <p>{formData.lastName}</p>
                    </div>
                    <div className="profile-field">
                        <label>Email:</label>
                        <p>{formData.email}</p>
                    </div>
                    <div className="profile-field">
                        <label>User Type:</label>
                        <p>{formData.userType}</p>
                    </div>
                    {formData.userType === 'student' && (
                        <>
                            <div className="profile-field">
                                <label>School:</label>
                                <p>{formData.school}</p>
                            </div>
                            <div className="profile-field">
                                <label>GPA:</label>
                                <p>{formData.gpa}</p>
                            </div>
                            <div className="profile-field">
                                <label>Major:</label>
                                <p>{formData.major}</p>
                            </div>
                            <div className="profile-field">
                                <label>Gender:</label>
                                <p>{formData.gender}</p>
                            </div>
                            <div className="profile-field">
                                <label>Race/Ethnicity:</label>
                                <p>{formData.raceEthnicity}</p>
                            </div>
                            <div className="profile-field">
                                <label>Technical Skills:</label>
                                <p>{formatTechnicalSkills(formData.technicalSkills)}</p>
                            </div>
                            <div className="profile-field">
                                <label>Previous Internships:</label>
                                <p>{formData.previousInternships}</p>
                            </div>
                        </>
                    )}
                    {formData.userType === 'recruiter' && (
                        <>
                            <div className="profile-field">
                                <label>Company:</label>
                                <p>{formData.company}</p>
                            </div>
                            <div className="profile-field">
                                <label>Company Culture:</label>
                                <p>{formData.companyCulture}</p>
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
    </>
    );
};

export default Profile;
