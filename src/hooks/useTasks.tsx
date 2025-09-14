import { useState, useEffect } from "react";
import { Task, TaskStats } from "@/types/task";

const STORAGE_KEY = "student-tasks";

// Mock data for demonstration
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Hoàn thành bài tập Toán học",
    description: "Giải các bài tập từ 1-15 trong sách giáo khoa",
    category: "assignment",
    priority: "high",
    status: "todo",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    estimatedTime: 120,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Ôn tập cho kỳ thi giữa kỳ",
    description: "Ôn tập môn Lập trình Web",
    category: "study",
    priority: "urgent",
    status: "in-progress",
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    estimatedTime: 180,
    actualTime: 90,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: "3",
    title: "Dự án nhóm - Thiết kế website",
    description: "Hoàn thành phần frontend của dự án",
    category: "project",
    priority: "medium",
    status: "todo",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    estimatedTime: 300,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: "4",
    title: 'Đọc sách "Clean Code"',
    description: "Đọc chương 1-3",
    category: "personal",
    priority: "low",
    status: "completed",
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    estimatedTime: 90,
    actualTime: 75,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Load tasks from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedTasks = JSON.parse(stored).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          completedAt: task.completedAt
            ? new Date(task.completedAt)
            : undefined,
        }));
        setTasks(parsedTasks);
      } else {
        // Initialize with mock data
        setTasks(mockTasks);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTasks));
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
      setTasks(mockTasks);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save tasks to localStorage
  const saveTasks = (newTasks: Task[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
      setTasks(newTasks);
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  };

  const addTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    saveTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
    );
    saveTasks(updatedTasks);
  };

  const deleteTask = (id: string) => {
    const filteredTasks = tasks.filter((task) => task.id !== id);
    saveTasks(filteredTasks);
  };

  const markCompleted = (id: string) => {
    updateTask(id, {
      status: "completed",
      completedAt: new Date(),
    });
  };

  const getStats = (): TaskStats => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "completed").length;
    const inProgressTasks = tasks.filter(
      (t) => t.status === "in-progress"
    ).length;
    const overdueTasks = tasks.filter(
      (t) => t.dueDate && t.dueDate < new Date() && t.status !== "completed"
    ).length;

    const completedTasksWithTime = tasks.filter(
      (t) => t.status === "completed" && t.actualTime
    );
    const avgCompletionTime =
      completedTasksWithTime.length > 0
        ? completedTasksWithTime.reduce(
            (sum, t) => sum + (t.actualTime || 0),
            0
          ) / completedTasksWithTime.length
        : 0;

    const productivityScore =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      overdueTasks,
      avgCompletionTime,
      productivityScore,
    };
  };

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    markCompleted,
    getStats,
  };
};
