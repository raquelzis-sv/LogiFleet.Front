import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes'; // Import Clientes
import Motoristas from './pages/Motoristas'; // Import Motoristas
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import { useAuth } from './context/AuthContext'; // Import useAuth hook

function App() {
  const { isAuthenticated, loading } = useAuth(); // Get isAuthenticated and loading from AuthContext

  if (loading) {
    return <div>Carregando...</div>; // Or a proper loading spinner
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? ( // If authenticated, redirect from login page
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthLayout>
                <Login />
              </AuthLayout>
            )
          }
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <MainLayout>
                <Dashboard />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/clientes" // New route for Clients
          element={
            isAuthenticated ? (
              <MainLayout>
                <Clientes />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/motoristas" // New route for Drivers
          element={
            isAuthenticated ? (
              <MainLayout>
                <Motoristas />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="*" element={<div>Página não encontrada (404)</div>} />
      </Routes>
    </Router>
  );
}

export default App;