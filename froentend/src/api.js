import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

const token = localStorage.getItem("auth_token");
// if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer 9|sh8bNcBt7T9jBSegNuIeMT2lUn5WCeNFUJNNXfJl9232dafc`;
// }

export default api;
