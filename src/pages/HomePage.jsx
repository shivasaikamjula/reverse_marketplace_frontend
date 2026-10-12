import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Wrench, 
  Zap, 
  Wind, 
  Car, 
  Sparkles, 
  Paintbrush, 
  Laptop, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  TrendingDown, 
  ShieldCheck, 
  Clock, 
  Star,
  MapPin,
  Tag
} from 'lucide-react';

const iconMap = {
  Wrench: <Wrench size={26} />,
  Zap: <Zap size={26} />,
  Wind: <Wind size={26} />,
  Car: <Car size={26} />,
  Sparkles: <Sparkles size={26} />,
  Paintbrush: <Paintbrush size={26} />,
  Laptop: <Laptop size={26} />,
};

const HomePage = () => {
  const { isAuthenticated, isCustomer, isProvider } = useAuth();
  const [categories, setCategories] = useState([]);
  const [recentRequirements, setRecentRequirements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, reqRes] = await Promise.all([
          api.get('/categories'),
          api.get('/requirements/public')
        ]);
        if (catRes.data.success) setCategories(catRes.data.data);
        if (reqRes.data.success) setRecentRequirements(reqRes.data.data.slice(0, 6));
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-badge">
            <TrendingDown size={16} /> <span>Smart Reverse Bidding — Providers Compete For Your Job</span>
          </div>
          <h1 className="hero-title">
            Post Your Service Need.<br />
            <span className="gradient-text">Top Local Pros Bid Best Prices.</span>
          </h1>
          <p className="hero-subtitle">
            Say goodbye to endless phone calls and overpriced estimates. Describe your requirement in 60 seconds, receive multiple competitive offers, compare provider ratings, and hire the best.
          </p>
          <div className="hero-cta-group">
            {isAuthenticated ? (
              isCustomer ? (
                <Link to="/post-requirement" className="btn-primary-hero">
                  Post a Service Requirement <ArrowRight size={18} />
                </Link>
              ) : (
                <Link to="/browse" className="btn-primary-hero">
                  Browse Open Requirements & Bid <ArrowRight size={18} />
                </Link>
              )
            ) : (
              <>
                <Link to="/register" className="btn-primary-hero">
                  Get Started Free <ArrowRight size={18} />
                </Link>
                <Link to="/browse" className="btn-secondary-hero">
                  Explore Open Demands
                </Link>
              </>
            )}
          </div>

          <div className="hero-metrics">
            <div className="metric-item">
              <span className="metric-number">100%</span>
              <span className="metric-label">Verified Providers</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <span className="metric-number">Avg 35%</span>
              <span className="metric-label">Cost Savings</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <span className="metric-number">&lt; 2 Hrs</span>
              <span className="metric-label">First Bid Received</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header">
          <h2 className="section-title">How The Reverse Marketplace Works</h2>
          <p className="section-subtitle">
            A customer-centric model where service providers submit transparent price & time bids to you.
          </p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <div className="step-icon-wrap">
              <Sparkles size={28} color="#4f46e5" />
            </div>
            <h3>Post Your Need</h3>
            <p>Customer specifies the problem, category, desired budget, location, and preferred deadline.</p>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <div className="step-icon-wrap">
              <TrendingDown size={28} color="#7c3aed" />
            </div>
            <h3>Providers Submit Offers</h3>
            <p>Verified local technicians and mechanics view your requirement and bid competitive pricing & completion time.</p>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <div className="step-icon-wrap">
              <CheckCircle2 size={28} color="#10b981" />
            </div>
            <h3>Compare & Accept</h3>
            <p>Compare bids side-by-side by price, estimated time, and provider ratings. Accept the winner and hire with one click.</p>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="categories-section">
        <div className="section-header">
          <h2 className="section-title">Service Categories</h2>
          <p className="section-subtitle">Browse requirements or find expert professionals across these services.</p>
        </div>

        <div className="category-grid">
          {categories.map((cat) => (
            <Link to={`/browse?category=${cat.id}`} key={cat.id} className="category-card">
              <div className="cat-icon-box">
                {iconMap[cat.icon] || <Layers size={26} />}
              </div>
              <h4>{cat.name}</h4>
              <p>{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Open Requirements Section */}
      <section className="recent-requirements-section">
        <div className="section-header flex-between">
          <div>
            <h2 className="section-title">Latest Customer Requirements</h2>
            <p className="section-subtitle">Real-time local job demands waiting for provider proposals.</p>
          </div>
          <Link to="/browse" className="link-see-all">
            View All ({recentRequirements.length}) <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="loading-spinner-box">Loading available requirements...</div>
        ) : recentRequirements.length === 0 ? (
          <div className="empty-state-box">
            <p>No requirements posted yet. Be the first to create one!</p>
            <Link to="/post-requirement" className="btn-primary-sm">Post Requirement</Link>
          </div>
        ) : (
          <div className="requirements-cards-grid">
            {recentRequirements.map((req) => (
              <div key={req.id} className="requirement-card">
                <div className="req-card-header">
                  <span className="req-cat-pill">{req.category?.name}</span>
                  <span className="req-budget-tag">Budget: ₹{req.budget}</span>
                </div>
                <h3 className="req-title">{req.title}</h3>
                <p className="req-desc">{req.description.substring(0, 110)}...</p>

                <div className="req-meta-row">
                  <span><MapPin size={14} /> {req.location}</span>
                  <span><Clock size={14} /> {req.deadline || 'Flexible'}</span>
                </div>

                <div className="req-card-footer">
                  <div className="req-bid-count">
                    <Tag size={14} /> <strong>{req.offerCount}</strong> offers received
                  </div>
                  <Link to={`/browse?id=${req.id}`} className="btn-view-bid">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
