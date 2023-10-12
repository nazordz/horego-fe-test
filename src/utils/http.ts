import { store } from "@/store";
import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_BASE_API
});

http.interceptors.request.use(function(config) {
  const tokenState = store.getState().authentication.token;
  if (tokenState && config.headers) {
    config.headers.Authorization = `Bearer ${tokenState}`
  }
  
  return config;
})

export default http;
