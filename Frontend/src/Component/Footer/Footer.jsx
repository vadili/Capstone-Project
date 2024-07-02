import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <div className='parent-footer'>
            <footer className="footer">
                <div className="footer-top">
                    <div className="footer-left">
                        <h2>TechLink</h2>
                    </div>
                    <div className="footer-right">
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <div className="footer-bottom-left">
                        <p>Contact us:</p>
                        <p>2983 Ocala Court, San Jose, CA</p>
                        <p>Email: techlink@gmail.com</p>
                        <p>Phone: (806) 471-4304</p>
                    </div>
                    <div className="footer-bottom-right">
                        <a href="/privacy-policy">Privacy Policy</a>
                        <a href="/terms-of-use">Terms of Use</a>
                        <a href="/faq">FAQ</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer;
