import api from './api';

const logIntegracaoService = {
  getAllLogs: async () => {
    try {
      const response = await api.get('/logIntegracao');
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar logs de integração:", error);
      throw error;
    }
  },
};

export default logIntegracaoService;
