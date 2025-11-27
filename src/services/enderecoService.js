import api from './api';

const enderecoService = {
  getEnderecosByClienteId: async (clienteId) => {
    try {
      // O endpoint pode variar, assumindo que seja /api/cliente/{id}/enderecos
      // Por enquanto, vamos filtrar do endpoint principal se não houver um específico
      const response = await api.get(`/enderecoClientes?clienteId=${clienteId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar endereços para o cliente ${clienteId}:`, error);
      throw error;
    }
  },

  createEndereco: async (enderecoData) => {
    try {
      const response = await api.post('/enderecoClientes', enderecoData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar endereço:", error);
      throw error;
    }
  },

  updateEndereco: async (id, enderecoData) => {
    try {
      const response = await api.put(`/enderecoClientes/${id}`, enderecoData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar endereço com ID ${id}:`, error);
      throw error;
    }
  },

  deleteEndereco: async (id) => {
    try {
      const response = await api.delete(`/enderecoClientes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar endereço com ID ${id}:`, error);
      throw error;
    }
  },
};

export default enderecoService;
