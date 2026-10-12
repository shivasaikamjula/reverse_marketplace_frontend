import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  PlusCircle, 
  FileText, 
  Package, 
  Shield, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Menu, 
  X,
  Search
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isCustomer, isProvider, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={closeMenu}>
          <div className="logo-icon">
            <Briefcase size={22} color="#ffffff" />
          </div>
          <span className="brand-title">
            Reverse<span className="gradient-text">Market</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="nav-links desktop-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/browse" className="nav-link">
            <Search size={16} /> Browse Needs
          </Link>

          {isCustomer && (
            <>
              <Link to="/post-requirement" className="nav-btn-highlight">
                <PlusCircle size={16} /> Post Service Need
              </Link>
              <Link to="/my-requirements" className="nav-link">
                <FileText size={16} /> My Requirements
              </Link>
              <Link to="/my-orders" className="nav-link">
                <Package size={16} /> My Orders
              </Link>
              <Link to="/customer-dashboard" className="nav-link">Dashboard</Link>
            </>
          )}

          {isProvider && (
            <>
              <Link to="/browse" className="nav-btn-highlight">
                <Briefcase size={16} /> Bid on Jobs
              </Link>
              <Link to="/my-orders" className="nav-link">
                <Package size={16} /> Active Orders
              </Link>
            </>
          )}

          {isAdmin && (
            <Link to="/admin" className="nav-link admin-pill">
              <Shield size={16} /> Admin Portal
            </Link>
          )}
        </div>

        {/* Desktop User / Auth Actions */}
        <div className="nav-actions desktop-actions">
          {isAuthenticated ? (
            <div className="user-profile-badge">
              <div className="user-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="user-meta">
                <span className="user-name">{user.name}</span>
                <span className={`user-role-tag role-${user.role.toLowerCase()}`}>
                  {user.role}
                </span>
              </div>
              <button onClick={handleLogout} className="btn-logout" title="Log Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">
                <LogIn size={16} /> Login
              </Link>
              <Link to="/register" className="btn-register">
                <UserPlus size={16} /> Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-link" onClick={closeMenu}>Home</Link>
          <Link to="/browse" className="mobile-link" onClick={closeMenu}>Browse Needs</Link>

          {isCustomer && (
            <>
              <Link to="/post-requirement" className="mobile-link highlight" onClick={closeMenu}>
                + Post Service Need
              </Link>
              <Link to="/my-requirements" className="mobile-link" onClick={closeMenu}>
                My Requirements
              </Link>
              <Link to="/my-orders" className="mobile-link" onClick={closeMenu}>
                My Orders
              </Link>
              <Link to="/customer-dashboard" className="mobile-link" onClick={closeMenu}>
                Dashboard
              </Link>
            </>
          )}

          {isProvider && (
            <>
              <Link to="/browse" className="mobile-link highlight" onClick={closeMenu}>
                Bid on Open Jobs
              </Link>
              <Link to="/my-orders" className="mobile-link" onClick={closeMenu}>
                Active Orders
              </Link>
            </>
          )}

          {isAdmin && (
            <Link to="/admin" className="mobile-link highlight" onClick={closeMenu}>
              Admin Portal
            </Link>
          )}

          <div className="mobile-auth-divider"></div>

          {isAuthenticated ? (
            <div className="mobile-user-box">
              <div className="mobile-user-info">
                <strong>{user.name}</strong> ({user.role})
              </div>
              <button onClick={handleLogout} className="btn-logout-mobile">
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div className="mobile-auth-actions">
              <Link to="/login" className="btn-login-block" onClick={closeMenu}>Login</Link>
              <Link to="/register" className="btn-register-block" onClick={closeMenu}>Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
