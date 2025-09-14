"use client";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
export default function Page() {
  const { getStats } = useTasks();
  const stats = getStats();
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      <Card className='bg-gradient-to-r from-blue-500 to-blue-400'>
        <CardContent className='p-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm opacity-90'>Tổng nhiệm vụ</p>
              <p className='text-2xl font-bold'>{stats.totalTasks}</p>
            </div>
            <TrendingUp className='w-8 h-8 opacity-80' />
          </div>
        </CardContent>
      </Card>

      <Card className='bg-gradient-to-r from-green-600 to-green-300'>
        <CardContent className='p-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm opacity-90'>Đã hoàn thành</p>
              <p className='text-2xl font-bold'>{stats.completedTasks}</p>
            </div>
            <CheckCircle className='w-8 h-8 opacity-80' />
          </div>
        </CardContent>
      </Card>

      <Card className='bg-gradient-to-r from-yellow-500 to-yellow-300'>
        <CardContent className='p-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm'>Đang thực hiện</p>
              <p className='text-2xl font-bold text-warning'>
                {stats.inProgressTasks}
              </p>
            </div>
            <Clock className='w-8 h-8 text-warning' />
          </div>
        </CardContent>
      </Card>

      <Card className='border-destructive bg-destructive/5'>
        <CardContent className='p-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm'>Quá hạn</p>
              <p className='text-2xl font-bold text-destructive'>
                {stats.overdueTasks}
              </p>
            </div>
            <AlertTriangle className='w-8 h-8 text-destructive' />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
