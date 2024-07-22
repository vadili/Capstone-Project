import React from 'react';
import './FirstPage.css';
import Logo from '../../assets/logo.png'
const FirstPage = () => {

    return (
        <div className="floating-logos-container first-page"><>
            <img
                src={Logo}
                alt="logo"
                className="floating-logo"
                style={{ animationDelay: `${0.5}s` }}
            />
            <img

                src={Logo}
                alt="logo"
                className="floating-logo2"
                style={{ animationDelay: `${0.4}s` }}
            />
            <img

                src={Logo}
                alt="logo"
                className="floating-logo1"
                style={{ animationDelay: `${0.6}s` }}
            />
            <img

                src={Logo}
                alt="logo"
                className="floating-logo3"
                style={{ animationDelay: `${0.7}s` }}
            />
            <img

                src={Logo}
                alt="logo"
                className="floating-logo4"
                style={{ animationDelay: `${0.8}s` }}
            />
            <img

                src={Logo}
                alt="logo"
                className="floating-logo5"
                style={{ animationDelay: `${1}s` }}
            />
        </>
            <div className='description'>
                <h1>TechLink</h1>
                <p>In a world where you can be anything, be yourself.</p>
                <button className="button"> <a href="/login">Get Started</a></button>
            </div>

        </div>
    );
};

export default FirstPage;
