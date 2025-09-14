import { Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Page() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex items-center justify-center'>
      <div className='text-center max-w-2xl mx-auto px-4'>
        <div className='flex items-center justify-center space-x-3 mb-8'>
          <div className='w-12 h-12 bg-primary rounded-lg flex items-center justify-center'>
            <Target className='w-7 h-7 text-primary-foreground' />
          </div>
          <span className='text-3xl font-bold text-foreground'>TaskMaster</span>
        </div>

        <h1 className='text-4xl md:text-5xl font-bold text-foreground mb-6'>
          Quản lý thời gian
          <span className='text-primary block mt-2'>
            hiệu quả cho sinh viên
          </span>
        </h1>

        <p className='text-xl text-muted-foreground mb-12'>
          Giải pháp số giúp sinh viên đại học Việt Nam quản lý thời gian tốt hơn
          và vượt qua những thách thức trong cuộc sống sinh viên.
        </p>

        <Link href='#'>
          <Button size='lg' className='text-lg px-12 py-6'>
            Vào ứng dụng
          </Button>
        </Link>
      </div>
    </div>
  );
}
