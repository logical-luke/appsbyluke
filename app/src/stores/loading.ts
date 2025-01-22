import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLoadingStore = defineStore('loading', () => {
  const isLoading = ref(true);

  const setLoading = (value: boolean) => {
    isLoading.value = value;
  };

  return {
    isLoading,
    setLoading
  };
});
