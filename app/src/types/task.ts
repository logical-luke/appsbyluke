export enum TaskStatus {
  REQUESTED = 'requested',
  APPROVED = 'approved',
  REFINEMENT_REQUIRED = 'refinement_required',
  IN_PROGRESS = 'in_progress',
  DELIVERED = 'delivered',
  ACCEPTED = 'accepted',
  CHANGES_REQUESTED = 'changes_requested',
  CANCELED = 'canceled'
}

export interface TaskFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

export interface TaskRepository {
  url: string;
  isPrivate: boolean;
  accessGranted: boolean;
}

export interface AccessRequirement {
  type: 'url' | 'ip' | 'credentials';
  value: string;
  description: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  projectId: number | null;
  status: TaskStatus;
  createdAt: string;
  repository?: TaskRepository;
  files?: TaskFile[];
  accessRequirements?: AccessRequirement[];
}