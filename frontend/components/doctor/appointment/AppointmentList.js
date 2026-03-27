'use client';
import { motion } from 'framer-motion';
import AppointmentCard from './AppointmentCard';
import Skeleton from '@/components/ui/Skeleton';

export default function AppointmentList({ appointments, loading }) {
  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-24 w-full rounded-3xl" />
        ))}
      </div>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <div className="p-12 text-center border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.02]">
        <p className="text-white/20 font-medium italic">No synchronizations discovered in this quadrant.</p>
      </div>
    );
  }

  // Group by date
  const grouped = appointments.reduce((acc, app) => {
    const date = new Date(app.time).toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(app);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-10 pb-10">
      {Object.entries(grouped).map(([date, items]) => (
        <div key={date} className="flex flex-col gap-4">
          <div className="flex items-center gap-4 px-2">
             <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 whitespace-nowrap">{date}</span>
             <div className="h-[1px] w-full bg-white/5" />
          </div>
          <div className="flex flex-col gap-3">
            {items.map((app) => (
              <AppointmentCard key={app.id} appointment={app} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}