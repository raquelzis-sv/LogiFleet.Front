import api from './api';

const pedidoService = {
  /**
   * Busca todos os pedidos.
   */
  getAllPedidos: async () => {
    try {
      const response = await api.get('/pedido');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      throw error;
    }
  },

  /**
   * Busca apenas os pedidos com status "Pendente".
   * O enum para StatusPedido é: 0:Pendente, 1:EmRota, 2:Entregue, 3:Cancelado
   */
  getPedidosPendentes: async () => {
    try {
      const response = await api.get('/pedido/pendentes');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pedidos pendentes:', error);
      throw error;
    }
  },

  /**
   * Busca apenas os pedidos do cliente autenticado.
   */
  getMeusPedidos: async () => {
    try {
      const response = await api.get('/pedido/meus-pedidos');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar meus pedidos:', error);
      throw error;
    }
  },

  createPedido: async (pedidoData) => {
    try {
      const response = await api.post('/pedido', pedidoData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      throw error;
    }
  },
  
  updatePedido: async (id, pedidoData) => {
    try {
      const response = await api.put(`/pedido/${id}`, pedidoData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      throw error;
    }
  },

  deletePedido: async (id) => {
    try {
      const response = await api.delete(`/pedido/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar pedido:', error);
      throw error;
    }
  },
};

export default pedidoService;
