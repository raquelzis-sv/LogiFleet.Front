import api from './api';

const configuracaoService = {
  getAllConfiguracoes: async () => {
    try {
      const response = await api.get('/configuracaoSistema');
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar configurações:", error);
      throw error;
    }
  },

  getConfiguracaoById: async (id) => {
    try {
      const response = await api.get(`/configuracaoSistema/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar configuração com ID ${id}:`, error);
      throw error;
    }
  },

  createConfiguracao: async (configData) => {
    try {
      const response = await api.post('/configuracaoSistema', configData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar configuração:", error);
      throw error;
    }
  },

  updateConfiguracao: async (id, configData) => {
    try {
      const response = await api.put(`/configuracaoSistema/${id}`, configData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar configuração com ID ${id}:`, error);
      throw error;
    }
  },

  deleteConfiguracao: async (id) => {
    try {
      const response = await api.delete(`/configuracaoSistema/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar configuração com ID ${id}:`, error);
      throw error;
    }
  },
};

export default configuracaoService;
