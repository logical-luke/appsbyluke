<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-4xl font-bold transform -rotate-2">
        <span class="bg-yellow-300 px-4 py-2 inline-block neo-brutalism">Projects</span>
      </h1>
      <button
        @click="openNewProjectModal"
        class="bg-blue-500 text-white px-4 py-2 font-bold neo-brutalism neo-brutalism-hover flex items-center"
      >
        <Icon icon="tabler:plus" class="mr-2 w-6 h-6" />
        New Project
      </button>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-white p-6 neo-brutalism">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-blue-100 neo-brutalism flex items-center justify-center">
            <Icon icon="tabler:folder" class="w-6 h-6" />
          </div>
          <div>
            <h2 class="font-bold text-xl">Active Projects</h2>
            <p class="text-gray-600">Currently in development</p>
          </div>
        </div>
        <div class="text-3xl font-bold">{{ activeProjects }}</div>
      </div>

      <div class="bg-white p-6 neo-brutalism">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-green-100 neo-brutalism flex items-center justify-center">
            <Icon icon="tabler:check" class="w-6 h-6" />
          </div>
          <div>
            <h2 class="font-bold text-xl">Completed Projects</h2>
            <p class="text-gray-600">Successfully delivered</p>
          </div>
        </div>
        <div class="text-3xl font-bold">{{ completedProjects }}</div>
      </div>

      <div class="bg-white p-6 neo-brutalism">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-yellow-100 neo-brutalism flex items-center justify-center">
            <Icon icon="tabler:code" class="w-6 h-6" />
          </div>
          <div>
            <h2 class="font-bold text-xl">Active Tasks</h2>
            <p class="text-gray-600">Across all projects</p>
          </div>
        </div>
        <div class="text-3xl font-bold">{{ totalActiveTasks }}</div>
      </div>
    </div>

    <div class="bg-white p-6 neo-brutalism">
      <div class="flex flex-wrap gap-4 mb-6">
        <button
          v-for="filter in projectFilters"
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

      <div class="grid md:grid-cols-2 gap-6">
        <div v-for="project in filteredProjects"
             :key="project.id"
             class="bg-gray-50 p-6 neo-brutalism hover:bg-blue-50">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-xl font-bold">{{ project.name }}</h3>
              <p class="text-gray-600">{{ project.description }}</p>
            </div>
            <div :class="[
              getProjectStatusConfig(project.status).bgColor,
              'inline-flex items-center gap-2 px-3 py-1 neo-brutalism'
            ]">
              <Icon :icon="getProjectStatusConfig(project.status).icon" class="w-4 h-4" />
              {{ formatProjectStatus(project.status) }}
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <Icon icon="tabler:calendar" class="w-5 h-5 text-gray-600" />
              <span>Started: {{ formatDate(project.startDate) }}</span>
            </div>

            <div class="flex items-center gap-2">
              <Icon icon="tabler:list-check" class="w-5 h-5 text-gray-600" />
              <span>Tasks: {{ project.taskCount }} ({{ project.activeTaskCount }} active)</span>
            </div>

            <div class="flex items-center gap-2">
              <Icon icon="tabler:milestone" class="w-5 h-5 text-gray-600" />
              <span>Next Milestone: {{ project.nextMilestone }}</span>
            </div>

            <div class="flex gap-2 mt-4">
              <button
                @click="viewProject(project)"
                class="flex-1 p-2 bg-blue-100 neo-brutalism neo-brutalism-hover font-bold"
              >
                View Details
              </button>
              <button
                @click="editProject(project)"
                class="p-2 bg-yellow-100 neo-brutalism neo-brutalism-hover"
                title="Edit Project"
              >
                <Icon icon="tabler:edit" class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';

interface Project {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  taskCount: number;
  activeTaskCount: number;
  nextMilestone: string;
}

enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELED = 'canceled'
}

const projectStatusConfig = {
  [ProjectStatus.PLANNING]: {
    label: 'Planning',
    icon: 'tabler:notebook',
    bgColor: 'bg-purple-100'
  },
  [ProjectStatus.IN_PROGRESS]: {
    label: 'In Progress',
    icon: 'tabler:player-play',
    bgColor: 'bg-blue-100'
  },
  [ProjectStatus.ON_HOLD]: {
    label: 'On Hold',
    icon: 'tabler:player-pause',
    bgColor: 'bg-yellow-100'
  },
  [ProjectStatus.COMPLETED]: {
    label: 'Completed',
    icon: 'tabler:check',
    bgColor: 'bg-green-100'
  },
  [ProjectStatus.CANCELED]: {
    label: 'Canceled',
    icon: 'tabler:x',
    bgColor: 'bg-red-100'
  }
};

const projectFilters = [
  { label: 'All Projects', value: 'all', icon: 'tabler:folders' },
  { label: 'Planning', value: ProjectStatus.PLANNING, icon: 'tabler:notebook' },
  { label: 'In Progress', value: ProjectStatus.IN_PROGRESS, icon: 'tabler:player-play' },
  { label: 'Completed', value: ProjectStatus.COMPLETED, icon: 'tabler:check' }
];

const currentFilter = ref('all');

const projects = ref<Project[]>([
  {
    id: 1,
    name: 'E-commerce Platform',
    description: 'Full-featured online store with payment processing',
    status: ProjectStatus.IN_PROGRESS,
    startDate: '2024-01-15T10:00:00Z',
    taskCount: 12,
    activeTaskCount: 3,
    nextMilestone: 'Payment Integration'
  },
  {
    id: 2,
    name: 'Portfolio Website',
    description: 'Personal portfolio with blog functionality',
    status: ProjectStatus.COMPLETED,
    startDate: '2024-01-01T10:00:00Z',
    taskCount: 8,
    activeTaskCount: 0,
    nextMilestone: 'None'
  },
  {
    id: 3,
    name: 'Task Management App',
    description: 'Internal tool for project management',
    status: ProjectStatus.PLANNING,
    startDate: '2024-02-01T10:00:00Z',
    taskCount: 5,
    activeTaskCount: 2,
    nextMilestone: 'Design Approval'
  }
]);

const activeProjects = computed(() =>
  projects.value.filter(p => p.status === ProjectStatus.IN_PROGRESS).length
);

const completedProjects = computed(() =>
  projects.value.filter(p => p.status === ProjectStatus.COMPLETED).length
);

const totalActiveTasks = computed(() =>
  projects.value.reduce((sum, project) => sum + project.activeTaskCount, 0)
);

const filteredProjects = computed(() => {
  if (currentFilter.value === 'all') return projects.value;
  return projects.value.filter(project => project.status === currentFilter.value);
});

const getProjectStatusConfig = (status: ProjectStatus) => projectStatusConfig[status];

const formatProjectStatus = (status: ProjectStatus) => {
  return projectStatusConfig[status].label;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const openNewProjectModal = () => {
  console.log('Opening new project modal');
};

const viewProject = (project: Project) => {
  console.log('Viewing project:', project);
};

const editProject = (project: Project) => {
  console.log('Editing project:', project);
};

onMounted(() => {
  document.title = 'Projects | AppsByLuke';
});
</script>
