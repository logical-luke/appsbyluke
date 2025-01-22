import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService } from '@/services/authService';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const accessToken = ref('');

  const isAuthenticated = computed(() => !!accessToken.value);

  const initializeAuth = async () => {
    const token = authService.getToken();
    if (token) {
      try {
        const isValid = await authService.validateToken(token);
        if (isValid) {
          accessToken.value = token;
          authService.setToken(token);
          // Optionally fetch user data here
        } else {
          authService.logout();
        }
      } catch (error) {
        console.error('Error validating token:', error);
        authService.logout();
      }
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    user.value = response.user;
    accessToken.value = response.access_token;
  };

  const register = async (fullName: string, email: string, password: string) => {
    return await authService.register(fullName, email, password);
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
    initializeAuth,
    login,
    logout,
    register
  };
});
