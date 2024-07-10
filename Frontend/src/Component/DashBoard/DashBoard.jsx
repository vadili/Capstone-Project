import React, { useEffect, useState } from 'react';
import './DashBoard.css';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const DashBoard = () => {
    const navigate = useNavigate();
    const [internships, setInternships] = useState([]);
    const [visibleInternships, setVisibleInternships] = useState(5);

    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/internships');
                if (response.ok) {
                    const data = await response.json();
                    setInternships(data);
                } else {
                    console.error('Error fetching internships:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching internships:', error);
            }
        };

        fetchInternships();
    }, []);

    const loadMore = () => {
        setVisibleInternships((prevVisibleInternships) => prevVisibleInternships + 5);
    };

    return (
        <div className="dashboard">
            <Header />
            <main className="main-content">
                <div className="internships-container">
                    {internships.slice(0, visibleInternships).map((internship) => (
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
                {visibleInternships < internships.length && (
                    <button onClick={loadMore} className="load-more">
                        Load More
                    </button>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default DashBoard;
