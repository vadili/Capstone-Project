import React, { useEffect, useState } from 'react';
import './CarouselViewer.css';

const CarouselViewer = ({ announcements = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [seenAnnouncements, setSeenAnnouncements] = useState([]);
    const [shownIndices, setShownIndices] = useState(new Set());

    async function updateAnnouncement(newIndex) {
        const userId = JSON.parse(localStorage.getItem('user')).id
        const token = localStorage.getItem('token');

        await fetch(`http://localhost:3001/api/users/${userId}/${announcements[newIndex].id}/seenAnnouncements`, {
            method: 'POST',
        });
    }

    useEffect(() => {
        const userId = JSON.parse(localStorage.getItem('user')).id

        const fetchSeenAnnouncements = async () => {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/user', {
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();

            setSeenAnnouncements(data.seenAnnouncements.map(a => a.id));
        };
        fetchSeenAnnouncements();
    }, []);

    useEffect(() => {
        if (announcements.length > 0) {
            const timer = setInterval(() => {
                setCurrentIndex((prevIndex) => {
                    const newIndex = (prevIndex + 1) % announcements.length;
                    setShownIndices((prevShownIndices) => new Set(prevShownIndices).add(newIndex));
                    if (!seenAnnouncements.includes(announcements[newIndex].id)) {
                        setSeenAnnouncements((prevSeen) => [...prevSeen, announcements[newIndex].id]);
                        updateAnnouncement(newIndex)
                    }
                    return newIndex;
                });
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [announcements.length]);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => {
            const newIndex = (prevIndex + 1) % announcements.length;
            setShownIndices((prevShownIndices) => new Set(prevShownIndices).add(newIndex));
            if (!seenAnnouncements.includes(announcements[newIndex].id)) {
                setSeenAnnouncements((prevSeen) => [...prevSeen, announcements[newIndex].id]);
                updateAnnouncement(newIndex)
            }
            return newIndex;
        });
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => {
            const newIndex = (prevIndex - 1 + announcements.length) % announcements.length;
            setShownIndices((prevShownIndices) => new Set(prevShownIndices).add(newIndex));
            if (!seenAnnouncements.includes(announcements[newIndex].id)) {
                setSeenAnnouncements((prevSeen) => [...prevSeen, announcements[newIndex].id]);
                updateAnnouncement(newIndex)
            }
            return newIndex;
        });
    };

    const getClassNames = (index) => {
        let classNames = 'carousel-item';
        if (index === currentIndex) {
            classNames += ' active';
        } else if (
            index === (currentIndex + 1) % announcements.length ||
            index === (currentIndex - 1 + announcements.length) % announcements.length
        ) {
            classNames += ' inactive';
        }
        if (seenAnnouncements.includes(announcements[index].id)) {
            classNames += ' shown';
        }
        return classNames;
    };

    if (announcements.length === 0) {
        return null;
    }

    return (
        <div className="carousel-viewer">
            <button className="carousel-button prev-button" onClick={handlePrev}>&lt;</button>
            <div className="carousel-content">
                {announcements.map((announcement, index) => (
                    <div
                        key={index}
                        className={getClassNames(index)}
                    >
                        <p>{announcement.content}</p>
                        {announcement.photo && <img src={`http://localhost:3001/${announcement.photo}`} alt="Announcement" />}
                    </div>
                ))}
            </div>
            <button className="carousel-button next-button" onClick={handleNext}>&gt;</button>
        </div>
    );
};

export default CarouselViewer;
