import React, { useEffect, useState } from 'react';
import './DashBoard.css';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const DashBoard = () => {
    const navigate = useNavigate();
    const [internships, setInternships] = useState([]);
    const [visibleInternships, setVisibleInternships] = useState(5);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [savedInternships, setSavedInternships] = useState([]);
    const [likedInternships, setLikedInternships] = useState([]);
    const [displayedInternships, setDisplayedInternships] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [seenAnnouncements, setSeenAnnouncements] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false); // Set loading to false after 1.5 seconds
        }, 1500);
    }, []);

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

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/user', {
                    method: "GET",
                    headers: {
                        'Authorization': `${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();

                    setSeenAnnouncements(data.seenAnnouncements)
                    setSavedInternships(Array.isArray(data.savedInternships) ? data.savedInternships.map(internship => internship.id) : []);
                    setLikedInternships(Array.isArray(data.likedInternships) ? data.likedInternships.map(internship => internship.id) : []);
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
                        'Authorization': `${localStorage.getItem('token')}`
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

        const fetchAnnouncements = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/announcements', {
                    headers: {
                        'Authorization': `${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setAnnouncements(data);
                } else {
                    console.error('Error fetching announcements:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching announcements:', error);
            }
        };

        fetchAnnouncements();
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
                    'Authorization': `${localStorage.getItem('token')}`
                }
            });
            setNotifications(notifications.filter(notification => notification.id !== notificationId));
            setUnreadCount(unreadCount - 1);
        } catch (error) {
            console.error('Error updating notification:', error);
        }
    };

    const toggleSaveInternship = async (id) => {
        try {
            let response;
            if (!savedInternships.includes(id)) {
                response = await fetch(`http://localhost:3001/api/internships/${id}/save`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
            else {
                response = await fetch(`http://localhost:3001/api/internships/${id}/save`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
            if (response.ok) {
                const updatedSavedInternships = await response.json();
                setSavedInternships(Array.isArray(updatedSavedInternships) ? updatedSavedInternships.map(internship => internship.id) : []);
            } else {
                console.error('Error saving internship:', response.statusText);
            }
        } catch (error) {
            console.error('Error saving internship:', error);
        }
    };

    const toggleLikeInternship = async (id) => {
        try {
            let response;
            if (!likedInternships.includes(id)) {
                response = await fetch(`http://localhost:3001/api/internships/${id}/like`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
            else {
                response = await fetch(`http://localhost:3001/api/internships/${id}/like`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
            if (response.ok) {
                const updatedLikedInternships = await response.json();
                setLikedInternships(Array.isArray(updatedLikedInternships) ? updatedLikedInternships.map(internship => internship.id) : []);
            } else {
                console.error('Error liking internship:', response.statusText);
            }
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

    useEffect(() => {
        const handleSearch = async () => {
            if (searchTerm.trim() === '') {
                setDisplayedInternships(internships);
                return;
            }
            try {
                const response = await fetch(`http://localhost:3001/api/search?keyword=${searchTerm}`);
                if (response.ok) {
                    const data = await response.json();
                    setDisplayedInternships(data);
                } else {
                    console.error('Error searching internships:', response.statusText);
                }
            } catch (error) {
                console.error('Error searching internships:', error);
            }
        };

        handleSearch();
    }, [searchTerm, internships]);

    return (
        <div className="dashboard">
            {loading && (
                <div className="loading-overlay">
                    <p>Loading...</p>
                </div>
            )}
            <Header showSavedInternships={showSavedInternships} showLikedInternships={showLikedInternships} postCount={announcements ? announcements.length - seenAnnouncements.length : 0} />
            <main className="main-content">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search internships..."
                        className="search-bar"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="internships-container">
                    {displayedInternships.slice(0, visibleInternships).map((internship) => {
                        const isSaved = savedInternships.includes(internship.id);
                        const isLiked = likedInternships.includes(internship.id);

                        return (
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
                                <div className="icons">
                                    <div onClick={() => toggleSaveInternship(internship.id)}>
                                        {isSaved ? <i className="fa-solid fa-bookmark"></i> : <i className="fa-regular fa-bookmark"></i>}
                                    </div>
                                    <div onClick={() => toggleLikeInternship(internship.id)}>
                                        {isLiked ? <i className="fa-solid fa-thumbs-up"></i> : <i className="fa-regular fa-thumbs-up"></i>}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {visibleInternships < displayedInternships.length && (
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
