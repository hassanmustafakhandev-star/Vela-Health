import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/layout/BottomNav';
import Sidebar from '@/components/layout/Sidebar';

export default function AppLayout({ children }) {
  return (
    <div className="h-screen bg-prism-bg flex overflow-hidden selection:bg-prism-cyan selection:text-white">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 pb-32 md:pb-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
