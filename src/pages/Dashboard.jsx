import { Box, Typography, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard LogiFleet
      </Typography>
      {user && (
        <Typography variant="h6" gutterBottom>
          Bem-vindo, {user.nome || user.Nome}!
        </Typography>
      )}
      <Typography paragraph>
        Este é o painel principal. Aqui você encontrará resumos e links para as funcionalidades do sistema.
      </Typography>
      <Button variant="outlined" color="primary" onClick={handleLogout}>
        Sair
      </Button>
    </Box>
  );
}

export default Dashboard;