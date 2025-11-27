import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton,
  CircularProgress, Alert, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, TextField, Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import HomeWorkIcon from '@mui/icons-material/HomeWork'; // Icon for addresses
import clienteService from '../services/clienteService';
import enderecoService from '../services/enderecoService'; // Import the new service

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for Cliente CRUD Dialog
  const [openClienteDialog, setOpenClienteDialog] = useState(false);
  const [isEditingCliente, setIsEditingCliente] = useState(false);
  const [currentCliente, setCurrentCliente] = useState({ id: null, nomeEmpresa: '', cnpj: '', nomeContato: '', email: '', telefone: '' });

  // State for Endereco Dialog
  const [openEnderecoDialog, setOpenEnderecoDialog] = useState(false);
  const [enderecos, setEnderecos] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [enderecoError, setEnderecoError] = useState('');

  // State for Endereco Form (nested dialog)
  const [openEnderecoFormDialog, setOpenEnderecoFormDialog] = useState(false);
  const [isEditingEndereco, setIsEditingEndereco] = useState(false);
  const [currentEndereco, setCurrentEndereco] = useState({ id: null, cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '', clienteId: null });


  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await clienteService.getAllClientes();
      setClientes(data);
    } catch (err) {
      setError('Erro ao carregar clientes: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // --- Cliente Dialog Handlers ---
  const handleOpenAddClienteDialog = () => {
    setIsEditingCliente(false);
    setCurrentCliente({ id: null, nomeEmpresa: '', cnpj: '', nomeContato: '', email: '', telefone: '' });
    setOpenClienteDialog(true);
  };

  const handleOpenEditClienteDialog = (cliente) => {
    setIsEditingCliente(true);
    setCurrentCliente(cliente);
    setOpenClienteDialog(true);
  };

  const handleCloseClienteDialog = () => {
    setOpenClienteDialog(false);
    if (error) setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCliente((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveCliente = async () => {
    try {
      setError('');
      if (isEditingCliente) {
        await clienteService.updateCliente(currentCliente.id, currentCliente);
      } else {
        await clienteService.createCliente(currentCliente);
      }
      fetchClientes();
      handleCloseClienteDialog();
    } catch (err) {
      setError('Erro ao salvar cliente: ' + (err.response?.data || err.message));
    }
  };

  const handleDeleteCliente = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este cliente? Seus endereços também serão afetados.')) {
      try {
        setError('');
        await clienteService.deleteCliente(id);
        fetchClientes();
      } catch (err) {
        setError('Erro ao deletar cliente: ' + (err.response?.data || err.message));
      }
    }
  };

  // --- Endereco Dialog and Form Handlers ---
  const handleOpenEnderecosDialog = async (cliente) => {
    try {
        setLoading(true);
        setEnderecoError('');
        setSelectedCliente(cliente);
        const data = await enderecoService.getEnderecosByClienteId(cliente.id);
        setEnderecos(data);
        setOpenEnderecoDialog(true);
    } catch (err) {
        setEnderecoError('Erro ao carregar endereços: ' + (err.response?.data?.message || err.message));
    } finally {
        setLoading(false);
    }
  };

  const handleCloseEnderecosDialog = () => {
    setOpenEnderecoDialog(false);
    setSelectedCliente(null);
    setEnderecos([]);
  };

  const handleOpenAddEnderecoForm = () => {
    setIsEditingEndereco(false);
    setCurrentEndereco({ id: null, cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '', clienteId: selectedCliente.id });
    setOpenEnderecoFormDialog(true);
  };

  const handleOpenEditEnderecoForm = (endereco) => {
    setIsEditingEndereco(true);
    setCurrentEndereco(endereco);
    setOpenEnderecoFormDialog(true);
  };

  const handleCloseEnderecoForm = () => {
    setOpenEnderecoFormDialog(false);
    if(enderecoError) setEnderecoError('');
  };

  const handleEnderecoInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEndereco((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEndereco = async () => {
    try {
        setEnderecoError('');
        if (isEditingEndereco) {
            await enderecoService.updateEndereco(currentEndereco.id, currentEndereco);
        } else {
            await enderecoService.createEndereco(currentEndereco);
        }
        // Refresh the addresses list in the main dialog
        const data = await enderecoService.getEnderecosByClienteId(selectedCliente.id);
        setEnderecos(data);
        handleCloseEnderecoForm();
    } catch (err) {
        setEnderecoError('Erro ao salvar endereço: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteEndereco = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este endereço?')) {
        try {
            setEnderecoError('');
            await enderecoService.deleteEndereco(id);
            // Refresh the addresses list
            const data = await enderecoService.getEnderecosByClienteId(selectedCliente.id);
            setEnderecos(data);
        } catch (err) {
            setEnderecoError('Erro ao deletar endereço: ' + (err.response?.data?.message || err.message));
        }
    }
  };


  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error && !openClienteDialog) return <Box sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Box>;

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gerenciamento de Clientes
      </Typography>
      <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 2 }} onClick={handleOpenAddClienteDialog}>
        Adicionar Cliente
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome da Empresa</TableCell>
              <TableCell>CNPJ</TableCell>
              <TableCell>Contato</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.length > 0 ? clientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell>{cliente.nomeEmpresa}</TableCell>
                <TableCell>{cliente.cnpj}</TableCell>
                <TableCell>{cliente.nomeContato}</TableCell>
                <TableCell>{cliente.email}</TableCell>
                <TableCell>{cliente.telefone}</TableCell>
                <TableCell align="right">
                  <IconButton title="Gerenciar Endereços" onClick={() => handleOpenEnderecosDialog(cliente)}>
                    <HomeWorkIcon />
                  </IconButton>
                  <IconButton title="Editar Cliente" onClick={() => handleOpenEditClienteDialog(cliente)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton title="Deletar Cliente" color="error" onClick={() => handleDeleteCliente(cliente.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={6} align="center">Nenhum cliente encontrado.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- Cliente Add/Edit Dialog --- */}
      <Dialog open={openClienteDialog} onClose={handleCloseClienteDialog} maxWidth="md" fullWidth>
        <DialogTitle>{isEditingCliente ? 'Editar Cliente' : 'Adicionar Cliente'}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Grid container spacing={2} sx={{mt: 1}}>
            <Grid item xs={12} sm={6}><TextField name="nomeEmpresa" label="Nome da Empresa" value={currentCliente.nomeEmpresa} onChange={handleInputChange} fullWidth /></Grid>
            <Grid item xs={12} sm={6}><TextField name="cnpj" label="CNPJ" value={currentCliente.cnpj} onChange={handleInputChange} fullWidth /></Grid>
            <Grid item xs={12} sm={6}><TextField name="nomeContato" label="Nome do Contato" value={currentCliente.nomeContato} onChange={handleInputChange} fullWidth /></Grid>
            <Grid item xs={12} sm={6}><TextField name="email" label="Email" type="email" value={currentCliente.email} onChange={handleInputChange} fullWidth /></Grid>
            <Grid item xs={12} sm={6}><TextField name="telefone" label="Telefone" value={currentCliente.telefone} onChange={handleInputChange} fullWidth /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseClienteDialog}>Cancelar</Button>
          <Button onClick={handleSaveCliente}>{isEditingCliente ? 'Salvar' : 'Adicionar'}</Button>
        </DialogActions>
      </Dialog>

      {/* --- Enderecos Management Dialog --- */}
      <Dialog open={openEnderecoDialog} onClose={handleCloseEnderecosDialog} maxWidth="lg" fullWidth>
        <DialogTitle>Endereços de: {selectedCliente?.nomeEmpresa}</DialogTitle>
        <DialogContent>
          {enderecoError && <Alert severity="error" sx={{ mb: 2 }}>{enderecoError}</Alert>}
          <Button variant="contained" startIcon={<AddIcon />} sx={{ my: 2 }} onClick={handleOpenAddEnderecoForm}>
            Adicionar Endereço
          </Button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>CEP</TableCell>
                  <TableCell>Logradouro</TableCell>
                  <TableCell>Nº</TableCell>
                  <TableCell>Cidade</TableCell>
                  <TableCell>UF</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {enderecos.length > 0 ? enderecos.map((end) => (
                  <TableRow key={end.id}>
                    <TableCell>{end.cep}</TableCell>
                    <TableCell>{end.logradouro}</TableCell>
                    <TableCell>{end.numero}</TableCell>
                    <TableCell>{end.cidade}</TableCell>
                    <TableCell>{end.uf}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleOpenEditEnderecoForm(end)}><EditIcon /></IconButton>
                      <IconButton color="error" onClick={() => handleDeleteEndereco(end.id)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">Nenhum endereço cadastrado para este cliente.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCloseEnderecosDialog}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* --- Endereco Add/Edit Form Dialog (Nested) --- */}
      <Dialog open={openEnderecoFormDialog} onClose={handleCloseEnderecoForm} maxWidth="md" fullWidth>
        <DialogTitle>{isEditingEndereco ? 'Editar Endereço' : 'Adicionar Endereço'}</DialogTitle>
        <DialogContent>
            {enderecoError && <Alert severity="error" sx={{ mb: 2 }}>{enderecoError}</Alert>}
            <Grid container spacing={2} sx={{mt: 1}}>
                <Grid item xs={12} sm={4}><TextField name="cep" label="CEP" value={currentEndereco.cep} onChange={handleEnderecoInputChange} fullWidth /></Grid>
                <Grid item xs={12} sm={8}><TextField name="logradouro" label="Logradouro" value={currentEndereco.logradouro} onChange={handleEnderecoInputChange} fullWidth /></Grid>
                <Grid item xs={12} sm={4}><TextField name="numero" label="Número" value={currentEndereco.numero} onChange={handleEnderecoInputChange} fullWidth /></Grid>
                <Grid item xs={12} sm={8}><TextField name="complemento" label="Complemento" value={currentEndereco.complemento} onChange={handleEnderecoInputChange} fullWidth /></Grid>
                <Grid item xs={12} sm={5}><TextField name="bairro" label="Bairro" value={currentEndereco.bairro} onChange={handleEnderecoInputChange} fullWidth /></Grid>
                <Grid item xs={12} sm={5}><TextField name="cidade" label="Cidade" value={currentEndereco.cidade} onChange={handleEnderecoInputChange} fullWidth /></Grid>
                <Grid item xs={12} sm={2}><TextField name="uf" label="UF" value={currentEndereco.uf} onChange={handleEnderecoInputChange} fullWidth /></Grid>
                <Grid item xs={12} sm={6}><TextField name="latitude" label="Latitude" value={currentEndereco.latitude} InputProps={{ readOnly: true }} fullWidth /></Grid>
                <Grid item xs={12} sm={6}><TextField name="longitude" label="Longitude" value={currentEndereco.longitude} InputProps={{ readOnly: true }} fullWidth /></Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCloseEnderecoForm}>Cancelar</Button>
            <Button onClick={handleSaveEndereco}>{isEditingEndereco ? 'Salvar' : 'Adicionar'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Clientes;
