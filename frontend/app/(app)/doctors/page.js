'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Video, MapPin, Stethoscope, ChevronRight, X, Calendar, Clock, CheckCircle } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';

const doctors = [
  { id: 1, name: 'Dr. Sarah Chen', spec: 'Cardiology', exp: '14 Years', rating: 4.9, img: 'https://i.pravatar.cc/150?img=44' },
  { id: 2, name: 'Dr. Ahmed Raza', spec: 'Neurology', exp: '18 Years', rating: 5.0, img: 'https://i.pravatar.cc/150?img=11' },
  { id: 3, name: 'Dr. Emily Watson', spec: 'Pediatrics', exp: '9 Years', rating: 4.8, img: 'https://i.pravatar.cc/150?img=9' },
  { id: 4, name: 'Dr. John Davies', spec: 'Orthopedics', exp: '22 Years', rating: 4.9, img: 'https://i.pravatar.cc/150?img=60' }
];

export default function DoctorsPage() {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [bookingStep, setBookingStep] = useState(1); // 1: Select slot, 2: Success

  const handleBook = () => {
    setBookingStep(2);
    setTimeout(() => {
      setSelectedDoc(null);
      setBookingStep(1);
    }, 2500);
  };

  return (
    <div className="py-8">
      {/* Header logic remains same */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative z-10">
        <div>
          <h2 className="text-xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-prism-rose/20 border border-prism-rose/40 flex items-center justify-center text-prism-rose shadow-[0_0_15px_rgba(244,63,94,0.3)]">
              <Stethoscope size={20} />
            </div>
            Vanguard Directory
          </h2>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
          <input 
            type="text" 
            placeholder="Search specialties, doctors..." 
            className="w-full h-[52px] bg-white/5 border border-white/10 rounded-full pl-12 pr-6 text-sm font-medium text-white placeholder:text-white/20 focus:border-prism-rose focus:bg-white/10 outline-none transition-all shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {doctors.map((doc, idx) => (
          <motion.div 
            key={doc.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
          >
            <GlassCard glowColor="rose" className="p-6 flex flex-col items-center text-center group">
              {/* Profile section logic remains same */}
              <div className="relative mb-5">
                 <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-prism-rose/30 p-1 group-hover:border-prism-rose transition-colors duration-500 shadow-[0_0_20px_rgba(244,63,94,0.1)] group-hover:shadow-[0_0_30px_rgba(244,63,94,0.4)]">
                    <img src={doc.img} alt={doc.name} className="w-full h-full object-cover rounded-full filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                 </div>
                 <div className="absolute -bottom-2 right-0 bg-prism-bg border border-white/10 text-[10px] font-black tracking-widest uppercase flex items-center gap-1 px-2 py-1 rounded-full text-prism-rose shadow-lg">
                    <Star size={10} className="fill-current" /> {doc.rating}
                 </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-prism-rose transition-colors">{doc.name}</h3>
              <p className="text-sm font-black uppercase tracking-widest text-white/40 mb-3">{doc.spec}</p>
              
              <div className="flex items-center gap-4 text-xs font-medium text-white/50 mb-8 border border-white/5 bg-white/5 px-3 py-1.5 rounded-full">
                <span className="flex items-center gap-1.5"><Video size={12} className="text-prism-rose" /> UHD Sync</span>
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <span className="flex items-center gap-1.5"><Stethoscope size={12} className="text-prism-cyan" /> {doc.exp}</span>
              </div>

              <Button 
                variant="rose" 
                className="w-full text-xs h-12 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                onClick={() => setSelectedDoc(doc)}
              >
                Book Session <ChevronRight size={14} className="ml-1" />
              </Button>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedDoc(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-prism-surface border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-prism-rose/50 to-transparent" />
              
              <button 
                onClick={() => setSelectedDoc(null)} 
                className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              {bookingStep === 1 ? (
                <>
                  <h3 className="text-3xl font-display font-medium text-white mb-8">Secure Session</h3>
                  <div className="flex items-center gap-6 mb-10 p-5 bg-white/5 rounded-3xl border border-white/5">
                    <img src={selectedDoc.img} className="w-20 h-20 rounded-2xl object-cover" />
                    <div>
                      <p className="font-bold text-white text-lg">{selectedDoc.name}</p>
                      <p className="text-sm font-black uppercase tracking-widest text-prism-rose">{selectedDoc.spec}</p>
                    </div>
                  </div>

                  <div className="space-y-6 mb-10">
                    <div className="flex items-center gap-4 text-white/60">
                      <Calendar size={18} className="text-prism-rose" />
                      <span className="text-sm font-bold">Tomorrow, Oct 24, 2024</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/60">
                      <Clock size={18} className="text-prism-rose" />
                      <span className="text-sm font-bold">09:00 AM - 09:30 AM (GMT+5)</span>
                    </div>
                  </div>

                  <Button variant="rose" className="w-full h-16 shadow-[0_0_30px_rgba(244,63,94,0.3)]" onClick={handleBook}>
                    Confirm Reservation
                  </Button>
                </>
              ) : (
                <div className="py-10 text-center flex flex-col items-center">
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}
                    className="w-24 h-24 rounded-full bg-prism-emerald/10 border border-prism-emerald/30 flex items-center justify-center text-prism-emerald mb-8"
                  >
                    <CheckCircle size={48} />
                  </motion.div>
                  <h3 className="text-3xl font-display font-medium text-white mb-4">Confirmed!</h3>
                  <p className="text-white/40 font-medium mb-2">Your session linked with 0x4F...7E protocols.</p>
                  <p className="text-prism-emerald font-black uppercase tracking-widest text-xs">Awaiting Doctor Sync</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
