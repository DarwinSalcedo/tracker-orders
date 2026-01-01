import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Backoffice/Login';
import TrackOrder from './pages/Tracker/TrackOrder';

// Placeholder Pages (We will implement these next)
const Dashboard = () => {
  const { logout, user } = useAuth();
  return (
    <div className="page flex-center" style={{ flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Welcome, {user?.name}</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Backoffice Dashboard Placeholder</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={() => alert('Create Order Flow...')} style={{ padding: '0.5rem 1rem', background: 'var(--color-primary)', borderRadius: 'var(--radius-sm)', color: 'white' }}>Create Order</button>
          <button onClick={logout} style={{ padding: '0.5rem 1rem', background: 'var(--color-error)', borderRadius: 'var(--radius-sm)', color: 'white' }}>Logout</button>
        </div>
      </div>
    </div>
  );
};

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
            {/* Add Create/Update Order routes here later */}
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
