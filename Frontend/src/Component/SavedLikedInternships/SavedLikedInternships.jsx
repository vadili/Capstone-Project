import React, { useEffect, useState } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './SavedLikedInternships.css';

const SavedLikedInternships = ({ type }) => {
    const [internships, setInternships] = useState([]);

    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/user', {
                    method: "GET",
                    headers: {
                        'Authorization': `${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    if (type === 'saved') {
                        setInternships(data.savedInternships || []);
                    } else if (type === 'liked') {
                        setInternships(data.likedInternships || []);
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

    const title = type === 'saved' ? 'Saved Internships' : 'Liked Internships';

    return (
        <div className='dashboard'>
            <div> <Header /></div>
            <main className="main-content">
                <h2>{title}</h2>
                <div className="internships-container">
                    {internships.map((internship) => (
                        <div key={internship.id} className="internship-box">
                            <h3>{internship.title}</h3>
                            <p><strong>Job Title:</strong> {internship.jobTitle}</p>
                            <p><strong>Company:</strong> {internship.company}</p>
                            <p><strong>Description:</strong> {internship.description}</p>
                            <p><strong>Qualifications:</strong> {internship.qualifications}</p>
                            <div className="tooltip-container">
                                <button className="button-link" onClick={() => window.open(internship.url, '_blank', 'noopener,noreferrer')}>
                                    Apply Here
                                </button>
                                <div className="tooltiptext">This is a {internship.jobType} job in {internship.location}. Click here to proceed with application.</div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default SavedLikedInternships;
