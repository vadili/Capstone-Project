import React from 'react';
import './FirstPage.css';

const FirstPage = () => {

    return (
        <div className="first-page">
            <div className='description'>
                <h1>TechLink</h1>
                <p>In a world where you can be anything, be yourself.</p>
                <button className="button"> <a href="/login">Get Started</a></button>
            </div>

        </div>
    );
};

export default FirstPage;
