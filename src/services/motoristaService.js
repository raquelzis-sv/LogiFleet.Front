import api from './api';

const motoristaService = {
  getAllMotoristas: async () => {
    try {
      const response = await api.get('/motorista');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar motoristas:', error);
      throw error;
    }
  },

  getMotoristaById: async (id) => {
    try {
      const response = await api.get(`/motorista/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar motorista com ID ${id}:`, error);
      throw error;
    }
  },

  // A 'motoristaData' pode incluir um objeto 'usuario' com 'email' e 'senhaHash'
  createMotorista: async (motoristaData) => {
    try {
      const response = await api.post('/motorista', motoristaData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar motorista:', error);
      throw error;
    }
  },

  updateMotorista: async (id, motoristaData) => {
    try {
      const response = await api.put(`/motorista/${id}`, motoristaData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar motorista com ID ${id}:`, error);
      throw error;
    }
  },

  deleteMotorista: async (id) => {
    try {
      const response = await api.delete(`/motorista/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar motorista com ID ${id}:`, error);
      throw error;
    }
  },
};

export default motoristaService;
