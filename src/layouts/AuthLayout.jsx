import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: (theme) => theme.palette.background.default,
        padding: 3,
      }}
    >
      <Container maxWidth="xs">
        <Box
          sx={{
            mt: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: (theme) => theme.palette.background.paper,
            padding: 4,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Outlet />
        </Box>
      </Container>
    </Box>
  );
}

export default AuthLayout;