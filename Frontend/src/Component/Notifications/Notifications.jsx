import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import './Notifications.css';
import Header from '../Header/Header';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const socket = useRef(null);

    useEffect(() => {

        const token = localStorage.getItem('token');

        socket.current = io("http://localhost:3001", {
            withCredentials: true,
            query: { token: `${token}` }

        });

        socket.current.on("announcement", (notification) => {
            console.log("New announcement received:", notification);
            fetchNotifications();
        });

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

        return () => {
            socket.current.off("announcement");
            socket.current.disconnect();
        };
    }, []);

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:3001/api/notifications/${id}`, {
                method: 'DELETE',
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
            <div className="notifications-container">
                <h2>Notifications</h2>
                {notifications.length === 0 ? (
                    <p>No new notifications</p>
                ) : (
                    <div className="notification-cards">
                        {notifications.map(notification => (
                            <div key={notification.id} className="notification-card">
                                <h3>{notification.title || 'Notification'}</h3>
                                <p>{notification.content}</p>
                                <button onClick={() => markAsRead(notification.id)}>Mark as Read</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Notifications;
