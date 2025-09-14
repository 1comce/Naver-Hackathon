import { Book } from "lucide-react";
import Link from "next/link";
import Nav from "@/components/dashboard/nav";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen bg-gradient-subtle'>
      {/* Header */}
      <header className='bg-gradient-primary shadow-soft border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center space-x-4'>
              <div className='w-8 h-8 bg-accent rounded-lg flex items-center justify-center'>
                <Link href={"/dashboard"}>
                  <Book className='w-5 h-5 text-accent-foreground' />
                </Link>
              </div>
              <h1 className='text-xl font-bold'>
                TaskMaster - Quản lý thời gian sinh viên
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <Nav />
        {/* Main Content */}
        <main>{children}</main>
      </div>
    </div>
  );
}
