import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecruiterInternships.css';
import Header from '../Header/Header';

const RecruiterInternships = () => {
    const [internships, setInternships] = useState([]);
    const [displayedInternships, setDisplayedInternships] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (loading) {
            const fetchInternships = async () => {
                try {
                    const user = JSON.parse(localStorage.getItem('user'));
                    const response = await fetch(`http://localhost:3001/api/recruiter/internships/${user.email}`);
                    if (response.ok) {
                        const data = await response.json();
                        setInternships(data);
                        setDisplayedInternships(data);
                        setLoading(false);
                    } else {
                        console.error('Error fetching internships:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error fetching internships:', error);
                }
            };

            fetchInternships();
        }
    }, [loading]);

    const handleEdit = (id) => {
        localStorage.setItem('editInternshipId', id);
        navigate('/edit-internship');
    };

    return (
        <div className="page-container">
            <Header />
            <main className="main-content">
                <h2>Created Internships</h2>
                {loading ? (
                    <div className="loading-overlay">
                        <p>Loading...</p>
                    </div>
                ) : (
                    <ul>
                        {internships.map((internship) => (
                            <li key={internship.id}>
                                <p><strong>Job Title:</strong> {internship.jobTitle}</p>
                                <p><strong>Job Type:</strong> {internship.jobType}</p>
                                <p><strong>Company:</strong> {internship.company}</p>
                                <p><strong>Location:</strong> {internship.location}</p>
                                <p><strong>Description:</strong> {internship.description}</p>
                                <p><strong>Qualifications:</strong> {internship.qualifications}</p>
                                <p><strong>Posted Date:</strong> {new Date(internship.postedAt).toLocaleDateString()}</p>
                                <a href={internship.url} target="_blank" rel="noopener noreferrer">Apply</a>
                                <button className="edit-button" onClick={() => handleEdit(internship.id)}>Edit</button>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </div>
    );
};

export default RecruiterInternships;
