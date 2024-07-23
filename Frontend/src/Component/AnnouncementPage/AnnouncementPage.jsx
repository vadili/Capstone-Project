import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AnnouncementPage.css';
import Header from '../Header/Header';

const AnnouncementPage = () => {
    const navigate = useNavigate();
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:3001/api/announcements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                },
                body: JSON.stringify({ content })
            });

            if (response.ok) {
                navigate('/dashboard');
                setContent('');
            } else {
                console.error('Error creating announcement:', response.statusText);
            }
        } catch (error) {
            console.error('Error creating announcement:', error);
        }
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
                    <button type="submit">Post to Timeline</button>
                </form>
            </div>
        </>
    );
};

export default AnnouncementPage;
