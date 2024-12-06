import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const instance = axios.create({  
  baseURL: `${apiBaseUrl}/api/v1`,
  withCredentials: true,
});

export default instance;
