import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import Clientes from '../pages/Clientes';
import Motoristas from '../pages/Motoristas';
import Veiculos from '../pages/Veiculos';
import Rotas from '../pages/Rotas';
import Pedidos from '../pages/Pedidos';
import Manutencoes from '../pages/Manutencoes';
import Usuarios from '../pages/Usuarios';
import Configuracoes from '../pages/Configuracoes';
import Logs from '../pages/Logs';

// A wrapper for private routes that checks for authentication.
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes with AuthLayout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Private routes with MainLayout */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="motoristas" element={<Motoristas />} />
          <Route path="veiculos" element={<Veiculos />} />
          <Route path="rotas" element={<Rotas />} />
          <Route path="pedidos" element={<Pedidos />} />
          <Route path="manutencoes" element={<Manutencoes />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="configuracoes" element={<Configuracoes />} />
          <Route path="logs" element={<Logs />} />
        </Route>

        {/* Redirect any other path to the main page or login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
