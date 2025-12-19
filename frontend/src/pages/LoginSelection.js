import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, ArrowRight } from 'lucide-react';
import './LoginSelection.css';

function LoginSelection() {
  const navigate = useNavigate();

  return (
    <div className="login-selection-page">
      <div className="selection-container">
        <div className="selection-header">
          <h1>Welcome to VKTN Granites</h1>
          <p>Please select your login type</p>
        </div>

        <div className="selection-cards">
          {/* User Login Card */}
          <div className="selection-card user-card" onClick={() => navigate('/login')}>
            <div className="card-icon user-icon">
              <User size={48} />
            </div>
            <h2>Customer Login</h2>
            <p>Login to place orders and track your temple granite orders</p>
            <ul className="card-features">
              <li>Place new orders</li>
              <li>Track order status</li>
              <li>View order history</li>
              <li>Manage your account</li>
            </ul>
            <button className="selection-btn user-btn">
              Login as Customer
              <ArrowRight size={20} />
            </button>
            <div className="card-footer">
              Don't have an account? <span onClick={(e) => { e.stopPropagation(); navigate('/register'); }}>Register here</span>
            </div>
          </div>

          {/* Admin Login Card */}
          <div className="selection-card admin-card" onClick={() => navigate('/admin-login')}>
            <div className="card-icon admin-icon">
              <Shield size={48} />
            </div>
            <h2>Admin Portal</h2>
            <p>Secure access for authorized personnel only</p>
            <ul className="card-features">
              <li>View all orders</li>
              <li>Manage order status</li>
              <li>Access analytics</li>
              <li>Customer management</li>
            </ul>
            <button className="selection-btn admin-btn">
              Access Admin Portal
              <ArrowRight size={20} />
            </button>
            <div className="card-footer admin-footer">
              <Shield size={14} />
              Restricted Access
            </div>
          </div>
        </div>

        <div className="selection-footer">
          <p>Need help? <a href="/contact">Contact Support</a></p>
        </div>
      </div>
    </div>
  );
}

export default LoginSelection;
