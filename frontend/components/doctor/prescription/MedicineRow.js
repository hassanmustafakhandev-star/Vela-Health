'use client';
import { X, Search } from 'lucide-react';
import Input from '@/components/ui/Input';

export default function MedicineRow({ medicine, onUpdate, onRemove }) {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5 relative group hover:bg-white/[0.05] transition-all">
      <button 
        onClick={onRemove}
        className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-prism-rose/10 border border-prism-rose/20 text-prism-rose flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_rgba(244,63,94,0.3)]"
      >
        <X size={14} />
      </button>

      <div className="flex flex-col gap-2">
         <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Medicine Name</label>
         <div className="relative">
            <Input 
              placeholder="E.g. Panadol CF" 
              className="font-mono text-white h-12"
              value={medicine.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
            />
         </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1.5">
           <label className="text-[9px] font-black uppercase text-white/20 ml-2">Dosage</label>
           <Input 
            placeholder="500mg" 
            className="font-mono h-11 text-xs"
            value={medicine.dosage}
            onChange={(e) => onUpdate({ dosage: e.target.value })}
           />
        </div>
        <div className="flex flex-col gap-1.5">
           <label className="text-[9px] font-black uppercase text-white/20 ml-2">Freq</label>
           <select 
            className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-xs font-mono outline-none focus:border-prism-rose transition-all appearance-none"
            value={medicine.frequency}
            onChange={(e) => onUpdate({ frequency: e.target.value })}
           >
             <option value="1-0-1">1-0-1</option>
             <option value="1-1-1">1-1-1</option>
             <option value="0-0-1">0-0-1</option>
             <option value="1-0-0">1-0-0</option>
             <option value="SOS">SOS</option>
           </select>
        </div>
        <div className="flex flex-col gap-1.5">
           <label className="text-[9px] font-black uppercase text-white/20 ml-2">Duration</label>
           <Input 
            placeholder="5 Days" 
            className="font-mono h-11 text-xs" 
            value={medicine.duration}
            onChange={(e) => onUpdate({ duration: e.target.value })}
           />
        </div>
      </div>
      
      <div className="flex flex-col gap-1.5">
         <Input 
           placeholder="Additional instructions (e.g. Before food)" 
           className="h-10 text-[11px] bg-transparent border-white/5 italic"
           value={medicine.instructions}
           onChange={(e) => onUpdate({ instructions: e.target.value })}
         />
      </div>
    </div>
  );
}