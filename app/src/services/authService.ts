import axios, { AxiosError } from 'axios';
import Cookies from 'universal-cookie';

const API_URL = import.meta.env.VITE_API_BASE_URL;
const cookies = new Cookies();

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
    const token = cookies.get('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface AuthServiceResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface UserData {
    id: number;
    email: string;
    fullName: string;
}

export const authService = {
    async login(email: string, password: string) {
        const response = await axiosInstance.post('/v1/auth/login', {email, password});
        if (response.data.access_token) {
            this.setToken(response.data.access_token);
        }
        return response.data;
    },

    async register(fullName: string, email: string, password: string): Promise<AuthServiceResponse<UserData>> {
        try {
            const response = await axiosInstance.post('/v1/auth/register', {fullName, email, password});
            return {success: true, data: response.data};
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                if (axiosError.response?.status === 409) {
                    return {
                        success: false,
                        error: 'This email is already registered. Please use a different email or try logging in.'
                    };
                }
            }
            return {
                success: false,
                error: 'Registration failed. Please try again later.'
            };
        }
    },

    logout() {
        cookies.remove('access_token', {
            path: '/',
            domain: window.location.hostname
        });
        delete axiosInstance.defaults.headers.common['Authorization'];
    },

    setToken(token: string) {
        cookies.set('access_token', token, {
            path: '/',
            domain: window.location.hostname,
            maxAge: 86400,
            secure: window.location.protocol === 'https:',
            sameSite: 'lax'
        });
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },

    getToken() {
        const token = cookies.get('access_token');
        return token || null;
    },

    async validateToken(token: string): Promise<boolean> {
        if (!token) return false;

        try {
            const response = await axiosInstance.post('/v1/auth/validate-token', null, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return !!response.data.isValid;
        } catch (error) {
            return false;
        }
    }
};
