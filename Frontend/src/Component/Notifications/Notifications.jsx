import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Notifications.css';
import Header from '../Header/Header';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3001/api/notifications', {
                    headers: { Authorization: `${token}` }
                });
                const data = await response.json();
                setNotifications(data);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:3001/api/notifications/${id}`, {
                method: 'delete',
                headers: { Authorization: `${token}` }
            });
            setNotifications(prevNotifications => prevNotifications.filter(n => n.id !== id));
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    return (
        <>
            <Header />
            <div>
                <h2>Notifications</h2>
                {notifications.length === 0 ? (
                    <p>No new notifications</p>
                ) : (
                    <ul>
                        {notifications.map(notification => (
                            <li key={notification.id}>
                                {notification.content}
                                <button onClick={() => markAsRead(notification.id)}>Mark as Read</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
};

export default Notifications;
