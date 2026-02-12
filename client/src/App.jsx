import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Investments from './pages/Investments';
import Loans from './pages/Loans';
import AIChat from './pages/AIChat';
import Navigation from './components/Navigation';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Layout with Navigation
const Layout = ({ children }) => {
  return (
    <div className="flex">
      <Navigation />
      <div className="flex-1">{children}</div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Auth />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <Layout>
                  <Expenses />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/investments"
            element={
              <ProtectedRoute>
                <Layout>
                  <Investments />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/loans"
            element={
              <ProtectedRoute>
                <Layout>
                  <Loans />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-chat"
            element={
              <ProtectedRoute>
                <Layout>
                  <AIChat />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
