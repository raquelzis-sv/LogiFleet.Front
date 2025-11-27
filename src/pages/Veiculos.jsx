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
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import veiculoService from '../services/veiculoService';
import { format, parseISO } from 'date-fns';

// O enum StatusVeiculo do back-end
const statusVeiculoEnum = {
  0: 'Disponível',
  1: 'Em Rota',
  2: 'Em Manutenção',
  3: 'Inativo'
};

function Veiculos() {
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVeiculo, setCurrentVeiculo] = useState({ 
    id: null, placa: '', marca: '', modelo: '', ano: new Date().getFullYear(), capacidadeCarga: 1000, status: 0 
  });

  useEffect(() => {
    fetchVeiculos();
  }, []);

  const fetchVeiculos = async () => {
    try {
      setLoading(true);
      const data = await veiculoService.getAllVeiculos();
      setVeiculos(data);
    } catch (err) {
      setError('Erro ao carregar veículos: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setIsEditing(false);
    setCurrentVeiculo({ id: null, placa: '', marca: '', modelo: '', ano: new Date().getFullYear(), capacidadeCarga: 1000, status: 0 });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (veiculo) => {
    setIsEditing(true);
    setCurrentVeiculo({
      ...veiculo,
      dataUltimaManutencao: veiculo.dataUltimaManutencao ? format(parseISO(veiculo.dataUltimaManutencao), 'yyyy-MM-dd') : '',
      dataProximaManutencao: veiculo.dataProximaManutencao ? format(parseISO(veiculo.dataProximaManutencao), 'yyyy-MM-dd') : ''
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentVeiculo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveVeiculo = async () => {
    try {
      if (isEditing) {
        await veiculoService.updateVeiculo(currentVeiculo.id, currentVeiculo);
      } else {
        await veiculoService.createVeiculo(currentVeiculo);
      }
      fetchVeiculos();
      handleCloseDialog();
    } catch (err) {
      setError('Erro ao salvar veículo: ' + (err.response?.data || err.message));
    }
  };

  const handleDeleteVeiculo = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este veículo?')) {
      try {
        await veiculoService.deleteVeiculo(id);
        fetchVeiculos();
      } catch (err) {
        setError('Erro ao deletar veículo: ' + (err.response?.data || err.message));
      }
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error && !openDialog) return <Box sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Box>;

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>Gerenciamento de Veículos</Typography>
      <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 2 }} onClick={handleOpenAddDialog}>Adicionar Veículo</Button>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Placa</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell>Modelo</TableCell>
              <TableCell>Ano</TableCell>
              <TableCell>Capacidade (kg)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {veiculos.map((veiculo) => (
              <TableRow key={veiculo.id}>
                <TableCell>{veiculo.placa}</TableCell>
                <TableCell>{veiculo.marca}</TableCell>
                <TableCell>{veiculo.modelo}</TableCell>
                <TableCell>{veiculo.ano}</TableCell>
                <TableCell>{veiculo.capacidadeCarga}</TableCell>
                <TableCell>{statusVeiculoEnum[veiculo.status]}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenEditDialog(veiculo)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDeleteVeiculo(veiculo.id)} color="error"><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
        <DialogTitle>{isEditing ? 'Editar Veículo' : 'Adicionar Veículo'}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Preencha os dados do veículo.
          </DialogContentText>
          {error && <Alert severity="error">{error}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}><TextField name="placa" label="Placa" value={currentVeiculo.placa} onChange={handleInputChange} fullWidth /></Grid>
            <Grid item xs={12} sm={6}><TextField name="marca" label="Marca" value={currentVeiculo.marca} onChange={handleInputChange} fullWidth /></Grid>
            <Grid item xs={12} sm={6}><TextField name="modelo" label="Modelo" value={currentVeiculo.modelo} onChange={handleInputChange} fullWidth /></Grid>
            <Grid item xs={12} sm={6}><TextField name="ano" label="Ano" type="number" value={currentVeiculo.ano} onChange={handleInputChange} fullWidth /></Grid>
            <Grid item xs={12} sm={6}><TextField name="capacidadeCarga" label="Capacidade (kg)" type="number" value={currentVeiculo.capacidadeCarga} onChange={handleInputChange} fullWidth /></Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="status-label">Status</InputLabel>
                <Select labelId="status-label" name="status" value={currentVeiculo.status} label="Status" onChange={handleInputChange}>
                  {Object.entries(statusVeiculoEnum).map(([key, value]) => (
                    <MenuItem key={key} value={parseInt(key)}>{value}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {isEditing && (
              <>
                <Grid item xs={12} sm={6}><TextField name="dataUltimaManutencao" label="Última Manutenção" type="date" value={currentVeiculo.dataUltimaManutencao} onChange={handleInputChange} InputLabelProps={{ shrink: true }} fullWidth /></Grid>
                <Grid item xs={12} sm={6}><TextField name="dataProximaManutencao" label="Próxima Manutenção" type="date" value={currentVeiculo.dataProximaManutencao} onChange={handleInputChange} InputLabelProps={{ shrink: true }} fullWidth /></Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveVeiculo}>{isEditing ? 'Salvar' : 'Adicionar'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Veiculos;
