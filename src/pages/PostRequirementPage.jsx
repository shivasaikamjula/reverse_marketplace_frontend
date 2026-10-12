import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { PlusCircle, Layers, DollarSign, MapPin, Calendar, FileText, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

const PostRequirementPage = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    budget: '',
    location: '',
    deadline: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success) {
          setCategories(res.data.data);
          if (res.data.data.length > 0) {
            setFormData((prev) => ({ ...prev, categoryId: res.data.data[0].id }));
          }
        }
      } catch (err) {
        setErrorMsg('Failed to load categories.');
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.title || !formData.categoryId || !formData.budget || !formData.location || !formData.description) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        categoryId: Number(formData.categoryId),
        budget: Number(formData.budget),
        location: formData.location,
        deadline: formData.deadline || 'Flexible',
        description: formData.description,
      };

      const res = await api.post('/requirements', payload);
      if (res.data.success) {
        setSuccessMsg('Service requirement posted successfully! Redirecting...');
        setTimeout(() => {
          navigate('/my-requirements');
        }, 1200);
      } else {
        setErrorMsg(res.data.message || 'Failed to post requirement');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error posting requirement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page-container">
      <div className="form-card">
        <div className="form-card-header">
          <div className="header-icon-box">
            <PlusCircle size={24} color="#ffffff" />
          </div>
          <div>
            <h2>Post a Service Requirement</h2>
            <p>Broadcast your problem to top local professionals and get competitive bids.</p>
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
          <div className="form-group">
            <label>Requirement Title *</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Master Bathroom Shower Tap Leakage"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <small className="field-hint">Be specific so service providers understand the issue quickly.</small>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Service Category *</label>
              <div className="select-with-icon">
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Estimated Budget (₹) *</label>
              <input
                type="number"
                name="budget"
                placeholder="e.g. 1500"
                min="1"
                value={formData.budget}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Service Location / Area *</label>
              <input
                type="text"
                name="location"
                placeholder="e.g. Sector 22, Near Metro Station"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Desired Completion Deadline</label>
              <input
                type="text"
                name="deadline"
                placeholder="e.g. Today by 6 PM or Weekend"
                value={formData.deadline}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Detailed Description *</label>
            <textarea
              name="description"
              rows="4"
              placeholder="Describe the exact issue, symptoms, brand/model (if any), and any special tools needed..."
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="form-actions-row">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary-highlight" disabled={loading}>
              {loading ? 'Submitting...' : 'Broadcast Requirement'} <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostRequirementPage;
