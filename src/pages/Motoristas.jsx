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
import motoristaService from '../services/motoristaService';

function Motoristas() {
  const [motoristas, setMotoristas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMotorista, setCurrentMotorista] = useState({ id: null, nome: '', cpf: '', cnh: '', telefone: '', usuario: { email: '', senhaHash: '' } });

  useEffect(() => {
    fetchMotoristas();
  }, []);

  const fetchMotoristas = async () => {
    try {
      setLoading(true);
      const data = await motoristaService.getAllMotoristas();
      setMotoristas(data);
    } catch (err) {
      setError('Erro ao carregar motoristas: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setIsEditing(false);
    setCurrentMotorista({ id: null, nome: '', cpf: '', cnh: '', telefone: '', usuario: { email: '', senhaHash: '' } });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (motorista) => {
    setIsEditing(true);
    // Garante que o objeto usuario não é nulo para o formulário
    const motoristaData = {
      ...motorista,
      usuario: motorista.usuario || { email: '', senhaHash: '' }
    };
    setCurrentMotorista(motoristaData);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentMotorista((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleUsuarioInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentMotorista((prev) => ({
      ...prev,
      usuario: { ...prev.usuario, [name]: value }
    }));
  };

  const handleSaveMotorista = async () => {
    try {
      if (isEditing) {
        await motoristaService.updateMotorista(currentMotorista.id, currentMotorista);
      } else {
        await motoristaService.createMotorista(currentMotorista);
      }
      fetchMotoristas();
      handleCloseDialog();
    } catch (err) {
      setError('Erro ao salvar motorista: ' + (err.response?.data || err.message));
    }
  };

  const handleDeleteMotorista = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este motorista?')) {
      try {
        await motoristaService.deleteMotorista(id);
        fetchMotoristas();
      } catch (err) {
        setError('Erro ao deletar motorista: ' + (err.response?.data || err.message));
      }
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (error && !openDialog) {
    return <Box sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Box>;
  }

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>Gerenciamento de Motoristas</Typography>
      <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 2 }} onClick={handleOpenAddDialog}>Adicionar Motorista</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>CPF</TableCell>
              <TableCell>CNH</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Email do Usuário</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {motoristas.map((motorista) => (
              <TableRow key={motorista.id}>
                <TableCell>{motorista.nome}</TableCell>
                <TableCell>{motorista.cpf}</TableCell>
                <TableCell>{motorista.cnh}</TableCell>
                <TableCell>{motorista.telefone}</TableCell>
                <TableCell>{motorista.usuario?.email || 'N/A'}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenEditDialog(motorista)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDeleteMotorista(motorista.id)} color="error"><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEditing ? 'Editar Motorista' : 'Adicionar Motorista'}</DialogTitle>
        <DialogContent>
          <DialogContentText>Preencha os dados do motorista.</DialogContentText>
          {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
          <TextField name="nome" label="Nome" value={currentMotorista.nome} onChange={handleInputChange} fullWidth margin="dense" />
          <TextField name="cpf" label="CPF" value={currentMotorista.cpf} onChange={handleInputChange} fullWidth margin="dense" />
          <TextField name="cnh" label="CNH" value={currentMotorista.cnh} onChange={handleInputChange} fullWidth margin="dense" />
          <TextField name="telefone" label="Telefone" value={currentMotorista.telefone} onChange={handleInputChange} fullWidth margin="dense" />
          <Typography variant="subtitle1" sx={{ mt: 2 }}>Credenciais do Usuário</Typography>
          <TextField name="email" label="Email do Usuário" value={currentMotorista.usuario?.email || ''} onChange={handleUsuarioInputChange} fullWidth margin="dense" />
          {!isEditing && <TextField name="senhaHash" label="Senha" type="password" onChange={handleUsuarioInputChange} fullWidth margin="dense" helperText="A senha será criptografada no back-end." />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveMotorista}>{isEditing ? 'Salvar' : 'Adicionar'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Motoristas;
