import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Filter, Star } from 'lucide-react';
import './Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Temple Granite', 'Kitchen Countertop', 'Flooring', 'Wall Cladding', 'Monument', 'Custom'];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
      setFilteredProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.color.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <div className="container">
          <h1 className="page-title">Our Products</h1>
          <p className="page-subtitle">
            Explore our premium collection of granite products
          </p>
        </div>
      </div>

      <div className="products-content">
        <div className="container">
          {/* Filters */}
          <div className="products-filters">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="category-filters">
              <Filter size={20} />
              <div className="category-buttons">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : (
            <>
              <div className="products-count">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </div>

              {filteredProducts.length > 0 ? (
                <div className="products-grid">
                  {filteredProducts.map((product) => (
                    <div key={product._id} className="product-card card">
                      <div className="product-image">
                        <img src={product.imageUrl} alt={product.name} />
                        {product.featured && (
                          <div className="product-badge">
                            <Star size={16} fill="currentColor" />
                            Featured
                          </div>
                        )}
                      </div>
                      <div className="product-info">
                        <h3>{product.name}</h3>
                        <p className="product-category">{product.category}</p>
                        <p className="product-description">{product.description}</p>
                        
                        <div className="product-details">
                          <div className="detail-item">
                            <span className="detail-label">Color:</span>
                            <span className="detail-value">{product.color}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Origin:</span>
                            <span className="detail-value">{product.origin}</span>
                          </div>
                          {product.specifications?.finish && (
                            <div className="detail-item">
                              <span className="detail-label">Finish:</span>
                              <span className="detail-value">{product.specifications.finish}</span>
                            </div>
                          )}
                        </div>

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
                  ))}
                </div>
              ) : (
                <div className="no-products">
                  <p>No products found matching your criteria.</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;
