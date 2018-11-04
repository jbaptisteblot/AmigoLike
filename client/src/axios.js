import Axios from 'axios'
import router from './router'

const API_URL = "http://localhost:3000/api/";
let axiosInstance = Axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(config => {
  config.headers.authorization = localStorage.getItem("accessId");
  return config;
});
axiosInstance.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response.status === 401)
    router.push("/login");
  return Promise.reject(error);
});

export default axiosInstance;
