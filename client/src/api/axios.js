import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const instance = axios.create({  
  baseURL: "http://192.168.21.35:5000/api/v1",
  withCredentials: true,
});

export default instance;
