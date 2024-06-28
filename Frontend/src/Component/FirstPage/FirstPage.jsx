import React from 'react';
import './FirstPage.css';

const FirstPage = () => {

    return (
        <div className="first-page">
            <div className='description'>
                <h1>TechLink</h1>
                <p>Has been the backbone of college students in tech since day one!!</p>
                <button className="button"> <a href="/login">Get Started</a></button>
            </div>

        </div>
    );
};

export default FirstPage;
