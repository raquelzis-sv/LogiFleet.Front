// src/pages/Login.jsx
import { Container, Typography, Box } from '@mui/material';

function Login() {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Login do Sistema
        </Typography>
        <p>Formulário de login será aqui.</p>
      </Box>
    </Container>
  );
}

export default Login;