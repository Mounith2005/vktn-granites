import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, AlertCircle } from 'lucide-react';
import './Auth.css';

function AdminLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

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

    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Check if user is admin
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData && userData.role === 'admin') {
        navigate('/admin');
      } else {
        setError('Access denied. Admin credentials required.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card admin-card">
          <div className="auth-header">
            <Shield size={48} className="auth-icon" style={{ color: '#dc3545' }} />
            <h1>Admin Portal</h1>
            <p>Authorized Personnel Only</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">
                <Mail size={18} />
                Admin Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="admin@vktngranites.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <Lock size={18} />
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter admin password"
              />
            </div>

            <button type="submit" className="btn btn-admin btn-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login as Admin'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Regular user? <Link to="/login">Login here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
