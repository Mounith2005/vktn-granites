import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Mountain, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <Mountain size={32} />
          <span>VKTN Granites</span>
        </Link>

        <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
            className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={`navbar-link ${location.pathname === '/about' ? 'active' : ''}`}
            onClick={closeMenu}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className={`navbar-link ${location.pathname === '/contact' ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Contact
          </Link>
          
          {user && (
            <>
              {user.role === 'admin' ? (
                <Link 
                  to="/admin" 
                  className={`navbar-link ${location.pathname === '/admin' ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  Admin Dashboard
                </Link>
              ) : (
                <>
                  <Link 
                    to="/place-order" 
                    className={`navbar-link ${location.pathname === '/place-order' ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    Place Order
                  </Link>
                  <Link 
                    to="/my-orders" 
                    className={`navbar-link ${location.pathname === '/my-orders' ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    My Orders
                  </Link>
                </>
              )}
            </>
          )}
          
          {user ? (
            <>
              <Link 
                to={user.role === 'admin' ? '/admin-profile' : '/profile'}
                className={`navbar-user ${location.pathname === '/profile' || location.pathname === '/admin-profile' ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <User size={18} />
                {user.name}
              </Link>
              <button onClick={handleLogout} className="navbar-logout">
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <Link 
              to="/login-select" 
              className="navbar-login"
              onClick={closeMenu}
            >
              <User size={18} />
              Login
            </Link>
          )}
        </div>

        <div className="navbar-toggle" onClick={toggleMenu}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
