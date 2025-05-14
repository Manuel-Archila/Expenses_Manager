import api from './api';

export const getCategorias = () => api.get('/categories');

export const crearCategoria = (data) => api.post('/categories', data);

export const actualizarCategoria = (id, data) => api.put(`/categories/${id}`, data);

export const eliminarCategoria = (id) => api.delete(`/categories/${id}`);
