import Axios from 'axios'

const API_URL = "http://localhost:3000/api/";

export default Axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': localStorage.accessId
  }
});
