import axios from "axios";

const instance = axios.create({  
  baseURL: "http://192.168.21.35:5000/api/v1",
  withCredentials: true,
});

export default instance;
