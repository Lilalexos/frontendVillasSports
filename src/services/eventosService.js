import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/eventos`;

// Configuración de axios con credenciales para enviar cookies (token en cookie)
const axiosAuth = axios.create({
  withCredentials: true,
});

// Obtener todos los eventos con filtros opcionales
export const obtenerEventos = (filtros = {}) => {
  const query = new URLSearchParams(filtros).toString();
  const url = query ? `${API_URL}?${query}` : API_URL;
  return axiosAuth.get(url);
};

// Obtener evento por ID
export const obtenerEventoPorId = (id) => {
  return axiosAuth.get(`${API_URL}/${id}`);
};

// Obtener eventos del usuario autenticado
export const obtenerEventosPorUsuario = () => {
  return axiosAuth.get(`${API_URL}/mis-eventos`);
};

// Crear nuevo evento
export const crearEvento = (eventoData) => {
  return axiosAuth.post(API_URL, eventoData);
};

// Actualizar evento existente
export const actualizarEvento = (id, eventoData) => {
  return axiosAuth.put(`${API_URL}/${id}`, eventoData);
};

// Eliminar evento por ID
export const eliminarEvento = (id) => {
  return axiosAuth.delete(`${API_URL}/${id}`);
};