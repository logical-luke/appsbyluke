<template>
  <div class="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b-4 border-black p-4">
    <button @click="toggleSidebar" class="neo-brutalism neo-brutalism-hover p-2">
      <Icon icon="tabler:menu-2" class="w-6 h-6" />
    </button>
  </div>

  <aside class="fixed inset-y-0 left-0 z-40 w-64 bg-white border-r-4 border-black transform transition-transform duration-300 lg:relative lg:translate-x-0"
         :class="{
           '-translate-x-full': !isSidebarOpen,
           'top-16': !isDesktop,
           'top-0': isDesktop
         }">
    <nav class="mt-6">
      <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center px-4 py-3 text-lg font-bold hover:bg-blue-200 neo-brutalism neo-brutalism-hover m-2"
          :class="{
            'bg-blue-300': isActive(item.path),
            'bg-blue-50': !isActive(item.path)
          }"
      >
        <Icon :icon="item.icon" class="mr-3 w-6 h-6" />
        {{ item.name }}
      </router-link>
      <button
          @click="handleLogout"
          class="flex items-center w-[calc(100%-1rem)] mx-2 px-4 py-3 text-lg font-bold neo-brutalism neo-brutalism-hover bg-yellow-100 hover:bg-yellow-200"
      >
        <Icon icon="tabler:logout" class="mr-3 w-6 h-6" />
        Logout
      </button>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter, useRoute } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const isSidebarOpen = ref(false);
const isDesktop = ref(window.innerWidth >= 1024);

const navItems = [
  { name: 'Dashboard', path: '/', icon: 'tabler:dashboard' },
  { name: 'Tasks', path: '/tasks', icon: 'tabler:checklist' },
  { name: 'Projects', path: '/projects', icon: 'tabler:folder' },
  { name: 'Store', path: '/store', icon: 'tabler:building-store' },
  { name: 'Account', path: '/account', icon: 'tabler:user' },
];

const isActive = (path: string): boolean => {
  if (path === '/') {
    return route.path === '/' || route.path === '';
  }
  return route.path === path;
};

const handleLogout = () => {
  auth.logout();
  router.push('/login');
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const handleResize = () => {
  isDesktop.value = window.innerWidth >= 1024;
  if (isDesktop.value) {
    isSidebarOpen.value = true;
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>
