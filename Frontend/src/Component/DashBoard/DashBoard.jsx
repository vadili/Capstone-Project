import React, { useEffect, useState } from 'react';
import './DashBoard.css';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import SavedLikedInternships from '../SavedLikedInternships/SavedLikedInternships';

const DashBoard = () => {
    const navigate = useNavigate();
    const [internships, setInternships] = useState([]);
    const [visibleInternships, setVisibleInternships] = useState(5);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [savedInternships, setSavedInternships] = useState([]);
    const [likedInternships, setLikedInternships] = useState([]);
    const [displayedInternships, setDisplayedInternships] = useState([]);

    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/internships');
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

        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/user', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setSavedInternships(data.savedInternships.map(internship => internship.id));
                    setLikedInternships(data.likedInternships.map(internship => internship.id));
                } else {
                    console.error('Error fetching user data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchNotifications = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/notifications', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data);
                    setUnreadCount(data.length);
                } else {
                    console.error('Error fetching notifications:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchInternships();
        fetchNotifications();
        fetchUserData();
    }, []);

    const loadMore = () => {
        setVisibleInternships((prevVisibleInternships) => prevVisibleInternships + 5);
    };

    const handleNotificationClick = async (notificationId) => {
        try {
            await fetch(`http://localhost:3001/api/notifications/${notificationId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setNotifications(notifications.filter(notification => notification.id !== notificationId));
            setUnreadCount(unreadCount - 1);
        } catch (error) {
            console.error('Error updating notification:', error);
        }
    };

    const saveInternship = async (id) => {
        try {
            await fetch(`http://localhost:3001/api/internships/${id}/save`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setSavedInternships([...savedInternships, id]);
        } catch (error) {
            console.error('Error saving internship:', error);
        }
    };

    const likeInternship = async (id) => {
        try {
            await fetch(`http://localhost:3001/api/internships/${id}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setLikedInternships([...likedInternships, id]);
        } catch (error) {
            console.error('Error liking internship:', error);
        }
    };
    const showSavedInternships = () => {
        navigate('/saved-internships');
    };

    const showLikedInternships = () => {
        navigate('/liked-internships');
    };

    return (
        <div className="dashboard">
            <Header showSavedInternships={showSavedInternships} showLikedInternships={showLikedInternships} />
            <main className="main-content">
                <div className="internships-container">
                    {internships.slice(0, visibleInternships).map((internship) => {
                        const isSaved = savedInternships.includes(internship.id);
                        const isLiked = likedInternships.includes(internship.id);

                        return (
                            <div key={internship.id} className="internship-box">
                                <h3>{internship.title}</h3>
                                <p><strong>Job Title:</strong> {internship.jobTitle}</p>
                                <p><strong>Job Type:</strong> {internship.jobType}</p>
                                <p><strong>Company:</strong> {internship.company}</p>
                                <p><strong>Location:</strong> {internship.location}</p>
                                <p><strong>Description:</strong> {internship.description}</p>
                                <p><strong>Qualifications:</strong> {internship.qualifications}</p>
                                <a href={internship.url} target="_blank" rel="noopener noreferrer">Apply Here</a>
                                <div className="icons">
                                    <div onClick={() => saveInternship(internship.id)}>
                                        {!isSaved && <i className="fa-regular  fa-beat fa-bookmark"></i>}
                                        {isSaved && <i className="fa-sharp fa-solid fa-bookmark"></i>}
                                    </div>
                                    <div onClick={() => likeInternship(internship.id)}>
                                        {!isLiked && <i className="fa-regular fa-beat fa-thumbs-up"></i>}
                                        {isLiked && <i className="fa-solid fa-thumbs-up"></i>}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
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
