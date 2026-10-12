import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Package, 
  CheckCircle, 
  Clock, 
  Star, 
  User, 
  Phone, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  DollarSign, 
  Calendar 
} from 'lucide-react';

const MyOrdersPage = () => {
  const { isCustomer, isProvider, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [completingId, setCompletingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/my');
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      setMsg({ text: 'Failed to load orders', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCompleteOrder = async (orderId) => {
    if (!window.confirm('Confirm that the service has been satisfactorily delivered and completed?')) {
      return;
    }

    setCompletingId(orderId);
    setMsg({ text: '', type: '' });
    try {
      const res = await api.put(`/orders/${orderId}/complete`);
      if (res.data.success) {
        setMsg({ text: 'Order marked as COMPLETED! You can now leave a rating and review.', type: 'success' });
        fetchOrders();
      } else {
        setMsg({ text: res.data.message || 'Failed to complete order', type: 'error' });
      }
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Error updating order status', type: 'error' });
    } finally {
      setCompletingId(null);
    }
  };

  return (
    <div className="page-wide-container">
      <div className="page-header-flex">
        <div>
          <h2>Service Orders &amp; Bookings</h2>
          <p>
            {isCustomer
              ? 'Manage your active service bookings, mark finished jobs as completed, and leave reviews.'
              : 'Track accepted service bookings, view client job locations, and deliver your services.'}
          </p>
        </div>
      </div>

      {msg.text && (
        <div className={`alert-box alert-${msg.type}`}>
          {msg.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{msg.text}</span>
        </div>
      )}

      {loading ? (
        <div className="loading-state">Loading your orders...</div>
      ) : orders.length === 0 ? (
        <div className="empty-box">
          <Package size={48} color="#94a3b8" />
          <h3>No service orders found</h3>
          <p>
            {isCustomer
              ? 'Once you accept a provider’s bid for your service requirement, the order will appear here.'
              : 'Once a customer accepts one of your submitted bid offers, your new booking will appear here.'}
          </p>
          <Link to={isCustomer ? '/my-requirements' : '/browse'} className="btn-primary-highlight">
            {isCustomer ? 'Check My Requirements' : 'Browse Open Jobs'}
          </Link>
        </div>
      ) : (
        <div className="orders-cards-list">
          {orders.map((order) => (
            <div key={order.id} className="order-item-card">
              <div className="order-item-header">
                <div className="order-id-block">
                  <span className="order-id-label">ORDER #{order.id}</span>
                  <span className="order-date-text">
                    <Calendar size={13} /> Booked: {new Date(order.createdDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="order-status-pill-wrap">
                  <span className={`status-pill status-${order.status.toLowerCase()}`}>
                    {order.status === 'ACTIVE' ? '⚡ In Progress' : '✅ Completed'}
                  </span>
                </div>
              </div>

              <div className="order-details-grid">
                <div className="order-col-main">
                  <h3>{order.requirement?.title}</h3>
                  <div className="order-cat-tag">
                    Category: <strong>{order.requirement?.category?.name}</strong>
                  </div>
                  <div className="order-location-tag">
                    <MapPin size={14} /> Location: {order.requirement?.location}
                  </div>
                </div>

                <div className="order-col-counterparty">
                  {isCustomer ? (
                    <div>
                      <span className="meta-label">Assigned Service Provider:</span>
                      <h4>{order.provider?.name}</h4>
                      <div className="contact-tag">
                        <Phone size={13} /> {order.provider?.phone || 'No phone provided'}
                      </div>
                      <div className="email-tag">{order.provider?.email}</div>
                    </div>
                  ) : (
                    <div>
                      <span className="meta-label">Client Name:</span>
                      <h4>{order.customer?.name}</h4>
                      <div className="contact-tag">
                        <Phone size={13} /> {order.customer?.phone || 'No phone provided'}
                      </div>
                      <div className="email-tag">{order.customer?.email}</div>
                    </div>
                  )}
                </div>

                <div className="order-col-price">
                  <span className="meta-label">Total Agreed Price</span>
                  <div className="order-price-val">₹{order.totalAmount}</div>
                  <small className="price-sub">Fixed Bid Price</small>
                </div>
              </div>

              {/* Order Actions */}
              <div className="order-item-footer">
                <div className="order-footer-note">
                  {order.status === 'COMPLETED' ? (
                    <span className="completed-on-text">
                      Completed on: {order.completedDate ? new Date(order.completedDate).toLocaleDateString() : 'Finished'}
                    </span>
                  ) : (
                    <span className="active-working-text">
                      <Clock size={14} /> Technician is scheduled / working on this job
                    </span>
                  )}
                </div>

                <div className="order-footer-actions">
                  {isCustomer && order.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleCompleteOrder(order.id)}
                      disabled={completingId === order.id}
                      className="btn-mark-completed"
                    >
                      <CheckCircle size={16} />
                      {completingId === order.id ? 'Updating...' : 'Mark as Completed'}
                    </button>
                  )}

                  {isCustomer && order.status === 'COMPLETED' && (
                    <Link to={`/review/${order.id}`} className="btn-leave-review">
                      <Star size={16} /> Submit Rating &amp; Review
                    </Link>
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

export default MyOrdersPage;
