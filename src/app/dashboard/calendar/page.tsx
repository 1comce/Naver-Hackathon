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
} from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { Task } from "@/types/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  onEditTask: (task: Task) => void;
}
export default function Page({ onEditTask }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { tasks } = useTasks();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTasksForDate = (date: Date) => {
    return tasks.filter(
      (task) => task.dueDate && isSameDay(new Date(task.dueDate), date)
    );
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "urgent":
        return "bg-destructive";
      case "high":
        return "bg-accent";
      case "medium":
        return "bg-warning";
      case "low":
        return "bg-muted";
    }
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "bg-success";
      case "in-progress":
        return "bg-warning";
      case "todo":
        return "bg-primary";
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
                      onClick={() => onEditTask(task)}
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
                        <Clock className='w-2 h-2 mr-1 flex-shrink-0' />
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
            <div className='w-3 h-3 rounded bg-success'></div>
            <span>Hoàn thành</span>
          </div>
          <div className='flex items-center space-x-1'>
            <div className='w-3 h-3 rounded bg-warning'></div>
            <span>Đang thực hiện</span>
          </div>
          <div className='flex items-center space-x-1'>
            <div className='w-3 h-3 rounded bg-primary'></div>
            <span>Chưa bắt đầu</span>
          </div>
          <div className='flex items-center space-x-1'>
            <AlertCircle className='w-3 h-3 text-destructive' />
            <span>Quá hạn</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
