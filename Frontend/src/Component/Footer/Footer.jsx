import React from 'react';
import Logo from '../../assets/logo.png'
import './Footer.css';

const Footer = () => {

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-top">
                    <div className="footer-left">
                        <div className="logo" onClick={() => navigate('/dashboard')}><img src={Logo}></img></div>
                    </div>
                    <div className="footer-right">
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                            <i className="fa-brands fa-instagram"></i>
                        </a>
                        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                            <i className="fa-brands fa-linkedin"></i>
                        </a>
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                            <i className="fa-brands fa-facebook"></i>
                        </a>
                    </div>
                </div>
                <div className="footer-middle">
                    <div className="footer-links">
                        <a href="/terms-of-service">Terms of Service</a>
                        <a href="/privacy-policy">Privacy Policy</a>
                        <a href="/faq">FAQ</a>
                    </div>
                    <div className="footer-contact">
                        <p>Contact us:</p>
                        <p>Email: <a href="mailto:techlink@gmail.com">techlink@gmail.com</a></p>
                        <p>Phone: (806) 471-4304</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2024 TechLink. All rights reserved.</p>
                </div>
            </div>
        </footer >
    );
};

export default Footer;
