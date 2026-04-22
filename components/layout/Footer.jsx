import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-grid">
                    <div className="footer-section">
                        <h3>Get to Know Us</h3>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                            <li><Link to="/cart">Cart</Link></li>
                        </ul>
                    </div>
                    
                    <div className="footer-section">
                        <h3>Make Money with Us</h3>
                        <ul>
                            <li><a href="#">Sell products</a></li>
                            <li><a href="#">Sell on Business</a></li>
                            <li><a href="#">Advertise Your Products</a></li>
                            <li><a href="#">Self-Publish with Us</a></li>
                        </ul>
                    </div>
                    
                    <div className="footer-section">
                        <h3>Let Us Help You</h3>
                        <ul>
                            <li><Link to="/profile">Your Account</Link></li>
                            <li><Link to="/orders">Your Orders</Link></li>
                            <li><a href="#">Returns & Replacements</a></li>
                            <li><a href="#">Help</a></li>
                        </ul>
                    </div>
                    
                    <div className="footer-section">
                        <h3>Contact Us</h3>
                        <ul className="contact-info">
                            <li>📞 +44 20 7946 0123</li>
                            <li>✉️ support@hexa.com</li>
                            <li>📍 123 Northern Park Lane, West London, W1A 4ZZ, United Kingdom</li>
                        </ul>
                    </div>
                </div>
                
                <div className="footer-bottom">
                    <p>&copy; 2024 HEXA Clothing. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;