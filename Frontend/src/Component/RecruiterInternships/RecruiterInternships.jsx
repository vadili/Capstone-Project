import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecruiterInternships.css';
import Header from '../Header/Header';

const RecruiterInternships = () => {
    const [internships, setInternships] = useState([]);
    const [displayedInternships, setDisplayedInternships] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInternships = async () => {


            try {
                const user = JSON.parse(localStorage.getItem('user'))
                const response = await fetch(`http://localhost:3001/api/recruiter/internships/${user.email}`);
                if (response.ok) {
                    const data = await response.json();
                    setInternships(data);
                    setDisplayedInternships(data);
                } else {
                    console.error('Error fetching internships:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching internships:', error);
            }
        };

        fetchInternships();
    }, []);

    return (
        <>
            <Header />
            <div>
                <h2>Created Internships</h2>
                {internships.length === 0 ? (
                    <p>No internships created yet.</p>
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
                                <a href={internship.url} target="_blank" rel="noopener noreferrer">
                                    Apply
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
};

export default RecruiterInternships;
