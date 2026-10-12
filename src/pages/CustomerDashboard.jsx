import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, 
  Tag, 
  Package, 
  CheckCircle, 
  PlusCircle, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Eye, 
  AlertCircle 
} from 'lucide-react';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [requirements, setRequirements] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [reqRes, ordRes] = await Promise.all([
          api.get('/requirements/my'),
          api.get('/orders/my')
        ]);
        if (reqRes.data.success) setRequirements(reqRes.data.data);
        if (ordRes.data.success) setOrders(ordRes.data.data);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const totalOffers = requirements.reduce((acc, r) => acc + (r.offerCount || 0), 0);
  const activeOrders = orders.filter((o) => o.status === 'ACTIVE').length;
  const completedOrders = orders.filter((o) => o.status === 'COMPLETED').length;

  return (
    <div className="dashboard-container">
      {/* Header Banner */}
      <div className="dashboard-header">
        <div>
          <h2>Welcome back, <span className="gradient-text">{user?.name}</span> 👋</h2>
          <p>Monitor your active service requirements, compare incoming offers, and manage bookings.</p>
        </div>
        <Link to="/post-requirement" className="btn-primary-highlight">
          <PlusCircle size={18} /> Post New Requirement
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-stat-card">
          <div className="metric-icon-bubble bg-indigo">
            <FileText size={24} color="#4f46e5" />
          </div>
          <div className="metric-data">
            <span className="metric-val">{requirements.length}</span>
            <span className="metric-title">Requirements Posted</span>
          </div>
        </div>

        <div className="metric-stat-card">
          <div className="metric-icon-bubble bg-purple">
            <Tag size={24} color="#7c3aed" />
          </div>
          <div className="metric-data">
            <span className="metric-val">{totalOffers}</span>
            <span className="metric-title">Offers Received</span>
          </div>
        </div>

        <div className="metric-stat-card">
          <div className="metric-icon-bubble bg-blue">
            <Clock size={24} color="#0284c7" />
          </div>
          <div className="metric-data">
            <span className="metric-val">{activeOrders}</span>
            <span className="metric-title">In-Progress Orders</span>
          </div>
        </div>

        <div className="metric-stat-card">
          <div className="metric-icon-bubble bg-green">
            <CheckCircle size={24} color="#10b981" />
          </div>
          <div className="metric-data">
            <span className="metric-val">{completedOrders}</span>
            <span className="metric-title">Completed Services</span>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="dashboard-content-grid">
        {/* Recent Posted Requirements */}
        <div className="dash-card-section">
          <div className="dash-section-header">
            <h3>Recent Service Demands</h3>
            <Link to="/my-requirements" className="link-subtle">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="loading-state">Loading requirements...</div>
          ) : requirements.length === 0 ? (
            <div className="empty-box">
              <p>You haven't posted any service requirements yet.</p>
              <Link to="/post-requirement" className="btn-primary-sm">
                Post Your First Requirement
              </Link>
            </div>
          ) : (
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Requirement Title</th>
                    <th>Category</th>
                    <th>Budget</th>
                    <th>Bids Received</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requirements.slice(0, 5).map((req) => (
                    <tr key={req.id}>
                      <td>
                        <strong>{req.title}</strong>
                        <div className="table-sub"><MapPin size={12} /> {req.location}</div>
                      </td>
                      <td><span className="table-badge">{req.category?.name}</span></td>
                      <td>₹{req.budget}</td>
                      <td>
                        <span className="bid-count-badge">
                          {req.offerCount} bids
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill status-${req.status.toLowerCase()}`}>
                          {req.status}
                        </span>
                      </td>
                      <td>
                        <Link to={`/compare-offers/${req.id}`} className="btn-action-compare">
                          <Eye size={14} /> Compare Bids
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Orders Status */}
        <div className="dash-card-section">
          <div className="dash-section-header">
            <h3>Active Service Orders</h3>
            <Link to="/my-orders" className="link-subtle">
              Go To Orders <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="loading-state">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="empty-box">
              <p>No active orders right now. Accept an offer from your requirements to hire a pro!</p>
            </div>
          ) : (
            <div className="orders-summary-list">
              {orders.slice(0, 4).map((ord) => (
                <div key={ord.id} className="order-summary-item">
                  <div className="order-item-left">
                    <span className={`order-status-dot ${ord.status.toLowerCase()}`}></span>
                    <div>
                      <h4>{ord.requirement?.title}</h4>
                      <p>Provider: <strong>{ord.provider?.name}</strong> • Amount: ₹{ord.totalAmount}</p>
                    </div>
                  </div>
                  <Link to="/my-orders" className="btn-table-sm">
                    Manage
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
