import { Task, TASK_CATEGORIES, TASK_PRIORITIES } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle,
  Play,
  Calendar as CalendarIcon,
  AlertCircle,
  Trash2,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isAfter, isBefore, addDays } from "date-fns";
import { vi } from "date-fns/locale";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task["status"]) => void;
  onMarkCompleted: (id: string) => void;
}

const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  onMarkCompleted,
}: TaskCardProps) => {
  const category = TASK_CATEGORIES.find((c) => c.value === task.category);
  const priority = TASK_PRIORITIES.find((p) => p.value === task.priority);

  const isOverdue =
    task.dueDate &&
    isBefore(task.dueDate, new Date()) &&
    task.status !== "completed";
  const isDueSoon =
    task.dueDate &&
    isAfter(task.dueDate, new Date()) &&
    isBefore(task.dueDate, addDays(new Date(), 1));

  const getStatusIcon = () => {
    switch (task.status) {
      case "completed":
        return <CheckCircle className='w-4 h-4 text-green-500' />;
      case "in-progress":
        return <Play className='w-4 h-4' />;
      default:
        return <Clock className='w-4 h-4' />;
    }
  };

  const getStatusColor = () => {
    switch (task.status) {
      case "completed":
        return "border-l-green-500";
      case "in-progress":
        return "border-l-yellow-500";
      default:
        return isOverdue ? "border-l-destructive" : "border-l-blue-500";
    }
  };

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-soft border-l-4",
        getStatusColor(),
        task.status === "completed" && "opacity-75"
      )}
    >
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <div className='flex items-center space-x-2 mb-2'>
              {getStatusIcon()}
              <h3
                className={cn(
                  "font-semibold",
                  task.status === "completed" && "line-through "
                )}
              >
                {task.title}
              </h3>
              {isOverdue && (
                <AlertCircle className='w-4 h-4 text-destructive' />
              )}
            </div>

            <div className='flex items-center space-x-2 mb-2'>
              {category && (
                <Badge variant='secondary' className={"text-xs"}>
                  {category.label}
                </Badge>
              )}
              {priority && (
                <Badge variant='outline' className={priority.color}>
                  {priority.label}
                </Badge>
              )}
            </div>
          </div>

          <Button onClick={() => onEdit(task)} variant='ghost' size='sm'>
            <Pencil className='w-4 h-4' />
          </Button>
        </div>
      </CardHeader>

      <CardContent className='pt-0'>
        {task.description && (
          <p className='text-sm  mb-3'>{task.description}</p>
        )}

        <div className='flex items-center justify-between text-xs  mb-3'>
          {task.dueDate && (
            <div className='flex items-center space-x-1'>
              <CalendarIcon className='w-3 h-3' />
              <span
                className={cn(
                  isOverdue && "text-destructive font-medium",
                  isDueSoon && "text-warning font-medium"
                )}
              >
                {format(task.dueDate, "dd/MM/yyyy", { locale: vi })}
              </span>
            </div>
          )}

          {task.estimatedTime && (
            <div className='flex items-center space-x-1'>
              <Clock className='w-3 h-3' />
              <span>{task.estimatedTime}p</span>
            </div>
          )}
        </div>

        <div className='flex items-center space-x-2'>
          {task.status !== "completed" && (
            <>
              <Button
                size='sm'
                variant='outline'
                onClick={() =>
                  onStatusChange(
                    task.id,
                    task.status === "in-progress" ? "todo" : "in-progress"
                  )
                }
                className='flex-1'
              >
                {task.status === "in-progress" ? "Tạm dừng" : "Bắt đầu"}
              </Button>
              <Button
                size='sm'
                variant='outline'
                onClick={() => onMarkCompleted(task.id)}
                className='flex-1 text-green-500'
              >
                Hoàn thành
              </Button>
              <Button
                size='sm'
                variant='outline'
                onClick={() => onDelete(task.id)}
                className='text-destructive hover:text-destructive hover:bg-destructive/10'
              >
                <Trash2 className='w-4 h-4' />
              </Button>
            </>
          )}

          {task.status === "completed" && (
            <div className='flex items-center space-x-2 text-sm text-green-500'>
              <CheckCircle className='w-4 h-4 text-green-500' />
              <span>Đã hoàn thành</span>
              {task.completedAt && (
                <span className=''>
                  {format(task.completedAt, "dd/MM HH:mm", { locale: vi })}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
