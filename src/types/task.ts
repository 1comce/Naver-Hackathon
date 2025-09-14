export type TaskCategory = "study" | "assignment" | "project" | "personal";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "todo" | "in-progress" | "completed";

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: Date;
  estimatedTime?: number; // in minutes
  actualTime?: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  avgCompletionTime: number;
  productivityScore: number;
}

export const TASK_CATEGORIES: {
  value: TaskCategory;
  label: string;
  color: string;
}[] = [
  { value: "study", label: "Học tập", color: "bg-primary" },
  { value: "assignment", label: "Bài tập", color: "bg-accent" },
  { value: "project", label: "Dự án", color: "bg-success" },
  { value: "personal", label: "Cá nhân", color: "bg-warning" },
];

export const TASK_PRIORITIES: {
  value: TaskPriority;
  label: string;
  color: string;
}[] = [
  { value: "low", label: "Thấp", color: "text-grey-500" },
  { value: "medium", label: "Trung bình", color: "text-yellow-500" },
  { value: "high", label: "Cao", color: "text-red-400" },
  { value: "urgent", label: "Khẩn cấp", color: "text-destructive" },
];
