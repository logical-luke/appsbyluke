<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import LoadingPage from "@/views/LoadingPage.vue";
import AppSidebar from "@/components/AppSidebar.vue";
import NewTaskModal from "@/components/NewTaskModal.vue";
import { useTaskModalStore } from "@/stores/taskModal";

const route = useRoute();
const router = useRouter();
const isReady = ref(false);
const taskModal = useTaskModalStore();

router.isReady().then(() => {
  isReady.value = true;
});

const isAuthRoute = computed(() => {
  return ['/login', '/register', '/forgot-password'].includes(route.path);
});

const handleTaskSubmit = (taskData: { title: string; description: string; project: string | null }) => {
  console.log('New task:', taskData);
};
</script>

<template>
  <LoadingPage v-if="!isReady"/>
  <div v-else class="h-screen" :class="{ 'flex bg-gray-100': !isAuthRoute }">
    <template v-if="!isAuthRoute">
      <AppSidebar/>
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 lg:pt-0 pt-16">
        <div class="container mx-auto px-4 py-8">
          <RouterView/>
        </div>
      </main>
      <NewTaskModal
        :is-open="taskModal.isOpen"
        @close="taskModal.close"
        @submit="handleTaskSubmit"
      />
    </template>
    <template v-else>
      <RouterView/>
    </template>
  </div>
</template>

<style>
body {
  font-family: 'Rubik', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Bebas Neue', sans-serif;
}

.neo-brutalism {
  @apply border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)];
}

.neo-brutalism-hover {
  @apply transition-all duration-300 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)];
}
</style>
