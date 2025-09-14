import { useState, useEffect } from "react";
import {
  Task,
  TaskCategory,
  TaskPriority,
  TASK_CATEGORIES,
  TASK_PRIORITIES,
} from "@/types/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  initialTask?: Task;
}

const TaskForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialTask,
}: TaskFormProps) => {
  const [formData, setFormData] = useState({
    title: initialTask?.title || "",
    description: initialTask?.description || "",
    category: initialTask?.category || ("study" as TaskCategory),
    priority: initialTask?.priority || ("medium" as TaskPriority),
    status: initialTask?.status || ("todo" as Task["status"]),
    dueDate: initialTask?.dueDate || undefined,
    estimatedTime: initialTask?.estimatedTime || 60,
  });
  useEffect(() => {
    if (initialTask) {
      setFormData({
        title: initialTask.title,
        description: initialTask.description || "",
        category: initialTask.category,
        priority: initialTask.priority,
        status: initialTask.status,
        dueDate: initialTask.dueDate,
        estimatedTime: initialTask.estimatedTime || 60,
      });
    } else {
      // reset to defaults if no task (e.g. Add new)
      setFormData({
        title: "",
        description: "",
        category: "study",
        priority: "medium",
        status: "todo",
        dueDate: undefined,
        estimatedTime: 60,
      });
    }
  }, [initialTask]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) return;

    onSubmit({
      ...formData,
      actualTime: initialTask?.actualTime,
      completedAt: initialTask?.completedAt,
    });

    // Reset form
    setFormData({
      title: "",
      description: "",
      category: "study",
      priority: "medium",
      status: "todo",
      dueDate: undefined,
      estimatedTime: 60,
    });

    onClose();
  };

  const handleClose = () => {
    onClose();
    // Reset to initial values when closing
    if (initialTask) {
      setFormData({
        title: initialTask.title,
        description: initialTask.description || "",
        category: initialTask.category,
        priority: initialTask.priority,
        status: initialTask.status,
        dueDate: initialTask.dueDate,
        estimatedTime: initialTask.estimatedTime || 60,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>
            {initialTask ? "Chỉnh sửa nhiệm vụ" : "Thêm nhiệm vụ mới"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='title'>Tiêu đề nhiệm vụ *</Label>
            <Input
              id='title'
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder='Nhập tiêu đề nhiệm vụ...'
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Mô tả</Label>
            <Textarea
              id='description'
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder='Mô tả chi tiết nhiệm vụ...'
              rows={3}
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='category'>Danh mục</Label>
              <Select
                value={formData.category}
                onValueChange={(value: TaskCategory) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='priority'>Mức độ ưu tiên</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: TaskPriority) =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_PRIORITIES.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label>Ngày hết hạn</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {formData.dueDate
                      ? format(formData.dueDate, "dd/MM/yyyy", { locale: vi })
                      : "Chọn ngày"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0'>
                  <Calendar
                    mode='single'
                    selected={formData.dueDate}
                    onSelect={(date) =>
                      setFormData({ ...formData, dueDate: date })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='estimatedTime'>Thời gian dự kiến (phút)</Label>
              <Input
                id='estimatedTime'
                type='number'
                min='15'
                max='480'
                value={formData.estimatedTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimatedTime: parseInt(e.target.value) || 60,
                  })
                }
              />
            </div>
          </div>

          <DialogFooter className='gap-2'>
            <Button type='button' variant='outline' onClick={handleClose}>
              Hủy
            </Button>
            <Button type='submit' className='bg-primary hover:bg-primary-light'>
              {initialTask ? "Cập nhật" : "Thêm nhiệm vụ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
