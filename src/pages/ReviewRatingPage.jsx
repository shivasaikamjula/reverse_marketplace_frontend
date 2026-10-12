import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { 
  Star, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  MessageSquare,
  ArrowRight
} from 'lucide-react';

const ReviewRatingPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [existingReview, setExistingReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderRes, reviewRes] = await Promise.all([
          api.get(`/orders/${orderId}`),
          api.get(`/reviews/order/${orderId}`)
        ]);
        if (orderRes.data.success) setOrder(orderRes.data.data);
        if (reviewRes.data.success && reviewRes.data.data) {
          setExistingReview(reviewRes.data.data);
        }
      } catch (err) {
        setErrorMsg('Error loading order details.');
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!rating) {
      setErrorMsg('Please select a rating between 1 and 5 stars.');
      return;
    }

    if (!comment || comment.trim().length < 5) {
      setErrorMsg('Please write a feedback comment of at least 5 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/reviews', {
        orderId: Number(orderId),
        rating: Number(rating),
        comment: comment.trim(),
      });

      if (res.data.success) {
        setSuccessMsg('Review and rating successfully submitted! Thank you for helping build trust in our local marketplace.');
        setTimeout(() => {
          navigate('/my-orders');
        }, 1500);
      } else {
        setErrorMsg(res.data.message || 'Failed to submit review.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error submitting review.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="loading-state">Loading order details...</div>;
  }

  return (
    <div className="form-page-container">
      <div className="back-nav-row">
        <Link to="/my-orders" className="back-link">
          <ArrowLeft size={16} /> Back to My Orders
        </Link>
      </div>

      <div className="form-card">
        <div className="form-card-header">
          <div className="header-icon-box bg-amber-grad">
            <Star size={24} color="#ffffff" />
          </div>
          <div>
            <h2>Service Review &amp; Rating</h2>
            <p>Order #{order?.id} • Service: {order?.requirement?.title}</p>
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

        {/* If review already submitted */}
        {existingReview ? (
          <div className="existing-review-box">
            <div className="existing-review-badge">
              <CheckCircle2 size={18} color="#10b981" /> You have already reviewed this service
            </div>
            <div className="stars-row-static">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={26}
                  fill={star <= existingReview.rating ? '#f59e0b' : 'none'}
                  color="#f59e0b"
                />
              ))}
              <span className="rating-static-num">{existingReview.rating} / 5 Stars</span>
            </div>
            <p className="existing-comment">"{existingReview.comment}"</p>
            <div className="existing-provider-info">
              Provider Reviewed: <strong>{existingReview.provider?.name}</strong> on {new Date(existingReview.createdDate).toLocaleDateString()}
            </div>
            <Link to="/my-orders" className="btn-secondary" style={{ marginTop: '20px', display: 'inline-flex' }}>
              Return to Orders
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="custom-form">
            <div className="provider-review-target-box">
              <span className="meta-label">Reviewing Service Provider:</span>
              <h3>{order?.provider?.name}</h3>
              <p>Agreed Price: ₹{order?.totalAmount}</p>
            </div>

            {/* Interactive Star Rating */}
            <div className="form-group rating-picker-group">
              <label>Select Rating (1 to 5 Stars) *</label>
              <div className="star-picker-row">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    className="star-btn"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      size={36}
                      fill={(hoverRating || rating) >= star ? '#f59e0b' : 'none'}
                      color="#f59e0b"
                    />
                  </button>
                ))}
                <span className="selected-rating-label">
                  {rating === 5 && '⭐⭐⭐⭐⭐ Excellent!'}
                  {rating === 4 && '⭐⭐⭐⭐ Very Good'}
                  {rating === 3 && '⭐⭐⭐ Average'}
                  {rating === 2 && '⭐⭐ Below Expectations'}
                  {rating === 1 && '⭐ Poor'}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label>Your Feedback Comment *</label>
              <textarea
                rows="4"
                placeholder="Share your experience: Was the provider punctual, skilled, polite, and clean? Would you recommend them to others?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-actions-row">
              <button type="button" onClick={() => navigate('/my-orders')} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary-highlight" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Rating & Review'} <ArrowRight size={18} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReviewRatingPage;
