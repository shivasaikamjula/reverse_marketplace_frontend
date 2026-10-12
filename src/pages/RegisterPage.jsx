import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Lock, Phone, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    const res = await register(name, email, password, role, phone);
    if (res.success) {
      if (role === 'CUSTOMER') {
        navigate('/customer-dashboard');
      } else {
        navigate('/browse');
      }
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-circle">
            <UserPlus size={28} color="#ffffff" />
          </div>
          <h2>Create An Account</h2>
          <p>Join the Reverse Marketplace network in seconds</p>
        </div>

        {errorMsg && (
          <div className="alert-box alert-error">
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Role Selection Tabs */}
          <div className="role-selection-group">
            <label className="field-label-header">I want to join as:</label>
            <div className="role-pills-row">
              <button
                type="button"
                className={`role-pill-btn ${role === 'CUSTOMER' ? 'active' : ''}`}
                onClick={() => setRole('CUSTOMER')}
              >
                <div className="role-title">Customer</div>
                <div className="role-desc">Post requirements & compare bids</div>
              </button>
              <button
                type="button"
                className={`role-pill-btn ${role === 'PROVIDER' ? 'active' : ''}`}
                onClick={() => setRole('PROVIDER')}
              >
                <div className="role-title">Service Provider</div>
                <div className="role-desc">Browse jobs & submit price offers</div>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <div className="input-with-icon">
              <User size={18} className="field-icon" />
              <input
                type="text"
                placeholder="e.g. John Doe or Apex Plumbing"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="field-icon" />
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <div className="input-with-icon">
              <Phone size={18} className="field-icon" />
              <input
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password (min 6 characters)</label>
            <div className="input-with-icon">
              <Lock size={18} className="field-icon" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-submit-auth" disabled={loading}>
            {loading ? 'Creating Account...' : 'Complete Registration'} <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer-link">
          Already have an account? <Link to="/login">Sign in here</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
