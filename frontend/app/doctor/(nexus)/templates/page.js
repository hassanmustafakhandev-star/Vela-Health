'use client';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import { 
  ClipboardList, Search, Plus, FileText, 
  Clock, Share2, MoreVertical, Edit2, Trash2 
} from 'lucide-react';
import { useState } from 'react';

export default function ClinicalTemplates() {
  const [search, setSearch] = useState('');

  const templates = [
    { 
      id: 't1', 
      title: 'General Consultation', 
      description: 'Standard SOAP format for general physician visits.', 
      usage: 124, 
      category: 'General', 
      updated: '2 hours ago' 
    },
    { 
      id: 't2', 
      title: 'Pediatric Follow-up', 
      description: 'Growth tracking and vaccine review protocol.', 
      usage: 85, 
      category: 'Pediatrics', 
      updated: '1 day ago' 
    },
    { 
      id: 't3', 
      title: 'Cardiac Assessment', 
      description: 'Comprehensive vital monitoring and ECG interpretation.', 
      usage: 56, 
      category: 'Cardiology', 
      updated: '3 days ago' 
    },
    { 
      id: 't4', 
      title: 'Dermatology Initial', 
      description: 'Skin lesion documentation and history mapping.', 
      usage: 42, 
      category: 'Dermatology', 
      updated: '1 week ago' 
    }
  ];

  const filtered = templates.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-2">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h2 className="text-sm font-black text-prism-amber uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-prism-amber shadow-[0_0_10px_rgba(245,158,11,1)] animate-pulse" />
             Clinical Intelligence
          </h2>
          <h1 className="text-4xl font-display font-medium text-white tracking-tight">
            Nexus <span className="text-transparent bg-clip-text bg-gradient-to-r from-prism-amber to-white font-bold italic">Templates.</span>
          </h1>
        </div>

        <button className="h-14 px-6 rounded-2xl bg-prism-amber text-white font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-105 transition-all">
          <Plus size={18} /> New Protocol
        </button>
      </motion.div>

      <div className="mb-8 w-full md:w-96">
        <Input 
          placeholder="Search clinical protocols..." 
          icon={Search} 
          className="h-14 bg-white/5"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((template, idx) => (
          <motion.div 
            key={template.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <GlassCard className="p-6 h-full flex flex-col justify-between group hover:border-prism-amber/30 transition-all border-white/5 bg-white/[0.03]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-prism-amber/10 border border-prism-amber/20 flex items-center justify-center text-prism-amber">
                    <ClipboardList size={20} />
                  </div>
                  <Badge variant="amber" className="text-[9px]">{template.category}</Badge>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-prism-amber transition-colors">{template.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed line-clamp-2 mb-6">{template.description}</p>
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase text-white/20 tracking-widest">Usage</span>
                    <span className="text-sm font-mono font-bold text-white">{template.usage}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase text-white/20 tracking-widest">Speed</span>
                    <span className="text-sm font-mono font-bold text-prism-emerald">Fast</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                   <button className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-white transition-all">
                      <Edit2 size={14} />
                   </button>
                   <button className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-white transition-all">
                      <Share2 size={14} />
                   </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="p-20 text-center rounded-[40px] border-2 border-dashed border-white/5 bg-white/[0.02]">
           <p className="text-white/20 italic">No clinical matches discovered in the protocol library.</p>
        </div>
      )}
    </div>
  );
}
