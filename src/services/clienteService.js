import api from './api';

const clienteService = {
  getAllClientes: async () => {
    try {
      const response = await api.get('/cliente'); // Assumindo que a rota do controller é /api/cliente
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      throw error;
    }
  },

  getClienteById: async (id) => {
    try {
      const response = await api.get(`/cliente/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar cliente com ID ${id}:`, error);
      throw error;
    }
  },

  createCliente: async (clienteData) => {
    try {
      const response = await api.post('/cliente', clienteData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  },

  updateCliente: async (id, clienteData) => {
    try {
      const response = await api.put(`/cliente/${id}`, clienteData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar cliente com ID ${id}:`, error);
      throw error;
    }
  },

  deleteCliente: async (id) => {
    try {
      const response = await api.delete(`/cliente/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar cliente com ID ${id}:`, error);
      throw error;
    }
  },
};

export default clienteService;
