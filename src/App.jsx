import AppRouter from './routes';
import { useAuth } from './context/AuthContext';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>; // Or a beautiful spinner
  }

  return <AppRouter />;
}

export default App;