import React, { useEffect, useState, useRef } from 'react';
import './CarouselViewerPage.css';
import CarouselViewer from '../CarouselViewer/CarouselViewer';
import Header from '../Header/Header';
import { io } from 'socket.io-client';

const CarouselViewerPage = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [postCount, setPostCount] = useState(0);
    const [seenAnnouncements, setSeenAnnouncements] = useState([]);
    const socket = useRef(null);

    useEffect(() => {
        const userId = JSON.parse(localStorage.getItem('user')).id

        const fetchSeenAnnouncements = async () => {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/user', {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            setSeenAnnouncements(data.seenAnnouncements.map(a => a.id));
        };
        fetchSeenAnnouncements();
    });

    useEffect(() => {
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
                    setPostCount(data.length);
                } else {
                    console.error('Error fetching announcements:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching announcements:', error);
            }
        };

        fetchAnnouncements();

        socket.current = io('http://localhost:3001', {
            withCredentials: true,
        });

        socket.current.on('announcement', (newAnnouncement) => {
            setAnnouncements((prevAnnouncements) => [newAnnouncement, ...prevAnnouncements]);
            setPostCount((prevCount) => prevCount + 1);
        });

        return () => {
            socket.current.disconnect();
        };

    }, []);

    return (
        <>
            <Header postCount={announcements.length - seenAnnouncements.length} />
            <div className="carousel-viewer-page">
                <h2>Announcements ({announcements.length - seenAnnouncements.length})</h2>
                <CarouselViewer announcements={announcements} />
            </div>
        </>
    );
};

export default CarouselViewerPage;
