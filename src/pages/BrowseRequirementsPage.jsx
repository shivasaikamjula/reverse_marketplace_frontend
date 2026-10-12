import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Tag, 
  ArrowRight, 
  Briefcase, 
  CheckCircle, 
  Layers 
} from 'lucide-react';

const BrowseRequirementsPage = () => {
  const { isAuthenticated, isProvider, isCustomer, user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'ALL';

  const [requirements, setRequirements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('NEWEST');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [catRes, reqRes] = await Promise.all([
          api.get('/categories'),
          api.get('/requirements/public')
        ]);
        if (catRes.data.success) setCategories(catRes.data.data);
        if (reqRes.data.success) setRequirements(reqRes.data.data);
      } catch (err) {
        console.error('Error fetching requirements', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter and sort requirements
  const filtered = requirements.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'ALL' || String(item.category?.id) === String(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'BUDGET_HIGH') return b.budget - a.budget;
    if (sortBy === 'BUDGET_LOW') return a.budget - b.budget;
    if (sortBy === 'BIDS') return b.offerCount - a.offerCount;
    return new Date(b.createdAt) - new Date(a.createdAt); // NEWEST
  });

  return (
    <div className="browse-page-container">
      {/* Top Banner */}
      <div className="browse-banner">
        <h2>Open Service Requirements</h2>
        <p>Browse real customer service requests, analyze budgets, and submit competitive offers.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-controls-card">
        <div className="search-input-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by keywords, location (e.g. plumbing, Sector 14)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-selects-row">
          <div className="filter-group">
            <label><Layers size={14} /> Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="ALL">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label><Filter size={14} /> Sort By:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="NEWEST">Newest First</option>
              <option value="BUDGET_HIGH">Budget: High to Low</option>
              <option value="BUDGET_LOW">Budget: Low to High</option>
              <option value="BIDS">Most Bids Received</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="loading-state">Loading open requirements...</div>
      ) : sorted.length === 0 ? (
        <div className="empty-box">
          <h3>No matching requirements found</h3>
          <p>Try adjusting your search keywords or clearing the category filter.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('ALL');
            }}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="requirements-browse-grid">
          {sorted.map((item) => (
            <div key={item.id} className="browse-req-card">
              <div className="browse-card-top">
                <span className="cat-pill-badge">{item.category?.name}</span>
                <span className="budget-pill-badge">Budget: ₹{item.budget}</span>
              </div>

              <h3 className="card-req-title">{item.title}</h3>
              <p className="card-req-desc">{item.description}</p>

              <div className="card-req-meta">
                <span><MapPin size={14} /> {item.location}</span>
                <span><Clock size={14} /> {item.deadline || 'Flexible'}</span>
              </div>

              <div className="card-req-bids-info">
                <div className="bids-stat">
                  <Tag size={14} /> <strong>{item.offerCount}</strong> offers submitted
                </div>
                {item.lowestOffer && (
                  <div className="lowest-bid-highlight">
                    Lowest: ₹{item.lowestOffer}
                  </div>
                )}
              </div>

              <div className="card-req-actions">
                {isProvider ? (
                  <Link to={`/submit-offer/${item.id}`} className="btn-bid-action">
                    <Briefcase size={16} /> Submit Bid Offer
                  </Link>
                ) : isCustomer && item.customerId === user?.id ? (
                  <Link to={`/compare-offers/${item.id}`} className="btn-bid-action outline">
                    Compare Offers ({item.offerCount})
                  </Link>
                ) : (
                  <Link to={`/submit-offer/${item.id}`} className="btn-bid-action">
                    View &amp; Submit Offer <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseRequirementsPage;
