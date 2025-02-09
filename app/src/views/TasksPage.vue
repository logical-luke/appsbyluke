<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-4xl font-bold transform -rotate-2">
        <span class="bg-yellow-300 px-4 py-2 inline-block neo-brutalism">Tasks</span>
      </h1>
      <button
        @click="openNewTaskModal"
        class="bg-blue-500 text-white px-4 py-2 font-bold neo-brutalism neo-brutalism-hover flex items-center"
      >
        <Icon icon="tabler:plus" class="mr-2 w-6 h-6" />
        New Task
      </button>
    </div>

    <div class="bg-white p-6 neo-brutalism">
      <div class="flex flex-wrap gap-4 mb-6">
        <button
          v-for="filter in statusFilters"
          :key="filter.value"
          @click="currentFilter = filter.value"
          class="px-4 py-2 neo-brutalism neo-brutalism-hover font-bold"
          :class="[
            currentFilter === filter.value
              ? 'bg-blue-200'
              : 'bg-gray-100 hover:bg-blue-100'
          ]"
        >
          <div class="flex items-center">
            <Icon :icon="filter.icon" class="mr-2 w-5 h-5" />
            {{ filter.label }}
          </div>
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b-4 border-black">
              <th class="text-left py-4 px-4">Task</th>
              <th class="text-left py-4 px-4">Type</th>
              <th class="text-left py-4 px-4">Status</th>
              <th class="text-left py-4 px-4">Created</th>
              <th class="text-left py-4 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in filteredTasks"
                :key="task.id"
                class="border-b-2 border-black hover:bg-blue-50">
              <td class="py-4 px-4">
                <div>
                  <div class="font-bold">{{ task.title }}</div>
                  <div class="text-sm text-gray-600">{{ task.description }}</div>
                </div>
              </td>
              <td class="py-4 px-4">
                <div v-if="task.project" class="inline-block bg-purple-100 px-3 py-1 neo-brutalism">
                  Project: {{ task.project }}
                </div>
                <div v-else class="inline-block bg-blue-100 px-3 py-1 neo-brutalism">
                  Standalone Task
                </div>
              </td>
              <td class="py-4 px-4">
                <div :class="[
                  getStatusConfig(task.status).bgColor,
                  'inline-flex items-center gap-2 px-3 py-1 neo-brutalism'
                ]">
                  <Icon :icon="getStatusConfig(task.status).icon" class="w-4 h-4" />
                  {{ formatStatus(task.status) }}
                </div>
              </td>
              <td class="py-4 px-4">
                {{ formatDate(task.createdAt) }}
              </td>
              <td class="py-4 px-4">
                <div class="flex gap-2">
                  <button
                    @click="viewTask(task)"
                    class="p-2 bg-blue-100 neo-brutalism neo-brutalism-hover"
                    title="View Details"
                  >
                    <Icon icon="tabler:eye" class="w-5 h-5" />
                  </button>
                  <button
                    @click="editTask(task)"
                    class="p-2 bg-yellow-100 neo-brutalism neo-brutalism-hover"
                    title="Edit Task"
                  >
                    <Icon icon="tabler:edit" class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import {TaskStatus, type Task} from "@/types/task";
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

const statusFilters = [
  { label: 'All Tasks', value: 'all', icon: 'tabler:list' },
  { label: 'Requested', value: TaskStatus.REQUESTED, icon: 'tabler:send' },
  { label: 'In Progress', value: TaskStatus.IN_PROGRESS, icon: 'tabler:player-play' },
  { label: 'Delivered', value: TaskStatus.DELIVERED, icon: 'tabler:package' },
  { label: 'Completed', value: TaskStatus.ACCEPTED, icon: 'tabler:check' }
];

const currentFilter = ref('all');

const tasks = ref<Task[]>([
  {
    id: 1,
    title: 'Implement User Authentication',
    description: 'Set up JWT-based authentication system with refresh tokens',
    project: 'E-commerce App',
    status: TaskStatus.IN_PROGRESS,
    createdAt: '2024-02-08T10:00:00Z'
  },
  {
    id: 2,
    title: 'Fix Navigation Bug',
    description: 'Mobile menu not closing on route change',
    project: null,
    status: TaskStatus.ACCEPTED,
    createdAt: '2024-02-07T15:30:00Z'
  },
  {
    id: 3,
    title: 'API Integration',
    description: 'Integrate payment processing API with error handling',
    project: 'E-commerce App',
    status: TaskStatus.REQUESTED,
    createdAt: '2024-02-09T09:15:00Z'
  },
  {
    id: 4,
    title: 'Update Dependencies',
    description: 'Update npm packages to latest versions',
    project: null,
    status: TaskStatus.REFINEMENT_REQUIRED,
    createdAt: '2024-02-09T11:45:00Z'
  }
]);

const filteredTasks = computed(() => {
  if (currentFilter.value === 'all') return tasks.value;
  return tasks.value.filter(task => task.status === currentFilter.value);
});

const getStatusConfig = (status: TaskStatus) => statusConfig[status];

const formatStatus = (status: TaskStatus) => {
  return statusConfig[status].label;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const openNewTaskModal = () => {
  taskModal.open();
};

const viewTask = (task: Task) => {
  console.log('Viewing task:', task);
};

const editTask = (task: Task) => {
  console.log('Editing task:', task);
};

onMounted(() => {
  document.title = 'Tasks | AppsByLuke';
});
</script>
