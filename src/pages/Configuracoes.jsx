import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton,
  CircularProgress, Alert, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import configuracaoService from '../services/configuracaoService';

function Configuracoes() {
  const [configuracoes, setConfiguracoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentConfig, setCurrentConfig] = useState({ id: null, apiNome: '', endpoint: '', chave: '', valor: '' });

  useEffect(() => {
    fetchConfiguracoes();
  }, []);

  const fetchConfiguracoes = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await configuracaoService.getAllConfiguracoes();
      setConfiguracoes(data);
    } catch (err) {
      setError('Erro ao carregar configurações: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setIsEditing(false);
    setCurrentConfig({ id: null, apiNome: '', endpoint: '', chave: '', valor: '' });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (config) => {
    setIsEditing(true);
    setCurrentConfig(config);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await configuracaoService.updateConfiguracao(currentConfig.id, currentConfig);
      } else {
        await configuracaoService.createConfiguracao(currentConfig);
      }
      fetchConfiguracoes();
      handleCloseDialog();
    } catch (err) {
      setError('Erro ao salvar configuração: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta configuração?')) {
      try {
        await configuracaoService.deleteConfiguracao(id);
        fetchConfiguracoes();
      } catch (err) {
        setError('Erro ao deletar configuração: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Box>;

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Configurações do Sistema
      </Typography>
      <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 2 }} onClick={handleOpenAddDialog}>
        Adicionar Configuração
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>API</TableCell>
              <TableCell>Endpoint</TableCell>
              <TableCell>Chave</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {configuracoes.length > 0 ? configuracoes.map((config) => (
              <TableRow key={config.id}>
                <TableCell>{config.apiNome}</TableCell>
                <TableCell>{config.endpoint}</TableCell>
                <TableCell>{config.chave}</TableCell>
                <TableCell>{config.valor}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenEditDialog(config)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(config.id)} color="error"><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} align="center">Nenhuma configuração encontrada.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Editar Configuração' : 'Adicionar Configuração'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{mt: 1}}>
            <Grid item xs={12} sm={6}><TextField name="apiNome" label="Nome da API" value={currentConfig.apiNome} onChange={handleInputChange} fullWidth /></Grid>
            <Grid item xs={12} sm={6}><TextField name="chave" label="Chave" value={currentConfig.chave} onChange={handleInputChange} fullWidth /></Grid>
            <Grid item xs={12}><TextField name="endpoint" label="Endpoint" value={currentConfig.endpoint} onChange={handleInputChange} fullWidth /></Grid>
            <Grid item xs={12}><TextField name="valor" label="Valor" value={currentConfig.valor} onChange={handleInputChange} fullWidth /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSave}>{isEditing ? 'Salvar' : 'Adicionar'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Configuracoes;
