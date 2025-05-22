// services/gastos.js
import api from './api';

export const crearGastoUnico = (data) => api.post('/expenses', data);

export const crearGastoFijo = (data) => api.post('/fixed-expenses', data);
