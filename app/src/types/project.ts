export interface Project {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  status: ProjectStatus;
  clientName?: string;
  type: ProjectType;
}

export enum ProjectStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

export enum ProjectType {
  SUBSCRIPTION = 'subscription',
  TASK_PACKAGE = 'task_package',
  MVP = 'mvp',
  SCALE_UP = 'scale_up',
  ENTERPRISE = 'enterprise'
}

export interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  activeTasks: number;
}

export interface ProjectWithStats extends Project {
  stats: ProjectStats;
}

export interface CreateProjectDTO {
  name: string;
  description?: string;
  clientName?: string;
  type: ProjectType;
}

export interface UpdateProjectDTO {
  name?: string;
  description?: string;
  clientName?: string;
  status?: ProjectStatus;
  type?: ProjectType;
}
