import React from 'react';
import { Award, Users, Target, Heart, CheckCircle, TrendingUp } from 'lucide-react';
import './About.css';

function About() {
  return (
    <div className="about-page">
      <div className="about-header">
        <div className="container">
          <h1 className="page-title">About VKTN Granites</h1>
          <p className="page-subtitle">
            Crafting Excellence in Stone Since Decades
          </p>
        </div>
      </div>

      <div className="about-content">
        {/* Company Story */}
        <section className="company-story">
          <div className="container">
            <div className="story-grid">
              <div className="story-image">
                <img 
                  src="https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=800" 
                  alt="Temple Granite Workshop" 
                />
              </div>
              <div className="story-text">
                <h2>Our Story</h2>
                <p>
                  VKTN Granites was founded with a vision to provide the finest quality granite 
                  for temples, homes, and commercial spaces. With over 25 years of experience in 
                  the industry, we have established ourselves as a trusted name in premium granite 
                  supply and craftsmanship.
                </p>
                <p>
                  Our journey began with a small workshop and a commitment to quality. Today, we 
                  serve clients across India, delivering exceptional granite products that combine 
                  traditional craftsmanship with modern technology.
                </p>
                <p>
                  Every piece of granite we supply is carefully selected and processed to meet the 
                  highest standards of quality, durability, and aesthetic appeal. Our team of skilled 
                  artisans brings decades of expertise to every project.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="values-section">
          <div className="container">
            <h2 className="section-title">Our Core Values</h2>
            <p className="section-subtitle">
              The principles that guide everything we do
            </p>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">
                  <Award size={40} />
                </div>
                <h3>Quality Excellence</h3>
                <p>
                  We never compromise on quality. Every granite piece is meticulously 
                  inspected to ensure it meets our rigorous standards.
                </p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <Heart size={40} />
                </div>
                <h3>Customer Satisfaction</h3>
                <p>
                  Our clients' satisfaction is our top priority. We go above and beyond 
                  to exceed expectations on every project.
                </p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <Users size={40} />
                </div>
                <h3>Expert Craftsmanship</h3>
                <p>
                  Our team of skilled artisans brings traditional techniques and modern 
                  precision to create stunning granite works.
                </p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <Target size={40} />
                </div>
                <h3>Timely Delivery</h3>
                <p>
                  We understand the importance of deadlines and ensure on-time delivery 
                  without compromising quality.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <TrendingUp size={40} />
                </div>
                <h3>500+</h3>
                <p>Projects Completed</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Award size={40} />
                </div>
                <h3>25+</h3>
                <p>Years of Experience</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Users size={40} />
                </div>
                <h3>1000+</h3>
                <p>Happy Clients</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <CheckCircle size={40} />
                </div>
                <h3>100%</h3>
                <p>Quality Assurance</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="why-choose-us">
          <div className="container">
            <h2 className="section-title">Why Choose VKTN Granites?</h2>
            <div className="reasons-grid">
              <div className="reason-item">
                <CheckCircle size={24} className="check-icon" />
                <div>
                  <h4>Premium Quality Materials</h4>
                  <p>We source only the finest granite from trusted quarries</p>
                </div>
              </div>
              <div className="reason-item">
                <CheckCircle size={24} className="check-icon" />
                <div>
                  <h4>Expert Consultation</h4>
                  <p>Our team provides professional guidance for your project</p>
                </div>
              </div>
              <div className="reason-item">
                <CheckCircle size={24} className="check-icon" />
                <div>
                  <h4>Custom Solutions</h4>
                  <p>Tailored designs to match your specific requirements</p>
                </div>
              </div>
              <div className="reason-item">
                <CheckCircle size={24} className="check-icon" />
                <div>
                  <h4>Competitive Pricing</h4>
                  <p>Best value for premium quality granite products</p>
                </div>
              </div>
              <div className="reason-item">
                <CheckCircle size={24} className="check-icon" />
                <div>
                  <h4>Nationwide Delivery</h4>
                  <p>We deliver across India with careful handling</p>
                </div>
              </div>
              <div className="reason-item">
                <CheckCircle size={24} className="check-icon" />
                <div>
                  <h4>After-Sales Support</h4>
                  <p>Continued assistance even after project completion</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mission-vision">
          <div className="container">
            <div className="mv-grid">
              <div className="mv-card">
                <Target size={48} />
                <h3>Our Mission</h3>
                <p>
                  To provide the highest quality granite products and services that exceed 
                  our clients' expectations, while maintaining integrity, craftsmanship, and 
                  innovation in everything we do.
                </p>
              </div>
              <div className="mv-card">
                <TrendingUp size={48} />
                <h3>Our Vision</h3>
                <p>
                  To be the most trusted and preferred granite supplier in India, known for 
                  our commitment to quality, customer satisfaction, and sustainable practices 
                  in the stone industry.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;
