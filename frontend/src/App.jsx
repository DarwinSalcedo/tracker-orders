import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Backoffice/Login';
import Dashboard from './pages/Backoffice/Dashboard';
import CreateOrder from './pages/Backoffice/CreateOrder';
import TrackOrder from './pages/Tracker/TrackOrder';

// Protected Route Component
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="page flex-center">Loading...</div>;

  return isAuthenticated ? <Outlet /> : <Navigate to="/backoffice/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/track" element={<TrackOrder />} />

          {/* Backoffice Routes */}
          <Route path="/backoffice/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/backoffice/dashboard" element={<Dashboard />} />
            <Route path="/backoffice/create-order" element={<CreateOrder />} />
            {/* Add Update Order routes here later */}
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
