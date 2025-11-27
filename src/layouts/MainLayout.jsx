import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, CssBaseline } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';


const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBarStyled = styled(AppBar, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

function MainLayout() {
  const [open, setOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const allMenuItems = [
    { text: 'Dashboard', path: '/', roles: ['Administrador', 'Motorista', 'Cliente'] },
    { text: 'Clientes', path: '/clientes', roles: ['Administrador'] },
    { text: 'Motoristas', path: '/motoristas', roles: ['Administrador'] },
    { text: 'Veículos', path: '/veiculos', roles: ['Administrador'] },
    { text: 'Rotas', path: '/rotas', roles: ['Administrador', 'Motorista'] },
    { text: 'Pedidos', path: '/pedidos', roles: ['Administrador', 'Cliente'] },
    { text: 'Manutenções', path: '/manutencoes', roles: ['Administrador'] },
    { text: 'Usuários', path: '/usuarios', roles: ['Administrador'] },
    { text: 'Configurações', path: '/configuracoes', roles: ['Administrador'] },
    { text: 'Logs', path: '/logs', roles: ['Administrador'] },
  ];

  const filteredMenuItems = allMenuItems.filter(item => item.roles.includes(user?.role));

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBarStyled position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            LogiFleet - {user?.role || 'Bem-vindo!'}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout} title="Sair">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBarStyled>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            Fechar
          </IconButton>
        </DrawerHeader>
        <List>
          {filteredMenuItems.map((item) => (
            <ListItem button key={item.text} component={Link} to={item.path} onClick={handleDrawerClose}>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Outlet />
      </Main>
    </Box>
  );
}

export default MainLayout;