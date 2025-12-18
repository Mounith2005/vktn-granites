import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, CheckCircle, Star, Award, Users, Sparkles } from 'lucide-react';
import './Home.css';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get('/api/products?featured=true');
      const products = Array.isArray(response.data) ? response.data : [];
      setFeaturedProducts(products.slice(0, 3));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setFeaturedProducts([]); // Ensure it's always an array
      setLoading(false);
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title fade-in">
            Premium VKTN Granites
          </h1>
          <p className="hero-subtitle fade-in">
            Crafting Divine Spaces with Timeless Elegance and Unmatched Quality
          </p>
          <div className="hero-buttons fade-in">
            <Link to="/products" className="btn btn-gold">
              Explore Products <ArrowRight size={20} />
            </Link>
            <Link to="/contact" className="btn btn-secondary">
              Get Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Award size={40} />
              </div>
              <h3>Premium Quality</h3>
              <p>Handpicked granite with superior finish and durability</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Users size={40} />
              </div>
              <h3>Expert Craftsmen</h3>
              <p>Skilled artisans with decades of experience</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Sparkles size={40} />
              </div>
              <h3>Custom Designs</h3>
              <p>Tailored solutions for your unique requirements</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <CheckCircle size={40} />
              </div>
              <h3>Timely Delivery</h3>
              <p>On-time delivery with careful handling</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="about-preview">
        <div className="container">
          <div className="about-preview-grid">
            <div className="about-preview-image">
              <img 
                src="https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=800" 
                alt="Temple Granite" 
              />
            </div>
            <div className="about-preview-content">
              <h2 className="section-title">About VKTN Granites</h2>
              <p className="about-text">
                With decades of experience in the granite industry, VKTN Granites has been 
                the trusted choice for temples, homes, and commercial spaces across India. 
                We specialize in premium quality granite that combines beauty with durability.
              </p>
              <div className="about-stats">
                <div className="stat">
                  <h3>500+</h3>
                  <p>Projects Completed</p>
                </div>
                <div className="stat">
                  <h3>25+</h3>
                  <p>Years Experience</p>
                </div>
                <div className="stat">
                  <h3>100%</h3>
                  <p>Client Satisfaction</p>
                </div>
              </div>
              <Link to="/about" className="btn btn-primary">
                Learn More <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          <p className="section-subtitle">
            Discover our premium collection of temple granites
          </p>
          
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : (
            <div className="products-grid">
              {featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <div key={product._id} className="product-card card">
                    <div className="product-image">
                      <img src={product.imageUrl} alt={product.name} />
                      <div className="product-badge">
                        <Star size={16} fill="currentColor" />
                        Featured
                      </div>
                    </div>
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p className="product-category">{product.category}</p>
                      <p className="product-description">{product.description}</p>
                      <div className="product-footer">
                        <span className="product-price">
                          ₹{product.price} {product.priceUnit}
                        </span>
                        <span className={`product-stock ${product.inStock ? 'in-stock' : 'out-stock'}`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-products">
                  <p>No featured products available at the moment.</p>
                </div>
              )}
            </div>
          )}
          
          <div className="view-all">
            <Link to="/products" className="btn btn-primary">
              View All Products <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Project?</h2>
            <p>Get in touch with us for a free consultation and quote</p>
            <Link to="/contact" className="btn btn-gold">
              Contact Us Today <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
