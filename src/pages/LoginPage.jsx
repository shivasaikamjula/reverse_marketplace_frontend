import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Lock, Mail, AlertCircle, ArrowRight, UserCheck, Shield, Wrench } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrorMsg('');
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-circle">
            <LogIn size={28} color="#ffffff" />
          </div>
          <h2>Welcome Back</h2>
          <p>Log in to access your Reverse Marketplace account</p>
        </div>

        {errorMsg && (
          <div className="alert-box alert-error">
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="field-icon" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
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
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
          </button>
        </form>

        {/* Viva / Quick Demo Section */}
        <div className="demo-accounts-box">
          <p className="demo-accounts-title">Quick Demo Login (Pre-seeded Accounts):</p>
          <div className="demo-buttons-grid">
            <button
              type="button"
              className="btn-demo-badge"
              onClick={() => handleQuickLogin('customer@demo.com', 'demo123')}
            >
              <UserCheck size={14} /> Customer
            </button>
            <button
              type="button"
              className="btn-demo-badge"
              onClick={() => handleQuickLogin('provider@demo.com', 'demo123')}
            >
              <Wrench size={14} /> Provider
            </button>
            <button
              type="button"
              className="btn-demo-badge"
              onClick={() => handleQuickLogin('admin@marketplace.com', 'admin123')}
            >
              <Shield size={14} /> Admin
            </button>
          </div>
        </div>

        <div className="auth-footer-link">
          Don't have an account yet? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
