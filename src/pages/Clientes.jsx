import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import clienteService from '../services/clienteService';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCliente, setCurrentCliente] = useState({ id: null, nome: '', email: '', telefone: '', endereco: '' });

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const data = await clienteService.getAllClientes();
      setClientes(data);
    } catch (err) {
      setError('Erro ao carregar clientes: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setIsEditing(false);
    setCurrentCliente({ id: null, nome: '', email: '', telefone: '', endereco: '' });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (cliente) => {
    setIsEditing(true);
    setCurrentCliente(cliente);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError(''); // Clear any previous error
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCliente((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveCliente = async () => {
    try {
      if (isEditing) {
        await clienteService.updateCliente(currentCliente.id, currentCliente);
      } else {
        await clienteService.createCliente(currentCliente);
      }
      fetchClientes();
      handleCloseDialog();
    } catch (err) {
      setError('Erro ao salvar cliente: ' + (err.response?.data || err.message));
    }
  };

  const handleDeleteCliente = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este cliente?')) {
      try {
        await clienteService.deleteCliente(id);
        fetchClientes();
      } catch (err) {
        setError('Erro ao deletar cliente: ' + (err.response?.data || err.message));
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !openDialog) { // Only show error if not in dialog context
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={fetchClientes} sx={{ mt: 2 }}>Tentar Novamente</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gerenciamento de Clientes
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mb: 2 }}
        onClick={handleOpenAddDialog}
      >
        Adicionar Cliente
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Endereço</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={6} align="center">Nenhum cliente encontrado.</TableCell>
                </TableRow>
            ) : (
                clientes.map((cliente) => (
                    <TableRow key={cliente.id}>
                    <TableCell>{cliente.id}</TableCell>
                    <TableCell>{cliente.nome}</TableCell>
                    <TableCell>{cliente.email}</TableCell>
                    <TableCell>{cliente.telefone}</TableCell>
                    <TableCell>{cliente.endereco}</TableCell>
                    <TableCell align="right">
                        <IconButton
                        color="primary"
                        onClick={() => handleOpenEditDialog(cliente)}
                        >
                        <EditIcon />
                        </IconButton>
                        <IconButton
                        color="error"
                        onClick={() => handleDeleteCliente(cliente.id)}
                        >
                        <DeleteIcon />
                        </IconButton>
                    </TableCell>
                    </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEditing ? 'Editar Cliente' : 'Adicionar Cliente'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Preencha os dados do cliente.
          </DialogContentText>
          {error && (
            <Alert severity="error" sx={{ my: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            id="nome"
            name="nome"
            label="Nome"
            type="text"
            fullWidth
            variant="standard"
            value={currentCliente.nome}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="email"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            value={currentCliente.email}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="telefone"
            name="telefone"
            label="Telefone"
            type="text"
            fullWidth
            variant="standard"
            value={currentCliente.telefone}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="endereco"
            name="endereco"
            label="Endereço"
            type="text"
            fullWidth
            variant="standard"
            value={currentCliente.endereco}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveCliente}>{isEditing ? 'Salvar' : 'Adicionar'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Clientes;
