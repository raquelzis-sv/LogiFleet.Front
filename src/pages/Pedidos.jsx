import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,
  CircularProgress, Alert, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';

import pedidoService from '../services/pedidoService';
import itemPedidoService from '../services/itemPedidoService';
import clienteService from '../services/clienteService';

const statusPedidoEnum = { 0: 'Pendente', 1: 'Em Rota', 2: 'Entregue', 3: 'Cancelado' };

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const [openItensDialog, setOpenItensDialog] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [itens, setItens] = useState([]);
  const [itemError, setItemError] = useState('');

  const [openItemFormDialog, setOpenItemFormDialog] = useState(false);
  const [isEditingItem, setIsEditingItem] = useState(false);
  const [currentItem, setCurrentItem] = useState({ id: null, descricao: '', quantidade: 0, pesoUnitarioKg: 0, volumeUnitarioM3: 0, codigoProduto: '', pedidoId: null });

  useEffect(() => {
    if (user) {
        fetchInitialData();
    }
  }, [user]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError('');
      let pedidosData;
      if (user.role === 'Administrador') {
        const [pData, cData] = await Promise.all([
          pedidoService.getAllPedidos(),
          clienteService.getAllClientes()
        ]);
        pedidosData = pData;
        setClientes(cData);
      } else if (user.role === 'Cliente') {
        pedidosData = await pedidoService.getMeusPedidos();
      }
      setPedidos(pedidosData || []);
    } catch (err) {
      setError('Erro ao carregar pedidos: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };
  
  const getClienteNome = (clienteId) => clientes.find(c => c.id === clienteId)?.nomeEmpresa || 'Desconhecido';

  const handleOpenItensDialog = async (pedido) => {
    try {
      setLoading(true);
      setItemError('');
      setSelectedPedido(pedido);
      const data = await itemPedidoService.getItensByPedidoId(pedido.id);
      setItens(data);
      setOpenItensDialog(true);
    } catch (err) {
      setItemError('Erro ao carregar itens: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };
  const handleCloseItensDialog = () => setOpenItensDialog(false);

  const handleOpenAddItemForm = () => {
    setIsEditingItem(false);
    setCurrentItem({ id: null, descricao: '', quantidade: 1, pesoUnitarioKg: 0, volumeUnitarioM3: 0, codigoProduto: '', pedidoId: selectedPedido.id });
    setOpenItemFormDialog(true);
  };
  const handleOpenEditItemForm = (item) => {
    setIsEditingItem(true);
    setCurrentItem(item);
    setOpenItemFormDialog(true);
  };
  const handleCloseItemForm = () => {
    setOpenItemFormDialog(false);
    setItemError('');
  };
  
  const handleItemInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveItem = async () => {
    try {
      setItemError('');
      if (isEditingItem) {
        await itemPedidoService.updateItemPedido(currentItem.id, currentItem);
      } else {
        await itemPedidoService.createItemPedido(currentItem);
      }
      const data = await itemPedidoService.getItensByPedidoId(selectedPedido.id);
      setItens(data);
      handleCloseItemForm();
    } catch (err) {
      setItemError('Erro ao salvar item: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Tem certeza que deseja deletar este item?')) {
      try {
        setItemError('');
        await itemPedidoService.deleteItemPedido(itemId);
        const data = await itemPedidoService.getItensByPedidoId(selectedPedido.id);
        setItens(data);
      } catch (err) {
        setItemError('Erro ao deletar item: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  if (loading && !openItensDialog) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Box>;

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {user?.role === 'Cliente' ? 'Meus Pedidos' : 'Gerenciamento de Pedidos'}
      </Typography>
      
      {user?.role === 'Administrador' && (
        <Alert severity="info" sx={{mb: 2}}>A criação de pedidos foi simplificada. Para criar um pedido, adicione-o diretamente a uma rota na página de Rotas.</Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {user?.role === 'Administrador' && <TableCell>Cliente</TableCell>}
              <TableCell>Data Limite</TableCell>
              <TableCell>Peso (kg)</TableCell>
              <TableCell>Volume (m³)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidos.length > 0 ? pedidos.map((p) => (
              <TableRow key={p.id}>
                {user?.role === 'Administrador' && <TableCell>{getClienteNome(p.clienteId)}</TableCell>}
                <TableCell>{format(new Date(p.dataLimiteEntrega), 'dd/MM/yyyy')}</TableCell>
                <TableCell>{p.pesoTotalKg.toFixed(2)}</TableCell>
                <TableCell>{p.volumeTotalM3.toFixed(2)}</TableCell>
                <TableCell>{statusPedidoEnum[p.status]}</TableCell>
                <TableCell align="right">
                  <IconButton title="Ver Itens" onClick={() => handleOpenItensDialog(p)}><ListAltIcon /></IconButton>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow><TableCell colSpan={user?.role === 'Administrador' ? 6 : 5} align="center">Nenhum pedido encontrado.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Dialog open={openItensDialog} onClose={handleCloseItensDialog} maxWidth="lg" fullWidth>
        <DialogTitle>Itens do Pedido #{selectedPedido?.id}</DialogTitle>
        <DialogContent>
          {loading && <CircularProgress />}
          {itemError && <Alert severity="error" sx={{ mb: 2 }}>{itemError}</Alert>}
          {user?.role === 'Administrador' && (
            <Button variant="contained" startIcon={<AddIcon />} sx={{ my: 2 }} onClick={handleOpenAddItemForm}>Adicionar Item</Button>
          )}
          <TableContainer component={Paper}>
            <Table>
              <TableHead><TableRow><TableCell>Descrição</TableCell><TableCell>Qtd.</TableCell><TableCell>Peso Unit. (kg)</TableCell><TableCell>Volume Unit. (m³)</TableCell>{user?.role === 'Administrador' && <TableCell>Ações</TableCell>}</TableRow></TableHead>
              <TableBody>
                {itens.length > 0 ? itens.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.descricao}</TableCell>
                    <TableCell>{item.quantidade}</TableCell>
                    <TableCell>{item.pesoUnitarioKg.toFixed(2)}</TableCell>
                    <TableCell>{item.volumeUnitarioM3.toFixed(2)}</TableCell>
                    {user?.role === 'Administrador' && (
                      <TableCell>
                        <IconButton onClick={() => handleOpenEditItemForm(item)}><EditIcon /></IconButton>
                        <IconButton color="error" onClick={() => handleDeleteItem(item.id)}><DeleteIcon /></IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={user?.role === 'Administrador' ? 5 : 4} align="center">Nenhum item neste pedido.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions><Button onClick={handleCloseItensDialog}>Fechar</Button></DialogActions>
      </Dialog>
      
      <Dialog open={openItemFormDialog} onClose={handleCloseItemForm} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditingItem ? 'Editar Item' : 'Adicionar Item'}</DialogTitle>
        <DialogContent>
          {itemError && <Alert severity="error" sx={{ mb: 2 }}>{itemError}</Alert>}
          <Grid container spacing={2} sx={{mt: 1}}>
            <Grid item xs={12}><TextField name="descricao" label="Descrição" value={currentItem.descricao} onChange={handleItemInputChange} fullWidth/></Grid>
            <Grid item xs={12} sm={4}><TextField name="quantidade" label="Quantidade" type="number" value={currentItem.quantidade} onChange={handleItemInputChange} fullWidth/></Grid>
            <Grid item xs={12} sm={4}><TextField name="pesoUnitarioKg" label="Peso Unit. (kg)" type="number" value={currentItem.pesoUnitarioKg} onChange={handleItemInputChange} fullWidth/></Grid>
            <Grid item xs={12} sm={4}><TextField name="volumeUnitarioM3" label="Volume Unit. (m³)" type="number" value={currentItem.volumeUnitarioM3} onChange={handleItemInputChange} fullWidth/></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseItemForm}>Cancelar</Button>
          <Button onClick={handleSaveItem}>{isEditingItem ? 'Salvar' : 'Adicionar'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Pedidos;