<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import AppSidebar from "@/components/AppSidebar.vue";

const route = useRoute();

const isAuthRoute = computed(() => {
  return ['/login', '/register', '/forgot-password'].includes(route.path);
});
</script>

<template>
  <div class="h-screen" :class="{ 'flex bg-gray-100': !isAuthRoute }">
    <template v-if="!isAuthRoute">
      <AppSidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <AppHeader />
        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div class="container mx-auto px-6 py-8">
            <RouterView />
          </div>
        </main>
      </div>
    </template>
    <template v-else>
      <RouterView />
    </template>
  </div>
</template>
