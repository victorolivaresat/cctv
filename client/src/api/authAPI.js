import axios from "./axios";


export const login = async (email, password) => {
  const { data } = await axios.post('auth/login', { email, password });
  return data;
};

export const logout = async () => {
  const { data } = await axios.post('auth/logout');
  return data;
};

export const verifyToken = async () => {
  const { data } = await axios.get('auth/verify-token');
  return data;
}
