import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Star, 
  User, 
  Phone, 
  ArrowLeft, 
  AlertCircle, 
  TrendingDown, 
  Award, 
  ShieldCheck,
  CheckCircle2,
  Calendar
} from 'lucide-react';

const CompareOffersPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [requirement, setRequirement] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortFilter, setSortFilter] = useState('LOWEST_PRICE');
  const [acceptingId, setAcceptingId] = useState(null);
  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchOffersAndReq = async () => {
      try {
        const [reqRes, offRes] = await Promise.all([
          api.get(`/requirements/${id}`),
          api.get(`/offers/requirement/${id}`)
        ]);
        if (reqRes.data.success) setRequirement(reqRes.data.data);
        if (offRes.data.success) setOffers(offRes.data.data);
      } catch (err) {
        setMsg({ text: 'Failed to load offers for comparison.', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchOffersAndReq();
  }, [id]);

  const handleAcceptOffer = async (offerId, providerName, price) => {
    if (!window.confirm(`Accept offer from ${providerName} for ₹${price}? This will confirm your booking and create an active service order.`)) {
      return;
    }

    setAcceptingId(offerId);
    setMsg({ text: '', type: '' });
    try {
      const res = await api.post(`/orders/accept/${offerId}`);
      if (res.data.success) {
        setMsg({ text: `Offer accepted! Service order created with ${providerName}. Redirecting to My Orders...`, type: 'success' });
        setTimeout(() => {
          navigate('/my-orders');
        }, 1500);
      } else {
        setMsg({ text: res.data.message || 'Failed to accept offer', type: 'error' });
      }
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Error accepting offer', type: 'error' });
    } finally {
      setAcceptingId(null);
    }
  };

  const sortedOffers = [...offers].sort((a, b) => {
    if (sortFilter === 'LOWEST_PRICE') return a.price - b.price;
    if (sortFilter === 'HIGHEST_RATING') return (b.providerRating || 0) - (a.providerRating || 0);
    if (sortFilter === 'FASTEST_TIME') return a.estimatedDays - b.estimatedDays;
    return 0;
  });

  return (
    <div className="page-wide-container">
      {/* Top Breadcrumb */}
      <div className="back-nav-row">
        <Link to="/my-requirements" className="back-link">
          <ArrowLeft size={16} /> Back to My Requirements
        </Link>
      </div>

      {/* Requirement Banner Header */}
      {requirement && (
        <div className="compare-header-card">
          <div className="compare-header-info">
            <div className="header-pills">
              <span className="cat-pill-badge">{requirement.category?.name}</span>
              <span className={`status-pill status-${requirement.status.toLowerCase()}`}>
                Status: {requirement.status}
              </span>
            </div>
            <h2>Comparing Offers for: {requirement.title}</h2>
            <p className="req-header-desc">{requirement.description}</p>
            <div className="req-header-stats">
              <span>Your Budget: <strong>₹{requirement.budget}</strong></span>
              <span>Location: <strong>{requirement.location}</strong></span>
              <span>Total Bids Received: <strong>{offers.length}</strong></span>
            </div>
          </div>
        </div>
      )}

      {msg.text && (
        <div className={`alert-box alert-${msg.type}`}>
          {msg.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Comparison Sort Bar */}
      <div className="compare-sort-bar">
        <h3>Proposals Received ({offers.length})</h3>
        <div className="sort-buttons-group">
          <span>Sort By:</span>
          <button
            className={`btn-sort-pill ${sortFilter === 'LOWEST_PRICE' ? 'active' : ''}`}
            onClick={() => setSortFilter('LOWEST_PRICE')}
          >
            💰 Lowest Price
          </button>
          <button
            className={`btn-sort-pill ${sortFilter === 'HIGHEST_RATING' ? 'active' : ''}`}
            onClick={() => setSortFilter('HIGHEST_RATING')}
          >
            ⭐ Highest Rating
          </button>
          <button
            className={`btn-sort-pill ${sortFilter === 'FASTEST_TIME' ? 'active' : ''}`}
            onClick={() => setSortFilter('FASTEST_TIME')}
          >
            ⚡ Fastest Delivery
          </button>
        </div>
      </div>

      {/* Offers Comparison Cards */}
      {loading ? (
        <div className="loading-state">Loading offers for comparison...</div>
      ) : sortedOffers.length === 0 ? (
        <div className="empty-box">
          <TrendingDown size={48} color="#94a3b8" />
          <h3>No offers submitted yet</h3>
          <p>Local service providers have been notified. You will see their price and time bids here as soon as they submit them.</p>
        </div>
      ) : (
        <div className="offers-comparison-grid">
          {sortedOffers.map((offer, index) => {
            const savings = requirement ? requirement.budget - offer.price : 0;
            const isLowest = index === 0 && sortFilter === 'LOWEST_PRICE';

            return (
              <div key={offer.id} className={`offer-compare-card ${isLowest ? 'featured-offer' : ''}`}>
                {isLowest && (
                  <div className="featured-ribbon">
                    <Award size={14} /> Best Value Offer
                  </div>
                )}

                <div className="offer-provider-header">
                  <div className="provider-avatar-circle">
                    {offer.providerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4>{offer.providerName}</h4>
                    <div className="provider-rating-row">
                      <Star size={15} fill="#f59e0b" color="#f59e0b" />
                      <strong>{offer.providerRating || '5.0'}</strong>
                      <span>({offer.providerReviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="offer-stats-panel">
                  <div className="offer-stat-box">
                    <span className="stat-label">Offer Price</span>
                    <span className="stat-value price-val">₹{offer.price}</span>
                    {savings > 0 && (
                      <span className="savings-badge">
                        Save ₹{savings} ({Math.round((savings / requirement.budget) * 100)}%)
                      </span>
                    )}
                  </div>

                  <div className="offer-stat-box">
                    <span className="stat-label">Estimated Time</span>
                    <span className="stat-value time-val">
                      <Clock size={16} /> {offer.estimatedDays} {offer.estimatedDays === 1 ? 'Day' : 'Days'}
                    </span>
                  </div>
                </div>

                <div className="offer-proposal-body">
                  <label>Provider Proposal:</label>
                  <p>"{offer.description}"</p>
                </div>

                <div className="offer-card-footer">
                  <div className="offer-status-sub">
                    Status: <span className={`offer-status-badge ${offer.status.toLowerCase()}`}>{offer.status}</span>
                  </div>

                  {requirement?.status === 'OPEN' && offer.status === 'PENDING' && (
                    <button
                      onClick={() => handleAcceptOffer(offer.id, offer.providerName, offer.price)}
                      disabled={acceptingId === offer.id}
                      className="btn-accept-offer"
                    >
                      {acceptingId === offer.id ? 'Accepting...' : 'Accept Offer & Hire'}
                    </button>
                  )}

                  {offer.status === 'ACCEPTED' && (
                    <div className="accepted-badge-pill">
                      <CheckCircle2 size={16} /> Accepted Provider
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CompareOffersPage;
