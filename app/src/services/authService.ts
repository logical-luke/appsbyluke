import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

// Create an axios instance with default configurations
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const authService = {
  async login(email: string, password: string) {
    const response = await axiosInstance.post('/auth/login', { email, password });
    return response.data;
  },

  async register(fullName: string, email: string, password: string) {
    const response = await axiosInstance.post('/auth/register', { fullName, email, password });
    return response.data;
  },
};
