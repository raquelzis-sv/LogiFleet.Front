import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Accordion, AccordionSummary, AccordionDetails,
  CircularProgress, Alert, Chip, List, ListItem, ListItemText, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, Stepper, Step, StepLabel,
  FormControl, InputLabel, Select, MenuItem, Checkbox, Paper, TextField, Grid
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import WarningIcon from '@mui/icons-material/Warning';
import ReportIcon from '@mui/icons-material/Report';
import { useAuth } from '../context/AuthContext';

import rotaService from '../services/rotaService';
import motoristaService from '../services/motoristaService';
import veiculoService from '../services/veiculoService';
import pedidoService from '../services/pedidoService';
import incidenciaRotaService from '../services/incidenciaRotaService';

const statusRotaEnum = { 0: 'Planejada', 1: 'Em Andamento', 2: 'Concluída', 3: 'Cancelada' };

function CreateRotaDialog({ open, onClose, onRouteCreated }) {
  const [activeStep, setActiveStep] = useState(0);
  const [motoristas, setMotoristas] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [selectedMotorista, setSelectedMotorista] = useState('');
  const [selectedVeiculo, setSelectedVeiculo] = useState('');
  const [selectedPedidos, setSelectedPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      const loadInitialData = async () => {
        try {
          setLoading(true);
          const [motoristasData, veiculosData, pedidosData] = await Promise.all([
            motoristaService.getAllMotoristas(),
            veiculoService.getVeiculosDisponiveis(),
            pedidoService.getPedidosPendentes(),
          ]);
          setMotoristas(motoristasData);
          setVeiculos(veiculosData);
          setPedidos(pedidosData);
          setError('');
        } catch (err) {
          setError('Erro ao carregar dados para criação da rota.');
        } finally {
          setLoading(false);
        }
      };
      loadInitialData();
    }
  }, [open]);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleTogglePedido = (pedidoId) => {
    setSelectedPedidos((prev) =>
      prev.includes(pedidoId) ? prev.filter((id) => id !== pedidoId) : [...prev, pedidoId]
    );
  };

  const handleCreateRota = async () => {
    try {
      setLoading(true);
      await rotaService.createRota({
        motoristaId: selectedMotorista,
        veiculoId: selectedVeiculo,
        pedidosIds: selectedPedidos,
      });
      onRouteCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data || 'Falha ao criar a rota.');
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Selecionar Motorista e Veículo', 'Selecionar Pedidos', 'Revisão'];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <FormControl fullWidth margin="normal">
              <InputLabel>Motorista</InputLabel>
              <Select value={selectedMotorista} label="Motorista" onChange={(e) => setSelectedMotorista(e.target.value)}>
                {motoristas.map((m) => <MenuItem key={m.id} value={m.id}>{m.nome}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Veículo</InputLabel>
              <Select value={selectedVeiculo} label="Veículo" onChange={(e) => setSelectedVeiculo(e.target.value)}>
                {veiculos.map((v) => <MenuItem key={v.id} value={v.id}>{v.placa} - {v.modelo}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        );
      case 1:
        return (
          <Paper style={{ maxHeight: 400, overflow: 'auto' }}>
            <List>
              {pedidos.map((p) => (
                <ListItem key={p.id} dense button onClick={() => handleTogglePedido(p.id)}>
                  <Checkbox checked={selectedPedidos.includes(p.id)} />
                  <ListItemText primary={`Pedido #${p.id}`} secondary={p.enderecoEntrega?.cidade || 'Endereço não informado'} />
                </ListItem>
              ))}
            </List>
          </Paper>
        );
      case 2:
        const motorista = motoristas.find(m => m.id === selectedMotorista);
        const veiculo = veiculos.find(v => v.id === selectedVeiculo);
        return (
          <Box>
            <Typography variant="h6">Resumo da Rota</Typography>
            <Typography><b>Motorista:</b> {motorista?.nome}</Typography>
            <Typography><b>Veículo:</b> {veiculo?.placa} - {veiculo?.modelo}</Typography>
            <Typography><b>Pedidos Selecionados:</b> {selectedPedidos.length}</Typography>
          </Box>
        );
      default:
        return 'Passo desconhecido';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Criar Nova Rota</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
        </Stepper>
        {loading ? <CircularProgress /> : getStepContent(activeStep)}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        {activeStep > 0 && <Button onClick={handleBack}>Voltar</Button>}
        {activeStep < steps.length - 1 && <Button onClick={handleNext}>Avançar</Button>}
        {activeStep === steps.length - 1 && <Button onClick={handleCreateRota} variant="contained" disabled={loading}>{loading ? 'Criando...' : 'Confirmar e Criar Rota'}</Button>}
      </DialogActions>
    </Dialog>
  );
}

function Rotas() {
  const [rotas, setRotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const { user } = useAuth();
  
  const [openIncidenciaDialog, setOpenIncidenciaDialog] = useState(false);
  const [selectedRotaForIncidencia, setSelectedRotaForIncidencia] = useState(null);
  const [incidenciaDescricao, setIncidenciaDescricao] = useState('');
  const [incidenciaError, setIncidenciaError] = useState('');

  useEffect(() => {
    if (user) {
        fetchRotas();
    }
  }, [user]);

  const fetchRotas = async () => {
    try {
      setLoading(true);
      let data;
      if (user.role === 'Administrador') {
        data = await rotaService.getAllRotas();
      } else if (user.role === 'Motorista') {
        data = await rotaService.getMinhasRotas();
      }
      setRotas(data || []);
    } catch (err) {
      setError('Erro ao carregar rotas.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsDelivered = async (rotaId, pedidoId) => {
    try {
      await rotaService.marcarPedidoComoEntregue(rotaId, pedidoId);
      fetchRotas(); 
    } catch (err) {
      alert('Erro ao marcar pedido como entregue.');
    }
  };
  
  const handleOpenIncidenciaDialog = (rota) => {
    setSelectedRotaForIncidencia(rota);
    setIncidenciaDescricao('');
    setIncidenciaError('');
    setOpenIncidenciaDialog(true);
  };
  
  const handleCloseIncidenciaDialog = () => {
    setOpenIncidenciaDialog(false);
  };
  
  const handleSaveIncidencia = async () => {
    if (!incidenciaDescricao) {
      setIncidenciaError('A descrição é obrigatória.');
      return;
    }
    try {
      setIncidenciaError('');
      const incidenciaData = {
        rotaId: selectedRotaForIncidencia.id,
        motoristaId: selectedRotaForIncidencia.motoristaId,
        descricao: incidenciaDescricao,
        dataHora: new Date().toISOString()
      };
      await incidenciaRotaService.createIncidencia(incidenciaData);
      fetchRotas();
      handleCloseIncidenciaDialog();
    } catch (err) {
      setIncidenciaError(err.response?.data || 'Falha ao registrar incidência.');
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {user?.role === 'Motorista' ? 'Minhas Rotas' : 'Gerenciamento de Rotas'}
      </Typography>
      {user?.role === 'Administrador' && (
        <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 2 }} onClick={() => setOpenCreateDialog(true)}>Criar Nova Rota</Button>
      )}

      {rotas.map((rota) => (
        <Accordion key={rota.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ width: '33%', flexShrink: 0 }}>Rota #{rota.id}</Typography>
            <Chip label={statusRotaEnum[rota.status]} color={rota.status === 2 ? 'success' : 'primary'} />
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6">Detalhes</Typography>
                    <Typography><b>Motorista:</b> {rota.motorista?.nome || 'N/A'}</Typography>
                    <Typography><b>Veículo:</b> {rota.veiculo?.placa || 'N/A'}</Typography>
                    <Typography><b>Data:</b> {new Date(rota.dataRota).toLocaleDateString()}</Typography>
                    <Button sx={{mt: 1}} size="small" variant="outlined" startIcon={<ReportIcon />} onClick={() => handleOpenIncidenciaDialog(rota)}>
                      Registrar Incidência
                    </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                    {rota.alertasClimaticos?.length > 0 && (
                        <>
                            <Typography variant="h6">Alertas Climáticos</Typography>
                            <List dense>
                                {rota.alertasClimaticos.map(alerta => (
                                    <ListItem key={alerta.id}><WarningIcon fontSize="small" sx={{mr: 1}}/> <ListItemText primary={alerta.tipoAlerta} secondary={`Severidade: ${alerta.severidade}`} /></ListItem>
                                ))}
                            </List>
                        </>
                    )}
                    {rota.incidencias?.length > 0 && (
                         <>
                            <Typography variant="h6">Incidências Registradas</Typography>
                            <List dense>
                                {rota.incidencias.map(inc => (
                                    <ListItem key={inc.id}><ReportIcon fontSize="small" sx={{mr: 1}}/> <ListItemText primary={inc.descricao} secondary={`Em: ${new Date(inc.dataHora).toLocaleString()}`} /></ListItem>
                                ))}
                            </List>
                        </>
                    )}
                </Grid>
            </Grid>
            <Divider sx={{my: 2}} />
            <Typography variant="h6" sx={{ mt: 2 }}>Pedidos na Rota</Typography>
            <List>
              {rota.rotaPedidos?.map(({ pedido, statusEntrega }) => (
                <ListItem key={pedido.id} secondaryAction={
                  statusEntrega !== 'Entregue' && rota.status !== 2 && (
                    <Button variant="outlined" size="small" onClick={() => handleMarkAsDelivered(rota.id, pedido.id)}>
                      Marcar como Entregue
                    </Button>
                  )
                }>
                  <ListItemText primary={`Pedido #${pedido.id} - Cliente: ${pedido.cliente?.nomeEmpresa || 'N/A'}`} secondary={`Status: ${statusEntrega}`} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}

      <CreateRotaDialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} onRouteCreated={fetchRotas} />
      
      <Dialog open={openIncidenciaDialog} onClose={handleCloseIncidenciaDialog} fullWidth maxWidth="sm">
        <DialogTitle>Registrar Incidência na Rota #{selectedRotaForIncidencia?.id}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="descricao"
            label="Descrição da Incidência"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={incidenciaDescricao}
            onChange={(e) => setIncidenciaDescricao(e.target.value)}
          />
          {incidenciaError && <Alert severity="error" sx={{mt: 2}}>{incidenciaError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseIncidenciaDialog}>Cancelar</Button>
          <Button onClick={handleSaveIncidencia}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Rotas;