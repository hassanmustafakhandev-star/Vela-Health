'use client';
import { motion } from 'framer-motion';
import PatientCard from '@/components/doctor/patient/PatientCard';
import GlassCard from '@/components/ui/GlassCard';
import Input from '@/components/ui/Input';
import { Search, Filter, Users, UserPlus } from 'lucide-react';
import { useState } from 'react';

export default function PatientRegistry() {
  const [search, setSearch] = useState('');
  
  // Simulated patient data
  const patients = [
    { id: 'p1', name: 'Hassan Mustafa', age: 24, gender: 'Male', photo_url: 'https://i.pravatar.cc/100?img=33' },
    { id: 'p2', name: 'Zoya Khan', age: 29, gender: 'Female', photo_url: 'https://i.pravatar.cc/100?img=32' },
    { id: 'p3', name: 'Ahmed Ali', age: 45, gender: 'Male', photo_url: 'https://i.pravatar.cc/100?img=12' },
    { id: 'p4', name: 'Sarah Ahmed', age: 31, gender: 'Female', photo_url: 'https://i.pravatar.cc/100?img=22' },
    { id: 'p5', name: 'Omar Malik', age: 38, gender: 'Male', photo_url: 'https://i.pravatar.cc/100?img=15' },
    { id: 'p6', name: 'Fatima Zahra', age: 27, gender: 'Female', photo_url: 'https://i.pravatar.cc/100?img=18' },
  ];

  const filtered = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="py-2">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h2 className="text-sm font-black text-prism-cyan uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-prism-cyan shadow-[0_0_10px_rgba(6,182,212,1)] animate-pulse" />
             Neural Patient Archive
          </h2>
          <h1 className="text-4xl font-display font-medium text-white tracking-tight">
            Vanguard <span className="text-transparent bg-clip-text bg-gradient-to-r from-prism-cyan to-white font-bold italic">Registry.</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
           <GlassCard className="px-6 py-3 border-white/5 bg-white/5 flex items-center gap-3">
              <span className="text-xs font-black uppercase tracking-widest text-white/40">Total</span>
              <span className="text-2xl font-mono font-bold text-white">{patients.length}</span>
           </GlassCard>
           <button className="h-14 px-6 rounded-2xl bg-prism-cyan text-white font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 transition-all">
              <UserPlus size={18} /> <span className="hidden sm:inline">Add Patient</span>
           </button>
        </div>
      </motion.div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
        <div className="w-full md:w-96">
           <Input 
            placeholder="Search identity by name or ID..." 
            icon={Search}
            className="h-14 bg-white/5 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
           />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
           <button className="flex-1 md:flex-none h-14 px-6 rounded-2xl bg-white/5 border border-white/10 text-white/40 font-bold flex items-center justify-center gap-2 hover:text-white transition-all">
             <Filter size={18} /> Type
           </button>
           <button className="flex-1 md:flex-none h-14 px-6 rounded-2xl bg-white/5 border border-white/10 text-white/40 font-bold flex items-center justify-center gap-2 hover:text-white transition-all">
             <Filter size={18} /> Recency
           </button>
        </div>
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filtered.map(p => (
           <PatientCard key={p.id} patient={p} />
        ))}
        {filtered.length === 0 && (
           <div className="col-span-full p-20 text-center rounded-[40px] border-2 border-dashed border-white/5 bg-white/[0.02]">
              <p className="text-white/20 italic">No biographical matches discovered in this sector.</p>
           </div>
        )}
      </motion.div>
    </div>
  );
}
