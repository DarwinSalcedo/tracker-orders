import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Backoffice/Login';
import Dashboard from './pages/Backoffice/Dashboard';
import CreateOrder from './pages/Backoffice/CreateOrder';
import Register from './pages/Backoffice/Register';
import TrackOrder from './pages/Tracker/TrackOrder';
import TokenTrack from './pages/Tracker/TokenTrack';

// Protected Route Component
const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <div className="page flex-center">Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/backoffice/login" replace />;

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/backoffice/dashboard" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/track" element={<TrackOrder />} />
            <Route path="/track/:token" element={<TokenTrack />} />

            {/* Backoffice Routes */}
            <Route path="/backoffice/login" element={<Login />} />
            <Route path="/backoffice/register" element={<Register />} />

            <Route element={<ProtectedRoute allowedRoles={['Admin', 'Delivery']} />}>
              <Route path="/backoffice/dashboard" element={<Dashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
              <Route path="/backoffice/create-order" element={<CreateOrder />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
