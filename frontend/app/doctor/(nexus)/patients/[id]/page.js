'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Activity, FileText, Heart, User, ChevronLeft, 
  Calendar, Thermometer, Droplets, AlertCircle, FilePlus
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function PatientEMRView() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/doctor/patients/${id}/history`);
        setData(res.data);
      } catch (err) {
        toast.error("Cloud Node Unreachable.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchHistory();
  }, [id]);

  if (loading) return <div className="py-20 text-center text-white/40 italic">Decrypting Bio-Archive...</div>;
  if (!data) return <div className="py-20 text-center text-rose-400">Identity not found in registry.</div>;

  const { profile, vitals, documents, prescriptions } = data;

  return (
    <div className="py-4 max-w-7xl mx-auto">
      {/* Header Profile */}
      <div className="flex flex-col md:flex-row gap-8 mb-12 items-center md:items-start">
        <div className="w-32 h-32 rounded-[40px] bg-prism-cyan/20 border border-prism-cyan/40 flex items-center justify-center text-prism-cyan text-4xl font-display font-medium shadow-[0_0_40px_rgba(6,182,212,0.2)]">
          {profile.name?.charAt(0)}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-display font-bold text-white mb-2">{profile.name}</h1>
          <div className="flex items-center justify-center md:justify-start gap-4 text-white/40 text-sm font-bold tracking-widest uppercase">
             <span>{profile.age} Years</span>
             <div className="w-1 h-1 rounded-full bg-white/20" />
             <span>{profile.gender}</span>
             <div className="w-1 h-1 rounded-full bg-white/20" />
             <Badge variant="emerald">{profile.blood_group || 'O+'}</Badge>
          </div>
          {profile.allergies?.length > 0 && (
            <div className="mt-4 flex items-center gap-2 justify-center md:justify-start">
               <AlertCircle size={14} className="text-prism-rose" />
               <span className="text-[10px] font-black uppercase text-prism-rose tracking-widest">Allergies: {profile.allergies.join(', ')}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Vitals Trajectory */}
        <div className="lg:col-span-8 space-y-8">
           <GlassCard className="p-8">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-prism-cyan mb-8 flex items-center gap-2">
                 <Activity size={16} /> Bio-Telemetry Sequence
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {vitals.length === 0 ? <p className="text-white/20 italic">No vitals discovered.</p> : vitals.slice(0, 4).map((v, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center">
                       <div>
                          <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-1">{v.type}</p>
                          <p className="text-xl font-mono font-bold text-white">{v.value} <span className="text-xs font-sans font-medium text-white/40 uppercase">{v.unit}</span></p>
                       </div>
                       <span className="text-[10px] font-medium text-white/20 tracking-tighter">{new Date(v.issued_at || v.timestamp).toLocaleDateString()}</span>
                    </div>
                 ))}
              </div>
           </GlassCard>

           <GlassCard className="p-8">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-prism-emerald mb-8 flex items-center gap-2">
                 <FileText size={16} /> Clinical Directives (Archive)
              </h3>
              <div className="space-y-4">
                 {prescriptions.length === 0 ? <p className="text-white/20 italic">No historical directives.</p> : prescriptions.map((p, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-all flex items-center justify-between group">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-prism-emerald/10 text-prism-emerald flex items-center justify-center border border-prism-emerald/20">
                             <FilePlus size={18} />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-white uppercase">{p.diagnosis}</p>
                             <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">{p.medications?.length} Compound Clause(s)</p>
                          </div>
                       </div>
                       <span className="text-[10px] font-bold text-white/40">{new Date(p.issued_at).toLocaleDateString()}</span>
                    </div>
                 ))}
              </div>
           </GlassCard>
        </div>

        {/* Right: Docs & Analysis */}
        <div className="lg:col-span-4 space-y-8">
           <GlassCard className="p-6">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 mb-6 flex items-center gap-2">
                 Documents & Scans
              </h3>
              <div className="flex flex-col gap-3">
                 {documents.length === 0 ? <p className="text-[10px] text-white/20 italic">No artifacts uploaded.</p> : documents.map((doc, i) => (
                    <button key={i} onClick={() => window.open(doc.url, '_blank')} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-prism-cyan transition-all flex items-center justify-between text-left group">
                       <div className="flex items-center gap-3">
                          <FileText size={16} className="text-white/20 group-hover:text-prism-cyan" />
                          <span className="text-xs font-bold text-white/60 truncate max-w-[120px]">{doc.filename}</span>
                       </div>
                       <ChevronLeft size={14} className="rotate-180 text-white/20" />
                    </button>
                 ))}
              </div>
           </GlassCard>
        </div>
      </div>
    </div>
  );
}
