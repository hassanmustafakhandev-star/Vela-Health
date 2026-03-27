'use client';
import { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Clock, Plus, Trash2, Save, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { useAvailability } from '@/hooks/doctor/useAvailability';
import { toast } from 'react-hot-toast';
import Toggle from '@/components/ui/Toggle';

export default function WeeklySchedule() {
  const { schedule, loading, saving, saveDay, DAYS } = useAvailability();
  
  // Local state for editing before saving
  const [localSchedule, setLocalSchedule] = useState({});

  // Sync local schedule when DB schedule loads/changes
  useEffect(() => {
    if (!loading) {
      setLocalSchedule(schedule);
    }
  }, [schedule, loading]);

  const updateSlot = (dayIdx, field, val) => {
    setLocalSchedule(prev => ({
      ...prev,
      [dayIdx]: {
        ...prev[dayIdx],
        [field]: val
      }
    }));
  };

  const toggleDay = (dayIdx, active) => {
    setLocalSchedule(prev => ({
      ...prev,
      [dayIdx]: {
        ...(prev[dayIdx] || { start_time: '09:00', end_time: '17:00' }),
        active
      }
    }));
  };

  const handleSaveAll = async () => {
    const tid = toast.loading('Syncing schedule matrix...');
    try {
      // Save each modified day sequentially
      for (let i = 0; i < 7; i++) {
        const local = localSchedule[i];
        const db = schedule[i];
        
        // Check if there are changes to avoid redundant API calls
        const isChanged = !db || 
                          local?.active !== db?.active || 
                          local?.start_time !== db?.start_time || 
                          local?.end_time !== db?.end_time;
                          
        if (local && isChanged) {
          await saveDay(i, local);
        }
      }
      toast.success('Schedule synchronized successfully.', { id: tid });
    } catch (err) {
      toast.error('Sync failed. Please try again.', { id: tid });
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center text-white/40">
         <Loader2 className="animate-spin text-prism-cyan" size={32} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4">
        {DAYS.map((dayName, idx) => {
          const dayData = localSchedule[idx] || { active: false, start_time: '09:00', end_time: '17:00' };
          const isActive = dayData.active;
          
          return (
            <GlassCard key={idx} className={`p-6 border-white/5 transition-all ${isActive ? 'bg-white/[0.03]' : 'opacity-60 bg-transparent'}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6 min-w-[120px]">
                   <span className="text-xl font-display font-bold text-white">{dayName}</span>
                   {!isActive && <Badge variant="rose" className="h-5 text-[8px]">Closed</Badge>}
                </div>

                <div className="flex-1 flex flex-col gap-3">
                  {isActive ? (
                     <div className="flex items-center gap-4 group">
                        <Input 
                          type="time" 
                          value={dayData.start_time || '09:00'} 
                          onChange={(e) => updateSlot(idx, 'start_time', e.target.value)}
                          className="h-10 text-xs font-mono bg-white/5"
                        />
                        <span className="text-white/20 text-xs uppercase font-black">to</span>
                        <Input 
                          type="time" 
                          value={dayData.end_time || '17:00'} 
                          onChange={(e) => updateSlot(idx, 'end_time', e.target.value)}
                          className="h-10 text-xs font-mono bg-white/5"
                        />
                     </div>
                  ) : (
                     <p className="text-xs text-white/20 italic">No operational windows defined.</p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                   <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">
                     {isActive ? 'Active' : 'Off'}
                   </span>
                   <Toggle 
                     checked={isActive} 
                     onChange={(e) => toggleDay(idx, e.target.checked)} 
                     size="sm"
                   />
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-[32px] bg-prism-cyan/5 border border-prism-cyan/20">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-prism-cyan/10 flex items-center justify-center text-prism-cyan shadow-[0_0_15px_rgba(6,182,212,0.2)]">
               <AlertCircle size={24} />
            </div>
            <div className="flex flex-col">
               <span className="text-sm font-bold text-white">Regional Timezone Sync</span>
               <span className="text-xs text-white/40">Current: GMT +5:00 (Karachi, Pakistan)</span>
            </div>
         </div>
         <Button 
           variant="cyan" 
           className="h-14 px-10 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
           onClick={handleSaveAll}
           loading={saving}
         >
            <Save size={18} className="mr-2" /> Commit Schedule
         </Button>
      </div>
    </div>
  );
}