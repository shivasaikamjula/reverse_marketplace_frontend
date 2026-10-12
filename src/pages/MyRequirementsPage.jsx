import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { 
  FileText, 
  PlusCircle, 
  Trash2, 
  Eye, 
  MapPin, 
  Clock, 
  Tag, 
  AlertCircle,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

const MyRequirementsPage = () => {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const fetchRequirements = async () => {
    try {
      const res = await api.get('/requirements/my');
      if (res.data.success) {
        setRequirements(res.data.data);
      }
    } catch (err) {
      setMsg({ text: 'Failed to fetch requirements', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete requirement "${title}"?`)) return;

    try {
      const res = await api.delete(`/requirements/${id}`);
      if (res.data.success) {
        setMsg({ text: 'Requirement deleted successfully', type: 'success' });
        setRequirements((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Failed to delete requirement', type: 'error' });
    }
  };

  return (
    <div className="page-wide-container">
      <div className="page-header-flex">
        <div>
          <h2>My Service Requirements</h2>
          <p>Track bids from local technicians, compare proposals, and hire providers.</p>
        </div>
        <Link to="/post-requirement" className="btn-primary-highlight">
          <PlusCircle size={18} /> Post New Requirement
        </Link>
      </div>

      {msg.text && (
        <div className={`alert-box alert-${msg.type}`}>
          {msg.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          <span>{msg.text}</span>
        </div>
      )}

      {loading ? (
        <div className="loading-state">Loading your requirements...</div>
      ) : requirements.length === 0 ? (
        <div className="empty-box">
          <FileText size={48} color="#94a3b8" />
          <h3>No requirements posted yet</h3>
          <p>Post what service you need help with and let service providers bid on it!</p>
          <Link to="/post-requirement" className="btn-primary-highlight">
            Post Your First Need
          </Link>
        </div>
      ) : (
        <div className="my-req-cards-list">
          {requirements.map((req) => (
            <div key={req.id} className="my-req-card">
              <div className="my-req-main">
                <div className="my-req-tags">
                  <span className="cat-pill-badge">{req.category?.name}</span>
                  <span className={`status-pill status-${req.status.toLowerCase()}`}>
                    {req.status}
                  </span>
                  <span className="budget-tag">Budget: ₹{req.budget}</span>
                </div>

                <h3>{req.title}</h3>
                <p className="my-req-desc">{req.description}</p>

                <div className="my-req-meta">
                  <span><MapPin size={14} /> {req.location}</span>
                  <span><Clock size={14} /> Deadline: {req.deadline || 'Flexible'}</span>
                  <span>Posted on: {new Date(req.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="my-req-aside">
                <div className="bids-stat-pill">
                  <span className="bids-count-num">{req.offerCount}</span>
                  <span className="bids-count-lbl">Offers Received</span>
                </div>

                {req.lowestOffer && (
                  <div className="lowest-offer-text">
                    Lowest Bid: <strong>₹{req.lowestOffer}</strong>
                  </div>
                )}

                <div className="aside-actions-col">
                  <Link to={`/compare-offers/${req.id}`} className="btn-compare-bids">
                    <Eye size={16} /> Compare Offers ({req.offerCount})
                  </Link>

                  {req.status === 'OPEN' && (
                    <button
                      onClick={() => handleDelete(req.id, req.title)}
                      className="btn-delete-req"
                      title="Delete requirement"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRequirementsPage;
