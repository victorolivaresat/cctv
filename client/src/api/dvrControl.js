import axios from "./axios";

// Crear un nuevo DvrControl
export const createDvrControl = async (dvrControlData) => {
  const { data } = await axios.post('dvr-controls', dvrControlData);
  return data;
};

// Actualizar un DvrControl por ID
export const updateDvrControl = async (id, dvrControlData) => {
  const { data } = await axios.put(`dvr-controls/${id}`, dvrControlData);
  return data;
};

// Actualizar el estado de las notificaciones de un DvrControl
export const updateDvrControlStatus = async (id, status) => {
  const { data } = await axios.patch(`dvr-controls/${id}/status`, { notifications_status: status });
  return data;
};

// Obtener todos los DvrControls
export const getAllDvrControls = async () => {
  const { data } = await axios.get('dvr-controls');
  return data;
};

// Obtener un DvrControl por ID
export const getDvrControl = async (id) => {
  const { data } = await axios.get(`dvr-controls/${id}`);
  return data;
};

// Eliminar un DvrControl por ID
export const deleteDvrControl = async (id) => {
  const { data } = await axios.delete(`dvr-controls/${id}`);
  return data;
};
