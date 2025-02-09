import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type {
  Project,
  ProjectWithStats,
  CreateProjectDTO,
  UpdateProjectDTO
} from '@/types/project';
import { ProjectStatus } from '@/types/project';

export const useProjectsStore = defineStore('projects', () => {
  // State
  const projects = ref<Project[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const selectedProject = ref<ProjectWithStats | null>(null);

  // Getters
  const activeProjects = computed(() =>
    projects.value.filter(p => p.status === ProjectStatus.ACTIVE)
  );

  const projectsByStatus = computed(() => {
    const grouped = {
      [ProjectStatus.ACTIVE]: [] as Project[],
      [ProjectStatus.PAUSED]: [] as Project[],
      [ProjectStatus.COMPLETED]: [] as Project[],
      [ProjectStatus.ARCHIVED]: [] as Project[]
    };

    projects.value.forEach(project => {
      grouped[project.status].push(project);
    });

    return grouped;
  });

  // Actions
  const fetchProjects = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');

      const data = await response.json();
      projects.value = data;
    } catch (err) {
      console.error('Error fetching projects:', err);
      error.value = 'Failed to load projects';
    } finally {
      loading.value = false;
    }
  };

  const fetchProjectDetails = async (projectId: number) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error('Failed to fetch project details');

      const data = await response.json();
      selectedProject.value = data;
    } catch (err) {
      console.error('Error fetching project details:', err);
      error.value = 'Failed to load project details';
    } finally {
      loading.value = false;
    }
  };

  const createProject = async (projectData: CreateProjectDTO) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) throw new Error('Failed to create project');

      const newProject = await response.json();
      projects.value.push(newProject);
      return newProject;
    } catch (err) {
      console.error('Error creating project:', err);
      error.value = 'Failed to create project';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateProject = async (projectId: number, updates: UpdateProjectDTO) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update project');

      const updatedProject = await response.json();
      const index = projects.value.findIndex(p => p.id === projectId);
      if (index !== -1) {
        projects.value[index] = updatedProject;
      }

      if (selectedProject.value?.id === projectId) {
        selectedProject.value = { ...selectedProject.value, ...updatedProject };
      }

      return updatedProject;
    } catch (err) {
      console.error('Error updating project:', err);
      error.value = 'Failed to update project';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteProject = async (projectId: number) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete project');

      projects.value = projects.value.filter(p => p.id !== projectId);
      if (selectedProject.value?.id === projectId) {
        selectedProject.value = null;
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      error.value = 'Failed to delete project';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateProjectStatus = async (projectId: number, status: ProjectStatus) => {
    return updateProject(projectId, { status });
  };

  // Reset store state
  const resetStore = () => {
    projects.value = [];
    selectedProject.value = null;
    loading.value = false;
    error.value = null;
  };

  return {
    // State
    projects,
    loading,
    error,
    selectedProject,

    // Getters
    activeProjects,
    projectsByStatus,

    // Actions
    fetchProjects,
    fetchProjectDetails,
    createProject,
    updateProject,
    deleteProject,
    updateProjectStatus,
    resetStore
  };
});
