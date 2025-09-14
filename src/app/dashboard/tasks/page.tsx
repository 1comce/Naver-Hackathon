"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTasks } from "@/hooks/useTasks";
import { Task } from "@/types/task";
import { useState } from "react";
import { Search, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import TaskCard from "@/components/dashboard/TaskCard";
import TaskForm from "@/components/dashboard/TaskForm";
export default function Page() {
  const { tasks, updateTask, deleteTask, markCompleted, addTask } = useTasks();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || task.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" || task.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sort tasks by priority and due date
  const sortedTasks = filteredTasks.sort((a, b) => {
    // Completed tasks go to bottom
    if (a.status === "completed" && b.status !== "completed") return 1;
    if (b.status === "completed" && a.status !== "completed") return -1;

    // Sort by priority
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;

    // Sort by due date
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.getTime() - b.dueDate.getTime();
  });

  const handleStatusChange = (id: string, status: Task["status"]) => {
    updateTask(id, { status });
  };
  const handleAddTask = () => {
    setEditingTask(undefined);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleTaskSubmit = (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
  };
  return (
    <div className='space-y-6'>
      {/* Filters */}
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        onSubmit={handleTaskSubmit}
        initialTask={editingTask}
      />
      <Card>
        <CardHeader>
          <CardTitle>
            <div className='flex items-center justify-between'>
              Danh sách nhiệm vụ
              <Button
                onClick={handleAddTask}
                variant={"outline"}
                className='transition-all duration-300'
              >
                <Plus className='w-4 h-4 mr-2' />
                Thêm nhiệm vụ
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col sm:flex-row gap-4 mb-6'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
              <Input
                placeholder='Tìm kiếm nhiệm vụ...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-10'
              />
            </div>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className='w-full sm:w-48'>
                <SelectValue placeholder='Danh mục' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Tất cả danh mục</SelectItem>
                <SelectItem value='study'>Học tập</SelectItem>
                <SelectItem value='assignment'>Bài tập</SelectItem>
                <SelectItem value='project'>Dự án</SelectItem>
                <SelectItem value='personal'>Cá nhân</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className='w-full sm:w-48'>
                <SelectValue placeholder='Trạng thái' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Tất cả trạng thái</SelectItem>
                <SelectItem value='todo'>Chưa bắt đầu</SelectItem>
                <SelectItem value='in-progress'>Đang thực hiện</SelectItem>
                <SelectItem value='completed'>Đã hoàn thành</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Task List */}
          <div className='space-y-4'>
            {sortedTasks.length === 0 ? (
              <div className='text-center py-12'>
                <Clock className='w-12 h-12 text-muted-foreground mx-auto mb-4' />
                <h3 className='text-lg font-semibold text-muted-foreground mb-2'>
                  Không có nhiệm vụ nào
                </h3>
                <p className='text-muted-foreground'>
                  {searchQuery ||
                  filterCategory !== "all" ||
                  filterStatus !== "all"
                    ? "Thử thay đổi bộ lọc để xem nhiệm vụ khác"
                    : "Bắt đầu bằng cách thêm nhiệm vụ đầu tiên của bạn"}
                </p>
              </div>
            ) : (
              sortedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={() => {}}
                  onStatusChange={handleStatusChange}
                  onMarkCompleted={markCompleted}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
