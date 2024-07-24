import React, { useEffect, useState } from 'react';
import './CarouselViewer.css';

const CarouselViewer = ({ announcements }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [announcements.length]);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + announcements.length) % announcements.length);
    };

    return (
        <div className="carousel-viewer">
            <button className="carousel-button prev-button" onClick={handlePrev}>&lt;</button>
            <div className="carousel-content" >
                {announcements.map((announcement, index) => (
                    <div
                        key={index}
                        className={`carousel-item ${index === currentIndex ? 'active' : ''}`}
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
