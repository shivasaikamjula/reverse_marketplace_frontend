import React from 'react';
import { Briefcase, Heart, Award, ShieldCheck, Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <Briefcase size={22} color="#ffffff" />
            <span>Reverse<span className="gradient-text">Market</span></span>
          </div>
          <p className="footer-desc">
            A next-generation reverse marketplace for local services. Customers broadcast their requirements, and certified local service providers bid competitive prices and timelines.
          </p>
          <div className="footer-badges">
            <span className="badge"><ShieldCheck size={14} /> Verified Providers</span>
            <span className="badge"><Award size={14} /> Competitive Bids</span>
            <span className="badge"><Zap size={14} /> Fast Turnaround</span>
          </div>
        </div>

        <div className="footer-links-col">
          <h4>Marketplace</h4>
          <a href="/browse">Browse Requirements</a>
          <a href="/post-requirement">Post a Requirement</a>
          <a href="/login">Service Provider Login</a>
          <a href="/register">Join as Professional</a>
        </div>

        <div className="footer-links-col">
          <h4>Popular Services</h4>
          <span>Plumbing & Leakages</span>
          <span>Electrical Repairs</span>
          <span>AC Repair & Servicing</span>
          <span>Vehicle Breakdown</span>
          <span>Home Cleaning</span>
        </div>

        <div className="footer-links-col">
          <h4>College Viva Details</h4>
          <p className="tech-badge"><strong>Backend:</strong> Spring Boot 3 & MySQL</p>
          <p className="tech-badge"><strong>Frontend:</strong> React.js & Pure CSS</p>
          <p className="tech-badge"><strong>Security:</strong> JWT & BCrypt</p>
          <p className="tech-badge"><strong>Author:</strong> B.Tech 3rd Year Project</p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p>© 2026 Reverse Marketplace for Local Services. Designed for College Practical Demonstration.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
