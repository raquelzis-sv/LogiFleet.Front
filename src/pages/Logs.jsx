import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper,
  CircularProgress, Alert
} from '@mui/material';
import logIntegracaoService from '../services/logIntegracaoService';
import { format } from 'date-fns';

function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await logIntegracaoService.getAllLogs();
      setLogs(data);
    } catch (err) {
      setError('Erro ao carregar logs: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Box>;

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Logs de Integração
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>API</TableCell>
              <TableCell>Endpoint</TableCell>
              <TableCell>Data e Hora</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.length > 0 ? logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.id}</TableCell>
                <TableCell>{log.apiNome}</TableCell>
                <TableCell>{log.endpoint}</TableCell>
                <TableCell>{format(new Date(log.dataHora), 'dd/MM/yyyy HH:mm:ss')}</TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} align="center">Nenhum log encontrado.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Logs;
