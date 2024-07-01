import React from 'react';
import './Profile.css';

const Profile = () => {
    const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
    };

    return (
        <div className="profile">
            <h1>Profile</h1>
            <p>First Name: {user.firstName}</p>
            <p>Last Name: {user.lastName}</p>
            <p>Email: {user.email}</p>
        </div>
    );
};

export default Profile;
