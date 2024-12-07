import axios from "./axios";

export const createUser = async (userData) => {
  const { data } = await axios.post('users', userData);
  return data;
};

export const updateUser = async (id, userData) => {
  const { data } = await axios.put(`users/${id}`, userData);
  return data;
};

export const getAllUsers = async () => {
  const { data } = await axios.get('users');
  return data;
};

export const getUser = async (id) => {
  const { data } = await axios.get(`users/${id}`);
  return data;
};

export const updateUserStatus = async (id, status) => {
  const { data } = await axios.patch(`users/${id}/status`, { is_active: status });
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await axios.delete(`users/${id}`);
  return data;
};