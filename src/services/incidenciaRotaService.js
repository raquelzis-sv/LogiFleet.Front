import api from './api';

const incidenciaRotaService = {
  createIncidencia: async (incidenciaData) => {
    try {
      const response = await api.post('/incidenciaRota', incidenciaData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar incidência:", error);
      throw error;
    }
  },
};

export default incidenciaRotaService;
