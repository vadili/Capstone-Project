import React, { useState, useEffect } from 'react';
import './AnnouncementPage.css';
import Header from '../Header/Header';

const AnnouncementPage = () => {
    const [content, setContent] = useState('');
    const [photo, setPhoto] = useState(null);
    const [announcements, setAnnouncements] = useState([]);

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
                } else {
                    console.error('Error fetching announcements:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching announcements:', error);
            }
        };

        fetchAnnouncements();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('content', content);
        if (photo) {
            formData.append('photo', photo);
        }

        try {
            const response = await fetch('http://localhost:3001/api/announcements', {
                method: 'POST',
                headers: {
                    'Authorization': `${token}`
                },
                body: formData
            });

            if (response.ok) {
                const newAnnouncement = await response.json();
                setAnnouncements([newAnnouncement, ...announcements]);
                setContent('');
                setPhoto(null);
            } else {
                console.error('Error creating announcement:', response.statusText);
            }
        } catch (error) {
            console.error('Error creating announcement:', error);
        }
    };

    const handlePhotoChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    return (
        <>
            <Header />
            <div className="announcement-page">
                <h2>What's on your mind?</h2>
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Example: Hello, my name is Jane, I just secured this internship, link below... yay!🥳"
                        required
                    ></textarea>
                    <input type="file" accept="image/*" onChange={handlePhotoChange} />
                    <button type="submit">Post to Timeline</button>
                </form>
            </div>
        </>
    );
};

export default AnnouncementPage;
