'use client';
import { DoctorAuthProvider } from '@/context/DoctorAuthContext';
import DoctorAuthGuard from '@/components/doctor/layout/DoctorAuthGuard';
import DoctorSidebar from '@/components/doctor/layout/DoctorSidebar';
import DoctorNavbar from '@/components/doctor/layout/DoctorNavbar';
import DoctorBottomNav from '@/components/doctor/layout/DoctorBottomNav';

/**
 * Doctor Nexus Layout
 *
 * Architecture:
 *   DoctorAuthProvider  ← mounts the ONE Firestore listener (singleton)
 *     DoctorAuthGuard   ← reads store, gates access by status
 *       Sidebar + Navbar + page content
 *
 * This ensures every sub-component (Sidebar, pages) can safely
 * call useDoctorAuthContext() without spinning up duplicate listeners.
 */
export default function DoctorNexusLayout({ children }) {
  return (
    <DoctorAuthProvider>
      <DoctorAuthGuard>
        <div className="min-h-screen bg-prism-bg flex overflow-hidden">
          {/* Desktop Sidebar */}
          <DoctorSidebar />

          <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
            {/* Mobile / Tablet Top Navbar */}
            <DoctorNavbar />

            {/* Dynamic Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 pb-28 md:pb-10 bg-prism-surface/50">
              {children}
            </div>

            {/* Mobile Bottom Navigation */}
            <DoctorBottomNav />
          </main>
        </div>
      </DoctorAuthGuard>
    </DoctorAuthProvider>
  );
}