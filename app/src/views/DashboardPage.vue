<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-4xl font-bold transform -rotate-2">
        <span class="bg-yellow-300 px-4 py-2 inline-block neo-brutalism">Dashboard</span>
      </h1>
      <button
        @click="createNewTask"
        class="bg-blue-500 text-white px-4 py-2 font-bold neo-brutalism neo-brutalism-hover flex items-center"
      >
        <Icon icon="tabler:plus" class="mr-2 w-6 h-6" />
        New Task
      </button>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-white p-6 neo-brutalism">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-blue-100 neo-brutalism flex items-center justify-center">
            <Icon icon="tabler:code" class="w-6 h-6" />
          </div>
          <div>
            <h2 class="font-bold text-xl">Active Tasks</h2>
            <p class="text-gray-600">Currently in progress</p>
          </div>
        </div>
        <div class="text-3xl font-bold">{{ activeTasks }}</div>
      </div>

      <div class="bg-white p-6 neo-brutalism">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-green-100 neo-brutalism flex items-center justify-center">
            <Icon icon="tabler:check" class="w-6 h-6" />
          </div>
          <div>
            <h2 class="font-bold text-xl">Completed Tasks</h2>
            <p class="text-gray-600">This month</p>
          </div>
        </div>
        <div class="text-3xl font-bold">{{ completedTasks }}</div>
      </div>

      <div class="bg-white p-6 neo-brutalism">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-yellow-100 neo-brutalism flex items-center justify-center">
            <Icon icon="tabler:clock" class="w-6 h-6" />
          </div>
          <div>
            <h2 class="font-bold text-xl">Pending Tasks</h2>
            <p class="text-gray-600">Awaiting approval</p>
          </div>
        </div>
        <div class="text-3xl font-bold">{{ pendingTasks }}</div>
      </div>
    </div>

    <div class="bg-white p-6 neo-brutalism">
      <h2 class="text-2xl font-bold mb-4">Recent Tasks</h2>
      <div class="space-y-4">
        <div v-if="recentTasks.length === 0"
             class="p-8 neo-brutalism bg-gray-50 text-center">
          <Icon icon="tabler:clipboard-x" class="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p class="text-gray-600 font-bold">No tasks available</p>
          <p class="text-sm text-gray-500">Create your first task to get started</p>
        </div>
        <div v-else v-for="task in recentTasks"
             :key="task.id"
             class="p-4 neo-brutalism bg-blue-50 hover:bg-blue-100 cursor-pointer">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-bold">{{ task.title }}</h3>
              <p class="text-sm text-gray-600">{{ task.description }}</p>
            </div>
            <div :class="[
              getStatusConfig(task.status).bgColor,
              'inline-flex items-center gap-2 px-3 py-1 neo-brutalism'
            ]">
              <Icon :icon="getStatusConfig(task.status).icon" class="w-4 h-4" />
              {{ formatStatus(task.status) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import {TaskStatus} from "@/types/task";
import { useTaskModalStore } from '@/stores/taskModal';

const taskModal = useTaskModalStore();

const statusConfig = {
  [TaskStatus.REQUESTED]: {
    label: 'Requested',
    icon: 'tabler:send',
    bgColor: 'bg-blue-100'
  },
  [TaskStatus.APPROVED]: {
    label: 'Approved',
    icon: 'tabler:thumb-up',
    bgColor: 'bg-green-100'
  },
  [TaskStatus.REFINEMENT_REQUIRED]: {
    label: 'Needs Details',
    icon: 'tabler:edit',
    bgColor: 'bg-yellow-100'
  },
  [TaskStatus.IN_PROGRESS]: {
    label: 'In Progress',
    icon: 'tabler:player-play',
    bgColor: 'bg-blue-200'
  },
  [TaskStatus.DELIVERED]: {
    label: 'Delivered',
    icon: 'tabler:package',
    bgColor: 'bg-purple-100'
  },
  [TaskStatus.ACCEPTED]: {
    label: 'Accepted',
    icon: 'tabler:check',
    bgColor: 'bg-green-200'
  },
  [TaskStatus.CHANGES_REQUESTED]: {
    label: 'Changes Requested',
    icon: 'tabler:refresh',
    bgColor: 'bg-orange-100'
  },
  [TaskStatus.CANCELED]: {
    label: 'Canceled',
    icon: 'tabler:x',
    bgColor: 'bg-red-100'
  }
};

const activeTasks = ref(0);
const completedTasks = ref(0);
const pendingTasks = ref(0);

const recentTasks = ref([
  {
    id: 1,
    title: 'Add Contact Form',
    description: 'Implement contact form with email functionality',
    status: TaskStatus.IN_PROGRESS
  },
  {
    id: 2,
    title: 'User Authentication',
    description: 'Set up login and registration system',
    status: TaskStatus.ACCEPTED
  },
  {
    id: 3,
    title: 'API Integration',
    description: 'Connect to payment processing API',
    status: TaskStatus.REQUESTED
  }
]);

const getStatusConfig = (status: TaskStatus) => statusConfig[status];

const formatStatus = (status: TaskStatus) => {
  return statusConfig[status].label;
};

const createNewTask = () => {
  taskModal.open();
};

onMounted(() => {
  document.title = 'Dashboard | AppsByLuke';
  activeTasks.value = 2;
  completedTasks.value = 5;
  pendingTasks.value = 1;
});
</script>
