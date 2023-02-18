import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const ApiService = {
  async login(username: string, password: string) {
    const loginRq = await axios.post(`${API_URL}/token-auth/`, { username, password });
    localStorage.setItem("username", username);
    localStorage.setItem("token", loginRq.data.token);
    axios.defaults.headers.common["Authorization"] = `Token ${loginRq.data.token}`;
  },
  async get(endpoint: string) {
    const getRq = await axios.get(`${API_URL}/${endpoint}`);
    return getRq.data;
  },
  async patch(endpoint: string, data: any) {
    const patchRq = await axios.patch(`${API_URL}/${endpoint}`, data);
    return patchRq.data;
  },
};

if (localStorage.getItem("token")) {
  axios.defaults.headers.common["Authorization"] = `Token ${localStorage.getItem("token")}`;
}

export default ApiService;
