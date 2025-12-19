import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { User, Mail, Phone, MapPin, Edit, Save, X, Calendar, Shield } from 'lucide-react';
import './UserProfile.css';

function UserProfile() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role === 'admin') {
      navigate('/admin-profile');
      return;
    }

    // Fetch latest user data
    fetchUserData();
  }, [user, navigate]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      setFormData({
        name: response.data.name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        address: response.data.address || ''
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      setMessage({ type: 'error', text: 'Failed to load profile data' });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const result = await updateProfile(formData);

    if (result.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } else {
      setMessage({ type: 'error', text: result.message || 'Failed to update profile' });
    }
    setLoading(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      setLoading(false);
      return;
    }

    try {
      const result = await updateProfile({
        password: passwordData.newPassword
      });

      if (result.success) {
        setMessage({ type: 'success', text: 'Password updated successfully!' });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswordForm(false);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to update password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update password' });
    }
    setLoading(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user || user.role === 'admin') {
    return null;
  }

  return (
    <div className="user-profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <User size={48} />
          </div>
          <div className="profile-title">
            <h1>{formData.name || user.name}</h1>
            <p className="profile-role">
              <Shield size={16} />
              Regular User
            </p>
          </div>
          {!isEditing && (
            <button 
              className="btn-edit"
              onClick={() => setIsEditing(true)}
            >
              <Edit size={18} />
              Edit Profile
            </button>
          )}
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        {isEditing ? (
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Personal Information</h2>
              <div className="form-group">
                <label>
                  <User size={18} />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <Mail size={18} />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="disabled-input"
                />
                <small>Email cannot be changed</small>
              </div>

              <div className="form-group">
                <label>
                  <Phone size={18} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group">
                <label>
                  <MapPin size={18} />
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  rows="3"
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  setIsEditing(false);
                  fetchUserData();
                  setMessage({ type: '', text: '' });
                }}
              >
                <X size={18} />
                Cancel
              </button>
              <button
                type="submit"
                className="btn-save"
                disabled={loading}
              >
                <Save size={18} />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-section">
              <h2>Personal Information</h2>
              <div className="info-item">
                <div className="info-label">
                  <User size={20} />
                  Full Name
                </div>
                <div className="info-value">{formData.name || 'Not set'}</div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <Mail size={20} />
                  Email
                </div>
                <div className="info-value">{formData.email}</div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <Phone size={20} />
                  Phone Number
                </div>
                <div className="info-value">{formData.phone || 'Not set'}</div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <MapPin size={20} />
                  Address
                </div>
                <div className="info-value">{formData.address || 'Not set'}</div>
              </div>
            </div>

            <div className="info-section">
              <h2>Account Information</h2>
              <div className="info-item">
                <div className="info-label">
                  <Calendar size={20} />
                  Member Since
                </div>
                <div className="info-value">
                  {formatDate(user.createdAt)}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <Calendar size={20} />
                  Last Login
                </div>
                <div className="info-value">
                  {formatDate(user.lastLogin)}
                </div>
              </div>
            </div>

            <div className="password-section">
              <h2>Security</h2>
              {!showPasswordForm ? (
                <button
                  className="btn-change-password"
                  onClick={() => setShowPasswordForm(true)}
                >
                  Change Password
                </button>
              ) : (
                <form className="password-form" onSubmit={handlePasswordSubmit}>
                  <div className="form-group">
                    <label>Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password (min 6 characters)"
                      minLength="6"
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                      minLength="6"
                    />
                  </div>
                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-save"
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;

