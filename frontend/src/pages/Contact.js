import React, { useState } from 'react';
import axios from '../api/axios';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'General Inquiry'
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const inquiryOptions = [
    'General Inquiry',
    'Temple Granite',
    'Kitchen Countertop',
    'Flooring',
    'Wall Cladding',
    'Monument',
    'Custom Design'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await axios.post('/api/inquiries', formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'General Inquiry'
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <div className="container">
          <h1 className="page-title">Contact Us</h1>
          <p className="page-subtitle">
            Get in touch with us for inquiries and quotes
          </p>
        </div>
      </div>

      <div className="contact-content">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Information */}
            <div className="contact-info">
              <h2>Get In Touch</h2>
              <p className="contact-intro">
                Have questions about our granite services? We're here to help! 
                Reach out to us through any of the following channels or fill out 
                the contact form.
              </p>

              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon">
                    <MapPin size={24} />
                  </div>
                  <div className="contact-text">
                    <h4>Visit Us</h4>
                    <p>No 3/6a, Salem to Namakkal Bypass Road<br />Masakalipatti Bus Stop, Masakalipatti<br />Namakkal - 637401, Tamil Nadu</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <Phone size={24} />
                  </div>
                  <div className="contact-text">
                    <h4>Call Us</h4>
                    <p>Available 24 Hours<br />Contact for inquiries</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <Mail size={24} />
                  </div>
                  <div className="contact-text">
                    <h4>Email Us</h4>
                    <p>info@vktngranites.com<br />sales@vktngranites.com</p>
                  </div>
                </div>
              </div>

              <div className="business-hours">
                <h3>Business Hours</h3>
                <div className="hours-list">
                  <div className="hours-item">
                    <span>Open 24 Hours</span>
                    <span>All Days</span>
                  </div>
                  <div className="hours-item">
                    <span>GSTIN</span>
                    <span>33AAGFV6548Q1ZE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-container">
              <h2>Send Us a Message</h2>
              
              {success && (
                <div className="alert alert-success">
                  <CheckCircle size={20} />
                  <span>Thank you! Your inquiry has been submitted successfully. We'll get back to you soon.</span>
                </div>
              )}

              {error && (
                <div className="alert alert-error">
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="inquiryType">Inquiry Type</label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                    >
                      {inquiryOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What is this regarding?"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Tell us more about your requirements..."
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-gold" disabled={loading}>
                  {loading ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Message <Send size={20} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="map-section">
        <div className="container">
          <h2 className="section-title">Find Us</h2>
          <div className="map-container">
            <iframe
              title="VKTN Granites Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3910.0!2d78.1667!3d11.2167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDEzJzAwLjEiTiA3OMKwMTAnMDAuMSJF!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="450"
              style={{ border: 0, borderRadius: '12px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
