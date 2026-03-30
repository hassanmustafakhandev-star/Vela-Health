'use client';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Clock, Video, Home, CheckCircle, XCircle, MoreVertical, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AppointmentCard({ appointment }) {
  const router = useRouter();

  const typeConfig = {
    video: { icon: Video, theme: 'rose', label: 'Video Call' },
    clinic: { icon: Home, theme: 'amber', label: 'Clinic Visit' },
  };

  const statusConfig = {
    confirmed: { icon: CheckCircle, theme: 'emerald', label: 'Confirmed' },
    waiting: { icon: Clock, theme: 'amber', label: 'Waiting' },
    completed: { icon: CheckCircle, theme: 'cyan', label: 'Done' },
    cancelled: { icon: XCircle, theme: 'rose', label: 'Cancelled' },
  };

  const type = typeConfig[appointment.type] || typeConfig.video;
  const status = statusConfig[appointment.status] || statusConfig.waiting;
  const isUrgent = appointment.urgency === 'high';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <GlassCard className={`p-4 border-l-4 ${isUrgent ? 'border-l-prism-rose bg-prism-rose/[0.02]' : 'border-l-white/10'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center justify-center min-w-[70px] py-1 border-r border-white/10 pr-4">
               <span className="text-xl font-display font-medium text-white tracking-tighter">
                 {new Date(appointment.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
               </span>
               <span className="text-[10px] font-black text-white/30 uppercase tracking-widest mt-1">
                 {appointment.duration}min
               </span>
            </div>
            
            <div className="flex items-center gap-3">
              <Avatar src={appointment.patient_photo} name={appointment.patient_name} size="md" radius="xl" />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-[15px]">{appointment.patient_name}</span>
                  <Badge variant="cyan" className="text-[10px] h-5">{appointment.patient_age}y</Badge>
                  {isUrgent && <Badge variant="rose" className="animate-pulse">Urgent</Badge>}
                </div>
                <p className="text-xs text-white/40 italic mt-0.5 truncate max-w-[200px]">
                  "{appointment.complaint}"
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6 ml-[86px] md:ml-0 flex-wrap">
            <div className="flex items-center gap-2 text-white/40">
              <type.icon size={14} className={`text-prism-${type.theme}`} />
              <span className="text-[11px] font-bold">{type.label}</span>
            </div>

            <Badge variant={status.theme} className="px-3 h-7 flex items-center gap-1.5 min-w-[100px] justify-center">
               <status.icon size={12} />
               <span className="text-[10px] uppercase font-black tracking-wider">{status.label}</span>
            </Badge>

            <div className="flex items-center gap-2">
               <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 px-4 text-xs font-bold"
                onClick={() => router.push(`/doctor/appointments/${appointment.id}`)}
               >
                 Brief
               </Button>
               {appointment.type === 'video' && appointment.status !== 'completed' && (
                 <Button 
                  variant="rose" 
                  size="sm" 
                  className="h-9 px-5 text-xs font-bold shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                  onClick={() => router.push(`/consultation/${appointment.id}`)}
                 >
                   Join Call
                 </Button>
               )}
               {appointment.status !== 'completed' && (
                 <Button 
                  variant="emerald" 
                  size="sm" 
                  className="h-9 px-4 text-xs font-bold"
                  onClick={() => router.push(`/doctor/prescriptions/new?patient_id=${appointment.patient_id}&appointment_id=${appointment.id}&patient_name=${encodeURIComponent(appointment.patient_name)}`)}
                 >
                   Prescribe
                 </Button>
               )}
               <button className="w-9 h-9 rounded-xl hover:bg-white/5 flex items-center justify-center text-white/20 hover:text-white transition-all">
                  <MoreVertical size={16} />
               </button>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}