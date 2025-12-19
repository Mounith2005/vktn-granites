import React from 'react';
import { Link } from 'react-router-dom';
import { Mountain, Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-section">
            <div className="footer-logo">
              <Mountain size={32} />
              <span>VKTN Granites</span>
            </div>
            <p className="footer-description">
              Premium quality granite for temples, homes, and commercial spaces. 
              Crafting excellence in stone since decades.
            </p>
            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <div className="footer-section">
              <h3>Quick Links</h3>
              <Link to="/">Home</Link>
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3 className="footer-title">Contact Us</h3>
            <div className="footer-contact">
              <div className="contact-item">
                <MapPin size={18} />
                <span>No 3/6a, Salem to Namakkal Bypass Road, Masakalipatti, Namakkal - 637401</span>
              </div>
              <div className="contact-item">
                <Phone size={18} />
                <span>Open 24 Hours</span>
              </div>
              <div className="contact-item">
                <Mail size={18} />
                <span>info@vktngranites.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} VKTN Granites. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#privacy">Privacy Policy</a>
            <span>|</span>
            <a href="#terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
