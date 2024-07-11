import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './SavedLikedInternships.css';

const SavedLikedInternships = ({ type }) => {
    const navigate = useNavigate();
    const [internships, setInternships] = useState([]);

    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/user`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    if (type === 'saved') {
                        setInternships(data.savedInternships);
                    } else if (type === 'liked') {
                        setInternships(data.likedInternships);
                    }
                } else {
                    console.error('Error fetching internships:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching internships:', error);
            }
        };

        fetchInternships();
    }, [type]);

    return (
        <div className="saved-liked-internships">
            <Header />
            <main className="main-content">
                <div className="internships-container">
                    {internships.map((internship) => (
                        <div key={internship.id} className="internship-box">
                            <h3>{internship.title}</h3>
                            <p><strong>Job Title:</strong> {internship.jobTitle}</p>
                            <p><strong>Job Type:</strong> {internship.jobType}</p>
                            <p><strong>Company:</strong> {internship.company}</p>
                            <p><strong>Location:</strong> {internship.location}</p>
                            <p><strong>Description:</strong> {internship.description}</p>
                            <p><strong>Qualifications:</strong> {internship.qualifications}</p>
                            <a href={internship.url} target="_blank" rel="noopener noreferrer">Apply Here</a>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default SavedLikedInternships;
