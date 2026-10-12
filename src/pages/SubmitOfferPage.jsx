import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  DollarSign, 
  Clock, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  ArrowRight,
  TrendingDown
} from 'lucide-react';

const SubmitOfferPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isProvider, isAuthenticated } = useAuth();

  const [requirement, setRequirement] = useState(null);
  const [formData, setFormData] = useState({
    price: '',
    estimatedDays: '1',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchRequirement = async () => {
      try {
        const res = await api.get(`/requirements/${id}`);
        if (res.data.success) {
          setRequirement(res.data.data);
          // Suggest competitive price (e.g. 10% below budget)
          const suggested = Math.round(res.data.data.budget * 0.9);
          setFormData((prev) => ({ ...prev, price: suggested > 0 ? suggested : res.data.data.budget }));
        }
      } catch (err) {
        setErrorMsg('Could not fetch requirement details.');
      } finally {
        setFetching(false);
      }
    };
    fetchRequirement();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isProvider) {
      setErrorMsg('Only service providers can submit bid offers. Please log in with a provider account.');
      return;
    }

    if (!formData.price || !formData.estimatedDays || !formData.description) {
      setErrorMsg('Please complete all fields in your proposal.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        requirementId: Number(id),
        price: Number(formData.price),
        estimatedDays: Number(formData.estimatedDays),
        description: formData.description,
      };

      const res = await api.post('/offers', payload);
      if (res.data.success) {
        setSuccessMsg('Your offer proposal was successfully submitted! The customer can now review and accept your bid.');
        setTimeout(() => {
          navigate('/browse');
        }, 1500);
      } else {
        setErrorMsg(res.data.message || 'Failed to submit offer.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error submitting offer. Have you already bid on this?');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="loading-state">Loading requirement information...</div>;
  }

  return (
    <div className="form-page-container">
      {/* Target Requirement Info Summary Box */}
      {requirement && (
        <div className="requirement-summary-banner">
          <div className="summary-banner-top">
            <span className="cat-pill-badge">{requirement.category?.name}</span>
            <span className="budget-target-badge">Customer Budget: ₹{requirement.budget}</span>
          </div>
          <h2>{requirement.title}</h2>
          <p className="summary-desc">{requirement.description}</p>
          <div className="summary-meta-row">
            <span><MapPin size={14} /> Location: <strong>{requirement.location}</strong></span>
            <span><Calendar size={14} /> Desired: <strong>{requirement.deadline || 'Flexible'}</strong></span>
            <span><TrendingDown size={14} /> Current Bids: <strong>{requirement.offerCount}</strong></span>
          </div>
        </div>
      )}

      {/* Offer Form */}
      <div className="form-card">
        <div className="form-card-header">
          <div className="header-icon-box bg-purple-grad">
            <Briefcase size={24} color="#ffffff" />
          </div>
          <div>
            <h2>Submit Competitive Bid Offer</h2>
            <p>Offer your best price, estimated completion time, and explain your experience.</p>
          </div>
        </div>

        {errorMsg && (
          <div className="alert-box alert-error">
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="alert-box alert-success">
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="custom-form">
          <div className="form-row-2">
            <div className="form-group">
              <label>Your Bid Price (₹) *</label>
              <input
                type="number"
                name="price"
                placeholder="e.g. 1100"
                min="1"
                value={formData.price}
                onChange={handleChange}
                required
              />
              <small className="field-hint">Competitive lower prices increase chances of being accepted.</small>
            </div>

            <div className="form-group">
              <label>Estimated Completion Time (Days) *</label>
              <input
                type="number"
                name="estimatedDays"
                placeholder="1"
                min="1"
                max="30"
                value={formData.estimatedDays}
                onChange={handleChange}
                required
              />
              <small className="field-hint">How many days will you take to finish the job?</small>
            </div>
          </div>

          <div className="form-group">
            <label>Proposal Pitch &amp; Experience *</label>
            <textarea
              name="description"
              rows="4"
              placeholder="Explain why you are the best fit for this service. Mention your past experience, tools you bring, and warranty (if any)..."
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="form-actions-row">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Back
            </button>
            <button type="submit" className="btn-primary-highlight" disabled={loading}>
              {loading ? 'Submitting Bid...' : 'Submit Bid Offer'} <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitOfferPage;
