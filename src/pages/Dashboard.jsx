// src/pages/Dashboard.jsx
import { Container, Typography, Box } from '@mui/material';

function Dashboard() {
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard LogiFleet
        </Typography>
        <p>Bem-vindo ao painel principal.</p>
        {/* Aqui entrarão os cards de resumo e menus */}
      </Box>
    </Container>
  );
}

export default Dashboard;