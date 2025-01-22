import axios from 'axios';
import Cookies from 'universal-cookie';

const API_URL = import.meta.env.VITE_API_BASE_URL;
const cookies = new Cookies();

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const authService = {
  async login(email: string, password: string) {
    const response = await axiosInstance.post('/v1/auth/login', { email, password });
    if (response.data.access_token) {
      this.setToken(response.data.access_token);
    }
    return response.data;
  },

  async register(fullName: string, email: string, password: string) {
    const response = await axiosInstance.post('/v1/auth/register', { fullName, email, password });
    return response.data;
  },

  logout() {
    cookies.remove('access_token', { path: '/' });
    delete axiosInstance.defaults.headers.common['Authorization'];
  },

  setToken(token: string) {
    cookies.set('access_token', token, {
      path: '/',
      maxAge: 86400, // 1 day in seconds
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  getToken() {
    return cookies.get('access_token');
  },

  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await axiosInstance.post('/v1/auth/validate-token', { token });
      return response.data.isValid;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }
};
