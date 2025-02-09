import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useTaskModalStore = defineStore('taskModal', () => {
  const isOpen = ref(false);

  const open = () => {
    isOpen.value = true;
  };

  const close = () => {
    isOpen.value = false;
  };

  return {
    isOpen,
    open,
    close
  };
});
