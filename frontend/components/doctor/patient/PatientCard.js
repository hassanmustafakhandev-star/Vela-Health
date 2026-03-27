'use client';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { 
  FileText, Calendar, MessageSquare, 
  ExternalLink, MoreVertical, Activity,
  Brain, Heart
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PatientCard({ patient }) {
  const router = useRouter();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard 
        glowColor="cyan"
        className="p-6 h-full flex flex-col justify-between group relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-prism-cyan/5 blur-2xl group-hover:bg-prism-cyan/10 transition-colors" />
        
        <div>
          <div className="flex items-center justify-between mb-6">
            <Avatar src={patient.photo_url} name={patient.name} size="md" radius="xl" />
            <button className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/20 hover:text-white transition-all">
              <MoreVertical size={14} />
            </button>
          </div>

          <h3 className="text-lg font-bold text-white mb-2">{patient.name}</h3>
          <div className="flex items-center gap-2 mb-6">
            <Badge variant="cyan" className="text-[9px] uppercase font-black">{patient.age} Yrs</Badge>
            <Badge variant="cyan" className="bg-white/5 border-white/10 text-[9px] uppercase font-black">{patient.gender}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
             <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[8px] font-black uppercase text-white/20 mb-1">Last Interaction</p>
                <p className="text-xs font-bold text-white">12 Oct 2025</p>
             </div>
             <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[8px] font-black uppercase text-white/20 mb-1">Encounters</p>
                <p className="text-xs font-bold text-white">08 Sessions</p>
             </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
           <button 
            onClick={() => router.push(`/doctor/patients/${patient.id}`)}
            className="w-full h-11 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs font-bold flex items-center justify-center gap-2 hover:bg-prism-cyan hover:text-white hover:border-prism-cyan transition-all"
           >
             View Records <ExternalLink size={14} />
           </button>
        </div>
      </GlassCard>
    </motion.div>
  );
}