import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Motoristas from './pages/Motoristas';
import Veiculos from './pages/Veiculos';
import Rotas from './pages/Rotas'; // Import Rotas
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import { useAuth } from './context/AuthContext';

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthLayout>
                <Login />
              </AuthLayout>
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <MainLayout><Dashboard /></MainLayout> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/clientes"
          element={
            isAuthenticated ? <MainLayout><Clientes /></MainLayout> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/motoristas"
          element={
            isAuthenticated ? <MainLayout><Motoristas /></MainLayout> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/veiculos"
          element={
            isAuthenticated ? <MainLayout><Veiculos /></MainLayout> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/rotas"
          element={
            isAuthenticated ? <MainLayout><Rotas /></MainLayout> : <Navigate to="/login" replace />
          }
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<div>Página não encontrada (404)</div>} />
      </Routes>
    </Router>
  );
}

export default App;