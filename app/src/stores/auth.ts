import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService, type AuthServiceResponse, type UserData } from '@/services/authService';

interface LoginResponse {
    user: UserData;
    access_token: string;
}

export const useAuthStore = defineStore('auth', () => {
    const user = ref<UserData | null>(null);
    const accessToken = ref<string>('');
    const isLoading = ref<boolean>(false);

    const isAuthenticated = computed(() => {
        const token = authService.getToken();
        return !!token;
    });

    const initializeAuth = async () => {
        const token = authService.getToken();
        if (!token) {
            accessToken.value = '';
            return false;
        }

        try {
            isLoading.value = true;
            const isValid = await authService.validateToken(token);
            if (isValid) {
                accessToken.value = token;
                authService.setToken(token);
                return true;
            }
        } catch (error) {
            accessToken.value = '';
            authService.logout();
        } finally {
            isLoading.value = false;
        }
        return false;
    };

    const login = async (email: string, password: string): Promise<AuthServiceResponse<UserData>> => {
        try {
            isLoading.value = true;
            const response = await authService.login(email, password) as LoginResponse;
            user.value = response.user;
            accessToken.value = response.access_token;
            return {
                success: true,
                data: response.user
            };
        } catch (error) {
            return {
                success: false,
                error: 'Login failed. Please check your credentials and try again.'
            };
        } finally {
            isLoading.value = false;
        }
    };

    const register = async (
        fullName: string,
        email: string,
        password: string
    ): Promise<AuthServiceResponse<UserData>> => {
        isLoading.value = true;
        try {
            return await authService.register(fullName, email, password);
        } finally {
            isLoading.value = false;
        }
    };

    const logout = () => {
        user.value = null;
        accessToken.value = '';
        authService.logout();
    };

    return {
        user,
        accessToken,
        isAuthenticated,
        isLoading,
        initializeAuth,
        login,
        logout,
        register
    };
});
