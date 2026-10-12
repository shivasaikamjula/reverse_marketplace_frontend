import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Shield, 
  Users, 
  Layers, 
  FileText, 
  Package, 
  CheckCircle, 
  PlusCircle, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  UserCheck, 
  Briefcase 
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('CATEGORIES');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: '', type: '' });

  // Add Category Modal / Form State
  const [newCat, setNewCat] = useState({ name: '', description: '', icon: 'Layers' });
  const [isAddingCat, setIsAddingCat] = useState(false);

  const fetchAdminData = async () => {
    try {
      const [statsRes, catRes, userRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/categories'),
        api.get('/admin/users')
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (catRes.data.success) setCategories(catRes.data.data);
      if (userRes.data.success) setUsers(userRes.data.data);
    } catch (err) {
      setMsg({ text: 'Error loading admin data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCat.name) return;

    try {
      const res = await api.post('/categories', newCat);
      if (res.data.success) {
        setMsg({ text: 'Category added successfully!', type: 'success' });
        setNewCat({ name: '', description: '', icon: 'Layers' });
        setIsAddingCat(false);
        fetchAdminData();
      }
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Failed to add category', type: 'error' });
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;

    try {
      const res = await api.delete(`/categories/${id}`);
      if (res.data.success) {
        setMsg({ text: `Category "${name}" deleted successfully`, type: 'success' });
        setCategories((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Cannot delete category (may have linked requirements)', type: 'error' });
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;

    try {
      const res = await api.delete(`/admin/users/${id}`);
      if (res.data.success) {
        setMsg({ text: `User "${name}" deleted`, type: 'success' });
        setUsers((prev) => prev.filter((u) => u.id !== id));
        fetchAdminData();
      }
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Failed to delete user', type: 'error' });
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h2><Shield size={24} color="#7c3aed" /> Admin Control Portal</h2>
          <p>System monitoring, category catalog management, and user accounts oversight.</p>
        </div>
      </div>

      {msg.text && (
        <div className={`alert-box alert-${msg.type}`}>
          {msg.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="metrics-grid admin-stats-row">
          <div className="metric-stat-card">
            <div className="metric-icon-bubble bg-indigo">
              <Users size={24} color="#4f46e5" />
            </div>
            <div className="metric-data">
              <span className="metric-val">{stats.totalUsers}</span>
              <span className="metric-title">Total Users ({stats.totalCustomers} Cust, {stats.totalProviders} Prov)</span>
            </div>
          </div>

          <div className="metric-stat-card">
            <div className="metric-icon-bubble bg-purple">
              <Layers size={24} color="#7c3aed" />
            </div>
            <div className="metric-data">
              <span className="metric-val">{stats.totalCategories}</span>
              <span className="metric-title">Service Categories</span>
            </div>
          </div>

          <div className="metric-stat-card">
            <div className="metric-icon-bubble bg-blue">
              <FileText size={24} color="#0284c7" />
            </div>
            <div className="metric-data">
              <span className="metric-val">{stats.totalRequirements}</span>
              <span className="metric-title">Requirements ({stats.openRequirements} Open)</span>
            </div>
          </div>

          <div className="metric-stat-card">
            <div className="metric-icon-bubble bg-green">
              <CheckCircle size={24} color="#10b981" />
            </div>
            <div className="metric-data">
              <span className="metric-val">{stats.totalOrders}</span>
              <span className="metric-title">Orders ({stats.completedOrders} Completed)</span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="admin-tabs-row">
        <button
          className={`tab-btn ${activeTab === 'CATEGORIES' ? 'active' : ''}`}
          onClick={() => setActiveTab('CATEGORIES')}
        >
          <Layers size={16} /> Manage Service Categories ({categories.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'USERS' ? 'active' : ''}`}
          onClick={() => setActiveTab('USERS')}
        >
          <Users size={16} /> Manage User Accounts ({users.length})
        </button>
      </div>

      {/* Tab 1: Categories */}
      {activeTab === 'CATEGORIES' && (
        <div className="dash-card-section">
          <div className="dash-section-header">
            <h3>Service Categories Catalog</h3>
            <button
              onClick={() => setIsAddingCat(!isAddingCat)}
              className="btn-primary-sm"
            >
              <PlusCircle size={16} /> {isAddingCat ? 'Close Form' : 'Add New Category'}
            </button>
          </div>

          {/* Add Category Form */}
          {isAddingCat && (
            <form onSubmit={handleAddCategory} className="admin-inline-form">
              <div className="form-row-2">
                <input
                  type="text"
                  placeholder="Category Name (e.g. Appliance Repair)"
                  value={newCat.name}
                  onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                  required
                />
                <select
                  value={newCat.icon}
                  onChange={(e) => setNewCat({ ...newCat, icon: e.target.value })}
                >
                  <option value="Layers">Icon: Layers</option>
                  <option value="Wrench">Icon: Wrench (Plumbing)</option>
                  <option value="Zap">Icon: Zap (Electrical)</option>
                  <option value="Wind">Icon: Wind (AC)</option>
                  <option value="Car">Icon: Car (Vehicle)</option>
                  <option value="Sparkles">Icon: Sparkles (Cleaning)</option>
                  <option value="Paintbrush">Icon: Paintbrush (Painting)</option>
                  <option value="Laptop">Icon: Laptop (Computer)</option>
                </select>
              </div>
              <textarea
                rows="2"
                placeholder="Description of problems covered by this category..."
                value={newCat.description}
                onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
              ></textarea>
              <button type="submit" className="btn-primary-sm">Save Category</button>
            </form>
          )}

          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Icon Key</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td>#{cat.id}</td>
                    <td><strong>{cat.name}</strong></td>
                    <td>{cat.description}</td>
                    <td><code>{cat.icon || 'Layers'}</code></td>
                    <td>
                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="btn-delete-icon"
                        title="Delete Category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Users */}
      {activeTab === 'USERS' && (
        <div className="dash-card-section">
          <div className="dash-section-header">
            <h3>Registered Users Database</h3>
          </div>

          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Joined Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`status-pill status-${u.role.toLowerCase()}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>{u.phone || 'N/A'}</td>
                    <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      {u.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="btn-delete-icon"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
