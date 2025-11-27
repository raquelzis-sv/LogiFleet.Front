import axios from 'axios';

// A URL base da sua API .NET.
// Se você estiver rodando o back-end e o front-end em domínios/portas diferentes,
// você precisará configurar o CORS no seu back-end.
// O launchSettings.json no seu projeto .NET geralmente define a porta.
// Ex: "applicationUrl": "https://localhost:7258;http://localhost:5258"
const API_URL = 'https://localhost:7188/api'; // Ajustado conforme porta e protocolo do backend

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para adicionar o token JWT ao cabeçalho de todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
