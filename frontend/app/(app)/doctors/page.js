'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Video, MapPin, Stethoscope, ChevronRight, X, Calendar as CalendarIcon, Clock, CheckCircle, ChevronLeft, ChevronRight as ArrowRightIcon } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

// Utility to get next 7 days formatted for API and Display
const getNextDays = () => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const isoDate = d.toISOString().split('T')[0];
    const displayShort = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const dayLabel = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : displayShort;
    days.push({ id: isoDate, date: isoDate, label: dayLabel });
  }
  return days;
};

export default function DoctorsPage() {
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Booking Modal State
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [bookingStep, setBookingStep] = useState(1); // 1: Date & Time, 2: Success
  const [availableDates] = useState(getNextDays());
  const [selectedDate, setSelectedDate] = useState(availableDates[0].date);
  const [slotsData, setSlotsData] = useState({ slots: [], loading: false, message: '' });
  const [selectedTime, setSelectedTime] = useState(null);
  const [isBooking, setIsBooking] = useState(false);

  // Fetch verified doctors on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        // Assuming backend supports /doctors endpoint which returns { doctors: [] }
        const res = await api.get('/doctors/?limit=100');
        setDoctorsList(res.data.doctors || []);
      } catch (err) {
        console.error('Failed to load doctors:', err);
        toast.error('Failed to sync vanguard directory');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Fetch slots whenever selected doc or date changes
  useEffect(() => {
    if (!selectedDoc || !selectedDate) return;
    const fetchSlots = async () => {
      setSlotsData({ slots: [], loading: true, message: '' });
      setSelectedTime(null);
      try {
        const res = await api.get(`/doctors/${selectedDoc.id}/slots?date=${selectedDate}`);
        if (res.data.slots && res.data.slots.length > 0) {
          setSlotsData({ slots: res.data.slots, loading: false, message: '' });
        } else {
          setSlotsData({ slots: [], loading: false, message: res.data.message || 'No slots available' });
        }
      } catch (err) {
        console.error('Failed to fetch slots:', err);
        setSlotsData({ slots: [], loading: false, message: 'Could not fetch securely' });
      }
    };
    fetchSlots();
  }, [selectedDoc, selectedDate]);

  const filteredDoctors = doctorsList.filter(d => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const specStr = (d.specialties || []).join(' ').toLowerCase();
    const nameMatch = d.name?.toLowerCase().includes(q) || false;
    return nameMatch || specStr.includes(q);
  });

  const handleBook = async () => {
    if (!selectedTime) return toast.error('Please select an encrypted timeslot');
    setIsBooking(true);
    try {
      // Create Appointment payload aligned with backend model
      const payload = {
        doctor_id: selectedDoc.id,
        date: selectedDate,
        time: selectedTime,
        type: 'video', // we can default to video or allow toggle
        reason: 'General Consultation',
        fee: selectedDoc.consultation_fee_video || 2000,
        payment_method: 'digital'
      };

      const res = await api.post('/appointments/', payload);
      
      if (res.data.status === 'confirmed') {
        toast.success('Session verified & encrypted');
        setBookingStep(2);
        setTimeout(() => {
          setSelectedDoc(null);
          setBookingStep(1);
          setSelectedTime(null);
        }, 3000);
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to initialize session slot');
    } finally {
      setIsBooking(false);
    }
  };

  const getDocPhoto = (doc) => {
    if (doc.photo_url) return doc.photo_url;
    // Fallback professional avatar based on name hash
    const sum = doc.name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return `https://i.pravatar.cc/150?img=${sum % 70}`;
  };

  return (
    <div className="py-8 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative z-10">
        <div>
          <h2 className="text-xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-prism-rose/20 border border-prism-rose/40 flex items-center justify-center text-prism-rose shadow-[0_0_15px_rgba(244,63,94,0.3)]">
              <Stethoscope size={20} />
            </div>
            Global Provider Registry
          </h2>
          <p className="text-white/40 text-sm font-medium mt-2">Connecting patients to verified medical excellence.</p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
          <input 
            type="text" 
            placeholder="Search specialties, doctors..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[52px] bg-white/5 border border-white/10 rounded-full pl-12 pr-6 text-sm font-medium text-white placeholder:text-white/20 focus:border-prism-rose focus:bg-white/10 outline-none transition-all shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-20">
           <div className="w-10 h-10 border-4 border-prism-rose/20 border-t-prism-rose rounded-full animate-spin" />
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="text-center p-20 border border-white/5 bg-white/5 rounded-3xl">
          <p className="text-white/40 mb-2">No active identities matched your query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDoctors.map((doc, idx) => (
            <motion.div 
              key={doc.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
            >
              <GlassCard glowColor="rose" className="p-6 flex flex-col items-center text-center group h-full justify-between">
                <div>
                  <div className="relative mb-5 mx-auto w-fit">
                    <div className="w-24 h-24 rounded-[32px] overflow-hidden border border-prism-rose/20 p-1 group-hover:border-prism-rose transition-colors duration-500 shadow-[0_0_20px_rgba(244,63,94,0.1)] group-hover:shadow-[0_0_30px_rgba(244,63,94,0.4)]">
                        <img src={getDocPhoto(doc)} alt={doc.name} className="w-full h-full object-cover rounded-[28px] filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                    </div>
                    {doc.rating > 0 && (
                      <div className="absolute -bottom-3 inset-x-0 mx-auto w-fit bg-prism-bg border border-white/10 text-[10px] font-black tracking-widest uppercase flex items-center gap-1 px-3 py-1.5 rounded-full text-prism-rose shadow-lg">
                          <Star size={10} className="fill-current" /> {doc.rating.toFixed(1)}
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-prism-rose transition-colors">{doc.name}</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 line-clamp-1">
                    {doc.specialties?.length ? doc.specialties.join(', ') : 'General'}
                  </p>
                  
                  <div className="flex flex-col gap-2 w-full mb-6">
                    <div className="flex items-center justify-center gap-4 text-[11px] font-black tracking-widest uppercase text-white/50 border border-white/5 bg-white/5 px-3 py-2 rounded-xl">
                      <span className="flex items-center gap-1.5"><Video size={14} className="text-prism-rose" /> Rs. {doc.consultation_fee_video || 2000}</span>
                      <div className="w-0.5 h-3 bg-white/20" />
                      <span className="flex items-center gap-1.5"><MapPin size={14} className="text-prism-cyan" /> {doc.city || 'Digital'}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="rose" 
                  className="w-full text-[11px] h-14 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                  onClick={() => {
                    setSelectedDoc(doc);
                    setSelectedDate(availableDates[0].date);
                    setSelectedTime(null);
                    setBookingStep(1);
                  }}
                >
                  <CalendarIcon size={16} className="mr-2" /> Book Sync Session
                </Button>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modern Floating Booking Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedDoc(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-prism-surface border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-prism-rose/50 to-transparent" />
              
              <button 
                onClick={() => setSelectedDoc(null)} 
                className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors z-20 bg-white/5 p-2 rounded-full border border-white/10"
              >
                <X size={20} />
              </button>

              {bookingStep === 1 ? (
                <div className="flex flex-col h-full overflow-y-auto p-6 md:p-10 custom-scrollbar">
                  <h3 className="text-2xl font-display font-bold text-white mb-6">Initialize Sync Protocol</h3>
                  
                  {/* Doctor Mini-Profile */}
                  <div className="flex items-center gap-5 p-4 bg-gradient-to-r from-prism-rose/10 to-transparent rounded-3xl border border-prism-rose/20 mb-8">
                    <img src={getDocPhoto(selectedDoc)} className="w-16 h-16 rounded-[20px] object-cover border border-white/20" />
                    <div>
                      <p className="font-bold text-white text-lg">{selectedDoc.name}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-prism-rose">{selectedDoc.specialties?.[0] || 'General'}</p>
                    </div>
                  </div>

                  {/* Horizontal Date Scroller */}
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 ml-1">Select Horizon Date</h4>
                  <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar snap-x">
                    {availableDates.map(day => (
                      <button
                        key={day.date}
                        onClick={() => setSelectedDate(day.date)}
                        className={`flex flex-col items-center justify-center min-w-[76px] h-20 rounded-2xl border transition-all snap-start ${
                          selectedDate === day.date 
                            ? 'bg-prism-rose text-white border-prism-rose shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
                            : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-[10px] font-black tracking-widest uppercase mb-1">{day.label.split(' ')[0]}</span>
                        <span className="text-lg font-bold font-display">{day.date.split('-')[2]}</span>
                      </button>
                    ))}
                  </div>

                  {/* Time Slots Grid */}
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 mt-6 ml-1 flex items-center gap-2">
                    <Clock size={12} /> Available Encryption Nodes
                  </h4>
                  
                  {slotsData.loading ? (
                    <div className="flex justify-center p-8">
                       <div className="w-6 h-6 border-2 border-prism-rose/20 border-t-prism-rose rounded-full animate-spin" />
                    </div>
                  ) : slotsData.slots.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-8">
                      {slotsData.slots.map(time => (
                         <button
                           key={time}
                           onClick={() => setSelectedTime(time)}
                           className={`h-12 rounded-xl text-xs font-bold transition-all border ${
                             selectedTime === time 
                               ? 'bg-prism-rose text-white border-prism-rose shadow-inner'
                               : 'bg-white/5 text-white/60 border-white/10 hover:border-white/20'
                           }`}
                         >
                           {time}
                         </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-white/5 border border-white/5 rounded-2xl mb-8">
                       <p className="text-white/40 text-sm">{slotsData.message || 'No slots on this horizon.'}</p>
                    </div>
                  )}

                  {/* Booking Action */}
                  <div className="mt-auto pt-6 border-t border-white/5">
                    <div className="flex items-center justify-between mb-6 text-sm">
                      <span className="text-white/40 font-medium tracking-widest uppercase text-[10px]">Session Allocation Fee:</span>
                      <span className="text-white font-bold text-lg">Rs. {selectedDoc.consultation_fee_video || 2000}</span>
                    </div>
                    <Button 
                      variant="rose" 
                      className="w-full h-16 shadow-[0_0_30px_rgba(244,63,94,0.3)] text-sm font-bold tracking-widest uppercase" 
                      onClick={handleBook}
                      disabled={!selectedTime || isBooking}
                    >
                      {isBooking ? 'Synchronizing...' : 'Confirm Encryption'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ type: 'spring', damping: 12, delay: 0.1 }}
                    className="w-24 h-24 rounded-full bg-prism-emerald/10 border border-prism-emerald/30 flex items-center justify-center text-prism-emerald mb-8 relative"
                  >
                    <div className="absolute inset-0 rounded-full border-2 border-prism-emerald animate-ping opacity-20" />
                    <CheckCircle size={48} />
                  </motion.div>
                  <h3 className="text-3xl font-display font-medium text-white mb-4">Uplink Confirmed!</h3>
                  <p className="text-white/40 font-medium mb-2 leading-relaxed max-w-[280px]">
                    Your session with <strong className="text-white">{selectedDoc.name}</strong> is permanently encrypted into the registry.
                  </p>
                  <p className="text-prism-emerald font-black uppercase tracking-[0.2em] text-[10px] mt-6 bg-prism-emerald/10 px-4 py-2 rounded-full border border-prism-emerald/20">
                    Awaiting Provider Node Sync
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
