import api from './api';

const veiculoService = {
  getAllVeiculos: async () => {
    try {
      const response = await api.get('/veiculo');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
      throw error;
    }
  },

  getVeiculoById: async (id) => {
    try {
      const response = await api.get(`/veiculo/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar veículo com ID ${id}:`, error);
      throw error;
    }
  },
  
  getVeiculosDisponiveis: async () => {
    try {
      const response = await api.get('/veiculo/DisponiveisParaRota');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar veículos disponíveis:', error);
      throw error;
    }
  },

  createVeiculo: async (veiculoData) => {
    try {
      const response = await api.post('/veiculo', veiculoData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar veículo:', error);
      throw error;
    }
  },

  updateVeiculo: async (id, veiculoData) => {
    try {
      const response = await api.put(`/veiculo/${id}`, veiculoData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar veículo com ID ${id}:`, error);
      throw error;
    }
  },

  deleteVeiculo: async (id) => {
    try {
      const response = await api.delete(`/veiculo/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar veículo com ID ${id}:`, error);
      throw error;
    }
  },
};

export default veiculoService;
