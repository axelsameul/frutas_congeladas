import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-frutas.onrender.com/api"
});

export default api;