import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// All 12 Pages
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import CustomerDashboard from './pages/CustomerDashboard';
import PostRequirementPage from './pages/PostRequirementPage';
import BrowseRequirementsPage from './pages/BrowseRequirementsPage';
import SubmitOfferPage from './pages/SubmitOfferPage';
import MyRequirementsPage from './pages/MyRequirementsPage';
import CompareOffersPage from './pages/CompareOffersPage';
import MyOrdersPage from './pages/MyOrdersPage';
import ReviewRatingPage from './pages/ReviewRatingPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-layout">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/browse" element={<BrowseRequirementsPage />} />

              {/* Customer Routes */}
              <Route
                path="/customer-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
                    <CustomerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/post-requirement"
                element={
                  <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
                    <PostRequirementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-requirements"
                element={
                  <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
                    <MyRequirementsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/compare-offers/:id"
                element={
                  <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
                    <CompareOffersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/review/:orderId"
                element={
                  <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
                    <ReviewRatingPage />
                  </ProtectedRoute>
                }
              />

              {/* Service Provider Routes */}
              <Route
                path="/submit-offer/:id"
                element={
                  <ProtectedRoute allowedRoles={['PROVIDER', 'ADMIN']}>
                    <SubmitOfferPage />
                  </ProtectedRoute>
                }
              />

              {/* Shared Protected Routes (Customers & Providers) */}
              <Route
                path="/my-orders"
                element={
                  <ProtectedRoute allowedRoles={['CUSTOMER', 'PROVIDER', 'ADMIN']}>
                    <MyOrdersPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Portal */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
