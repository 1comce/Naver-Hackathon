"use client";
import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
} from "date-fns";
import { vi } from "date-fns/locale";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle,
  Play,
} from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { Task } from "@/types/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import TaskForm from "@/components/dashboard/TaskForm";
export default function Page() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { tasks, updateTask, addTask } = useTasks();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
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
  const getTasksForDate = (date: Date) => {
    return tasks.filter(
      (task) => task.dueDate && isSameDay(new Date(task.dueDate), date)
    );
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500";
      case "high":
        return "bg-red-300";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-grey-500";
    }
  };
  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className='w-2 h-2 mr-1 flex-shrink-0' />;
      case "in-progress":
        return <Play className='w-2 h-2 mr-1 flex-shrink-0' />;
      default:
        return <Clock className='w-2 h-2 mr-1 flex-shrink-0' />;
    }
  };
  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-yellow-500";
      case "todo":
        return "bg-blue-500";
    }
  };

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  return (
    <>
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        onSubmit={handleTaskSubmit}
        initialTask={editingTask}
      />
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <Calendar className='w-5 h-5' />
              <CardTitle>Lịch nhiệm vụ</CardTitle>
            </div>
            <div className='flex items-center space-x-2'>
              <Button variant='outline' size='sm' onClick={previousMonth}>
                <ChevronLeft className='w-4 h-4' />
              </Button>
              <h2 className='text-lg font-semibold min-w-[200px] text-center'>
                {format(currentDate, "MMMM yyyy", { locale: vi })}
              </h2>
              <Button variant='outline' size='sm' onClick={nextMonth}>
                <ChevronRight className='w-4 h-4' />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className='grid grid-cols-7 gap-2 mb-4'>
            {/* Week days header */}
            {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
              <div
                key={day}
                className='p-2 text-center text-sm font-medium text-muted-foreground'
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {days.map((day) => {
              const dayTasks = getTasksForDate(day);
              const hasOverdue = dayTasks.some(
                (task) =>
                  task.status !== "completed" &&
                  task.dueDate &&
                  new Date(task.dueDate) < new Date()
              );

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "min-h-[80px] p-2 border rounded-lg transition-colors hover:bg-muted/50",
                    isToday(day)
                      ? "bg-primary/10 border-primary"
                      : "border-border",
                    hasOverdue ? "border-destructive/50" : ""
                  )}
                >
                  <div className='flex items-center justify-between mb-1'>
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isToday(day) ? "text-primary" : "text-foreground"
                      )}
                    >
                      {format(day, "d")}
                    </span>
                    {hasOverdue && (
                      <AlertCircle className='w-3 h-3 text-destructive' />
                    )}
                  </div>

                  <div className='space-y-1'>
                    {dayTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        onClick={() => handleEditTask(task)}
                        className='cursor-pointer'
                      >
                        <Badge
                          variant='secondary'
                          className={cn(
                            "text-xs px-1 py-0 h-5 w-full justify-start truncate",
                            getStatusColor(task.status),
                            "text-white"
                          )}
                        >
                          {getStatusIcon(task.status)}
                          {task.title}
                        </Badge>
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <div className='text-xs text-muted-foreground text-center'>
                        +{dayTasks.length - 3} khác
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className='flex flex-wrap gap-4 text-xs'>
            <div className='flex items-center space-x-1'>
              <div className='w-3 h-3 rounded bg-green-500'></div>
              <span>Hoàn thành</span>
            </div>
            <div className='flex items-center space-x-1'>
              <div className='w-3 h-3 rounded bg-yellow-500'></div>
              <span>Đang thực hiện</span>
            </div>
            <div className='flex items-center space-x-1'>
              <div className='w-3 h-3 rounded bg-blue-500'></div>
              <span>Chưa bắt đầu</span>
            </div>
            <div className='flex items-center space-x-1'>
              <AlertCircle className='w-3 h-3 text-destructive' />
              <span>Quá hạn</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
