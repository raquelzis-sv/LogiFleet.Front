import api from './api';

const rotaService = {
  /**
   * Busca todas as rotas.
   */
  getAllRotas: async () => {
    try {
      const response = await api.get('/rota');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar rotas:', error);
      throw error;
    }
  },

  /**
   * Busca apenas as rotas do motorista autenticado.
   */
  getMinhasRotas: async () => {
    try {
      const response = await api.get('/rota/minhas-rotas');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar minhas rotas:', error);
      throw error;
    }
  },

  /**
   * Cria uma nova rota.
   * @param {object} rotaRequest - O objeto da requisição.
   * @param {number} rotaRequest.veiculoId - ID do veículo.
   * @param {number} rotaRequest.motoristaId - ID do motorista.
   * @param {number[]} rotaRequest.pedidosIds - Lista de IDs dos pedidos.
   */
  createRota: async (rotaRequest) => {
    try {
      const response = await api.post('/rota', rotaRequest);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar rota:', error);
      throw error;
    }
  },

  /**
   * Marca um pedido como entregue dentro de uma rota.
   * @param {number} rotaId - ID da rota.
   * @param {number} pedidoId - ID do pedido.
   */
  marcarPedidoComoEntregue: async (rotaId, pedidoId) => {
    try {
      const response = await api.put(`/rota/${rotaId}/pedidos/${pedidoId}/entregar`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao marcar pedido ${pedidoId} da rota ${rotaId} como entregue:`, error);
      throw error;
    }
  },
};

export default rotaService;
