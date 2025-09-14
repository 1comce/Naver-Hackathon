"use client";
import { useTasks } from "@/hooks/useTasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Target,
  Clock,
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { TASK_CATEGORIES, TASK_PRIORITIES } from "@/types/task";

export default function Page() {
  const { tasks, getStats } = useTasks();
  const stats = getStats();

  // Calculate category distribution
  const categoryStats = TASK_CATEGORIES.map((category) => ({
    ...category,
    count: tasks.filter((task) => task.category === category.value).length,
    completed: tasks.filter(
      (task) => task.category === category.value && task.status === "completed"
    ).length,
  }));

  // Calculate priority distribution
  const priorityStats = TASK_PRIORITIES.map((priority) => ({
    ...priority,
    count: tasks.filter((task) => task.priority === priority.value).length,
    completed: tasks.filter(
      (task) => task.priority === priority.value && task.status === "completed"
    ).length,
  }));

  // Calculate weekly productivity (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date;
  }).reverse();

  const weeklyStats = last7Days.map((date) => {
    const dayTasks = tasks.filter(
      (task) =>
        task.completedAt &&
        new Date(task.completedAt).toDateString() === date.toDateString()
    );
    return {
      date: date.toLocaleDateString("vi-VN", { weekday: "short" }),
      completed: dayTasks.length,
      totalTime: dayTasks.reduce(
        (sum, task) => sum + (task.actualTime || 0),
        0
      ),
    };
  });

  const maxCompleted = Math.max(...weeklyStats.map((day) => day.completed), 1);

  return (
    <div className='space-y-6'>
      {/* Overview Stats */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center space-x-2'>
              <Target className='w-5 h-5 text-primary' />
              <div>
                <p className='text-sm text-muted-foreground'>Tổng nhiệm vụ</p>
                <p className='text-2xl font-bold'>{stats.totalTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center space-x-2'>
              <CheckCircle className='w-5 h-5 text-success' />
              <div>
                <p className='text-sm text-muted-foreground'>Đã hoàn thành</p>
                <p className='text-2xl font-bold text-success'>
                  {stats.completedTasks}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center space-x-2'>
              <Clock className='w-5 h-5 text-warning' />
              <div>
                <p className='text-sm text-muted-foreground'>Đang thực hiện</p>
                <p className='text-2xl font-bold text-warning'>
                  {stats.inProgressTasks}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center space-x-2'>
              <AlertTriangle className='w-5 h-5 text-destructive' />
              <div>
                <p className='text-sm text-muted-foreground'>Quá hạn</p>
                <p className='text-2xl font-bold text-destructive'>
                  {stats.overdueTasks}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Productivity Score */}
        <Card>
          <CardHeader>
            <div className='flex items-center space-x-2'>
              <Zap className='w-5 h-5' />
              <CardTitle>Điểm năng suất</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-3xl font-bold'>
                  {stats.productivityScore}%
                </span>
                <Badge
                  variant={
                    stats.productivityScore >= 80
                      ? "default"
                      : stats.productivityScore >= 60
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {stats.productivityScore >= 80
                    ? "Xuất sắc"
                    : stats.productivityScore >= 60
                    ? "Tốt"
                    : "Cần cải thiện"}
                </Badge>
              </div>
              <Progress value={stats.productivityScore} className='h-2' />
              <p className='text-sm text-muted-foreground'>
                Dựa trên tỷ lệ hoàn thành và thời gian thực hiện
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Average Completion Time */}
        <Card>
          <CardHeader>
            <div className='flex items-center space-x-2'>
              <Clock className='w-5 h-5' />
              <CardTitle>Thời gian trung bình</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='text-3xl font-bold'>
                {Math.round(stats.avgCompletionTime)} phút
              </div>
              <p className='text-sm text-muted-foreground'>
                Thời gian trung bình để hoàn thành một nhiệm vụ
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity */}
      <Card>
        <CardHeader>
          <div className='flex items-center space-x-2'>
            <BarChart3 className='w-5 h-5' />
            <CardTitle>Hoạt động 7 ngày qua</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {weeklyStats.map((day, index) => (
              <div key={index} className='space-y-2'>
                <div className='flex items-center justify-between text-sm'>
                  <span className='font-medium'>{day.date}</span>
                  <span className='text-muted-foreground'>
                    {day.completed} nhiệm vụ • {Math.round(day.totalTime / 60)}{" "}
                    giờ
                  </span>
                </div>
                <Progress
                  value={(day.completed / maxCompleted) * 100}
                  className='h-2'
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Category Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Phân tích theo danh mục</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {categoryStats.map((category) => (
                <div key={category.value} className='space-y-2'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='font-medium'>{category.label}</span>
                    <span className='text-muted-foreground'>
                      {category.completed}/{category.count}
                    </span>
                  </div>
                  <Progress
                    value={
                      category.count > 0
                        ? (category.completed / category.count) * 100
                        : 0
                    }
                    className='h-2'
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Priority Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Phân tích theo mức độ ưu tiên</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {priorityStats.map((priority) => (
                <div key={priority.value} className='space-y-2'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='font-medium'>{priority.label}</span>
                    <span className='text-muted-foreground'>
                      {priority.completed}/{priority.count}
                    </span>
                  </div>
                  <Progress
                    value={
                      priority.count > 0
                        ? (priority.completed / priority.count) * 100
                        : 0
                    }
                    className='h-2'
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
