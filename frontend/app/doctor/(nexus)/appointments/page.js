'use client';
import { motion } from 'framer-motion';
import AppointmentList from '@/components/doctor/appointment/AppointmentList';
import Input from '@/components/ui/Input';
import { Search, Filter, Calendar as CalendIcon } from 'lucide-react';
import { useState } from 'react';
import { useAppointmentsDoctor } from '@/hooks/doctor/useAppointmentsDoctor';

export default function DoctorAppointments() {
  const [filter, setFilter] = useState('upcoming'); // upcoming, completed
  const [search, setSearch] = useState('');
  
  const { upcomingAppointments, completedAppointments, loading } = useAppointmentsDoctor();

  // Determine base list based on filter toggle
  const baseList = filter === 'upcoming' ? upcomingAppointments : completedAppointments;

  // Apply text search
  const filteredList = baseList.filter(app => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      app.patient_name?.toLowerCase().includes(term) ||
      app.reason?.toLowerCase().includes(term) ||
      app.id?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="py-2">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h2 className="text-sm font-black text-prism-rose uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-prism-rose shadow-[0_0_10px_rgba(244,63,94,1)] animate-pulse" />
             Registry Pipeline
          </h2>
          <h1 className="text-4xl font-display font-medium text-white tracking-tight">
            Appointment <span className="text-transparent bg-clip-text bg-gradient-to-r from-prism-rose to-white font-bold italic">Archive.</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-2xl border border-white/5">
           <button 
            onClick={() => setFilter('upcoming')}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === 'upcoming' ? 'bg-prism-rose text-white shadow-lg' : 'text-white/30 hover:text-white'}`}
           >
              Upcoming
           </button>
           <button 
            onClick={() => setFilter('completed')}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === 'completed' ? 'bg-prism-rose text-white shadow-lg' : 'text-white/30 hover:text-white'}`}
           >
              Completed
           </button>
        </div>
      </motion.div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
        <div className="w-full md:w-96">
           <Input 
            placeholder="Search identity or reason..." 
            icon={Search} 
            className="h-14 bg-white/5 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
           />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
           <button className="flex-1 md:flex-none h-14 px-6 rounded-2xl bg-white/5 border border-white/10 text-white/40 font-bold flex items-center justify-center gap-2 hover:text-white transition-all pointer-events-none">
             <Filter size={18} /> Showing {filteredList.length} limits
           </button>
        </div>
      </div>

      <AppointmentList appointments={filteredList} loading={loading} />
    </div>
  );
}
