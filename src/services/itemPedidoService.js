import api from './api';

const itemPedidoService = {
  getItensByPedidoId: async (pedidoId) => {
    try {
      // Assumes an endpoint like /api/itemPedido?pedidoId={pedidoId}
      const response = await api.get(`/itemPedido?pedidoId=${pedidoId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar itens para o pedido ${pedidoId}:`, error);
      throw error;
    }
  },

  createItemPedido: async (itemData) => {
    try {
      const response = await api.post('/itemPedido', itemData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar item de pedido:", error);
      throw error;
    }
  },

  updateItemPedido: async (id, itemData) => {
    try {
      const response = await api.put(`/itemPedido/${id}`, itemData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar item de pedido com ID ${id}:`, error);
      throw error;
    }
  },

  deleteItemPedido: async (id) => {
    try {
      const response = await api.delete(`/itemPedido/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar item de pedido com ID ${id}:`, error);
      throw error;
    }
  },
};

export default itemPedidoService;
