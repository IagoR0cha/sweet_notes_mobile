import Axios from "axios";

import { getEnvVars } from "../../../environments";

const { apiUrl } = getEnvVars();
const API_URL = apiUrl;

const plainAxiosInstance = Axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  }
})

plainAxiosInstance.interceptors.response.use((res) => res, (error) => {
  console.warn(error);

  return error;
})

export default plainAxiosInstance;