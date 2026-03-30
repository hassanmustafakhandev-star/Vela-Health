'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, Phone, Flame, Siren, ShieldAlert, 
  MapPin, Loader2, Navigation, HeartPulse, Send
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function EmergencyPulse() {
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [contacts, setContacts] = useState(null);

  useEffect(() => {
    // Attempt to lock high-precision GPS coordinate node
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => toast.error("Coordinate capture denied. Essential for rescue precision.")
      );
    }
    
    // Fetch emergency directory
    api.get('/emergency/contacts').then(res => setContacts(res.data.emergency_numbers));
  }, []);

  const triggerSOS = async () => {
    setLoading(true);
    try {
      const res = await api.post('/emergency/alert', {
        location: location || { lat: 0, lng: 0, address: "Manual Location Needed" },
        severity: "critical",
        symptoms: ["Manual SOS Trigger"]
      });
      setActive(true);
      toast.success("Identity broadcasted to nearby nodes!");
    } catch (err) {
      toast.error("Transmission interruption. Call 1122 manually.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 flex flex-col min-h-[80vh] items-center">
      
      <div className="text-center mb-12">
         <h2 className="text-[10px] font-black uppercase text-prism-rose tracking-[0.5em] mb-4 flex items-center justify-center gap-3">
            <div className="w-2 h-2 rounded-full bg-prism-rose animate-ping" />
            Vanguard Tactical Override
         </h2>
         <h1 className="text-4xl font-display font-bold text-white mb-2 tracking-tight">Emergency <span className="text-transparent bg-clip-text bg-gradient-to-r from-prism-rose to-white font-bold italic">Node.</span></h1>
         <p className="text-sm font-medium text-white/40">Immediate rescue synchronization and dispatch.</p>
      </div>

      <div className="w-full max-w-lg mb-12">
        <GlassCard glowColor="rose" className="p-8 text-center flex flex-col items-center">
           <div className="relative mb-8">
              <div className="absolute inset-0 bg-prism-rose/20 rounded-full blur-3xl animate-pulse" />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={triggerSOS}
                disabled={loading || active}
                className={`w-48 h-48 rounded-full border-8 flex flex-col items-center justify-center transition-all ${
                   active ? 'bg-prism-rose border-rose-300' : 'bg-black border-prism-rose/30 hover:border-prism-rose'
                }`}
              >
                {loading ? (
                   <Loader2 size={48} className="text-white animate-spin" />
                ) : active ? (
                   <Siren size={64} className="text-white animate-bounce" />
                ) : (
                   <ShieldAlert size={64} className="text-prism-rose" />
                )}
                <span className={`text-[10px] font-black uppercase mt-4 tracking-widest ${active ? 'text-white' : 'text-prism-rose'}`}>
                   {active ? 'Broadcast Active' : 'Trigger SOS'}
                </span>
              </motion.button>
           </div>
           
           <p className="text-xs font-bold text-white/50 leading-relaxed mb-6">
              Tapping this will broadcast your exact bio-coordinates and profile to the nearest active hospitals and rescue centers.
           </p>
           
           <div className="flex items-center gap-4 w-full">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-1">
                 <p className="text-[8px] font-black uppercase text-white/30 tracking-widest mb-1">Latitude</p>
                 <p className="text-sm font-mono font-bold text-white">{location?.lat?.toFixed(6) || '--'}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-1">
                 <p className="text-[8px] font-black uppercase text-white/30 tracking-widest mb-1">Longitude</p>
                 <p className="text-sm font-mono font-bold text-white">{location?.lng?.toFixed(6) || '--'}</p>
              </div>
           </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
         <h3 className="col-span-full text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Quick Access Directory</h3>
         
         {[
           { label: 'Rescue 1122', num: '1122', color: 'rose', sub: 'The primary rescue service' },
           { label: 'Edhi Foundation', num: '115', color: 'amber', sub: 'Ambulance & Mortuary' },
           { label: 'Police Force', num: '15', color: 'cyan', sub: 'Immediate Law Node' },
           { label: 'Fire Brigade', num: '16', color: 'orange', sub: 'Rescue & Retrieval' },
           { label: 'Aman Ambulance', num: '1020', color: 'emerald', sub: 'High-Care Transport' },
           { label: 'Anti Poison', num: '021-99215080', color: 'fuchsia', sub: 'Triage for Ingestion' },
         ].map((e, i) => (
           <motion.div key={i} whileHover={{ y: -5 }}>
             <GlassCard className="p-6 group cursor-pointer" onClick={() => window.open(`tel:${e.num}`)}>
                <div className="flex items-center gap-4 mb-4">
                   <div className={`w-10 h-10 rounded-xl bg-prism-${e.color}/10 border border-prism-${e.color}/20 flex items-center justify-center text-prism-${e.color}`}>
                      <Phone size={18} />
                   </div>
                   <div>
                      <h4 className="font-bold text-white text-md">{e.label}</h4>
                      <p className="text-[10px] text-white/30 font-medium">{e.sub}</p>
                   </div>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-2xl font-mono font-bold text-white tracking-widest">{e.num}</span>
                   <button className="h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/40 group-hover:bg-white group-hover:text-black transition-all">Dial Node</button>
                </div>
             </GlassCard>
           </motion.div>
         ))}
      </div>
    </div>
  );
}
