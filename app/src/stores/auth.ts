import {defineStore} from 'pinia';
import {ref} from 'vue';
import {authService} from '@/services/authService';

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null);
    const token = ref(localStorage.getItem('token') || null);

    const login = async (email: string, password: string) => {
        const response = await authService.login(email, password);
        user.value = response.user;
        token.value = response.token;
        localStorage.setItem('token', response.token);
    };

    const register = async (fullName: string, email: string, password: string) => {
        const response = await authService.register(fullName, email, password);
        user.value = response.user;
        token.value = response.token;
        localStorage.setItem('token', response.token);
    };

    const logout = () => {
        user.value = null;
        token.value = null;
        localStorage.removeItem('token');
    };

    const isAuthenticated = () => !!token.value;

    return {user, token, login, logout, isAuthenticated, register};
});
