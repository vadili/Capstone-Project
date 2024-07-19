import React, { useContext } from 'react';
import './Notifications.css';
import Header from '../Header/Header';
import { NotificationContext } from '../../App';

const Notifications = () => {
    const [notifications, setNotifications] = useContext(NotificationContext);

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
