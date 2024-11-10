import axios from "./axios";

export const getTheme = async (userId) => {
  try {
    const response = await axios.get(`/users/${userId}/theme`);

    if (response.data) {
      return response.data;
    } else {
      console.error('No se recibieron datos');
    }
  } catch (error) {
    console.error(`Error al obtener el tema: ${error.message}`);
  }
};

export const updateTheme = async (userId, theme) => {
  try {
    const response = await axios.put(`/users/${userId}/theme`, { darkMode: theme });

    if (response.data) {
      return response.data;
    } else {
      console.error('No se recibieron datos');
    }
  } catch (error) {
    console.error(`Error al actualizar el tema: ${error.message}`);
  }
};