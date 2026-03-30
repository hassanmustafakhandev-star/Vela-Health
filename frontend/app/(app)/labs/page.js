'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Droplet, Microscope, Calendar, Clock, 
  MapPin, CheckCircle, Search, Filter, Loader2, Info
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

const CATEGORIES = ['Radiology', 'Pathology', 'Cardiology', 'Genetics', 'Hormonal'];

export default function LabMarketplace() {
  const [tests, setTests] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    fetchTests();
  }, [category]);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/lab/tests${category ? `?category=${category}` : ''}`);
      setTests(res.data.tests || []);
    } catch (err) {
      toast.error('Lab catalog synchronization failed.');
    } finally {
      setLoading(false);
    }
  };

  const toggleCart = (test) => {
    const isAdded = cart.find(c => c.id === test.id);
    if (isAdded) {
       setCart(cart.filter(c => c.id !== test.id));
       toast.error(`Removed: ${test.name}`);
    } else {
       setCart([...cart, test]);
       toast.success(`Buffered: ${test.name}`);
    }
  };

  const finalizeBooking = async () => {
    setLoading(true);
    try {
      await api.post('/lab/orders', {
        tests: cart,
        collection_type: 'home',
        preferred_date: new Date().toISOString()
      });
      setCart([]);
      setShowCheckout(false);
      toast.success('Sampling node dispatched to your location.');
    } catch (err) {
      toast.error('Booking transmission error.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = tests.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="py-6 min-h-screen">
      
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-12">
        <div>
          <h2 className="text-[10px] font-black uppercase text-prism-emerald tracking-[0.5em] mb-4 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-prism-emerald shadow-[0_0_10px_rgba(16,185,129,1)]" />
             Vanguard Diagnostics
          </h2>
          <h1 className="text-4xl font-display font-medium text-white mb-2 tracking-tight">Molecular <span className="text-transparent bg-clip-text bg-gradient-to-r from-prism-emerald to-white font-bold italic">Analysis.</span></h1>
          <p className="text-sm font-medium text-white/40">Home sampling and ISO-certified lab testing.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <Button variant="emerald" className="h-14 px-8 text-xs font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)]" onClick={() => setShowCheckout(true)} disabled={cart.length === 0}>
              <Microscope size={18} className="mr-2" /> Book Sampling ({cart.length})
           </Button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row gap-6 mb-10">
         <div className="flex-1">
            <Input 
              icon={<Search size={18} />}
              placeholder="Search molecular tests (e.g. CBC, MRI)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-14 bg-white/5"
            />
         </div>
         <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
            <button 
              onClick={() => setCategory(null)}
              className={`px-6 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                 !category ? 'bg-prism-emerald border-prism-emerald text-white' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
              }`}
            >
               All Categories
            </button>
            {CATEGORIES.map((cat) => (
               <button 
                 key={cat}
                 onClick={() => setCategory(cat)}
                 className={`px-6 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                   category === cat ? 'bg-prism-emerald border-prism-emerald text-white' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                 }`}
               >
                 {cat}
               </button>
            ))}
         </div>
      </div>

      {loading && tests.length === 0 ? (
        <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-prism-emerald" size={48} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {filtered.map((test, i) => {
              const inCart = cart.find(c => c.id === test.id);
              return (
              <motion.div key={test.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                 <GlassCard 
                  glowColor="emerald" 
                  className={`p-6 flex flex-col justify-between h-full border-2 transition-all cursor-pointer ${
                    inCart ? 'border-prism-emerald/40 bg-prism-emerald/5' : 'border-white/5 hover:border-white/10'
                  }`}
                  onClick={() => toggleCart(test)}
                 >
                    <div>
                       <div className="flex justify-between items-start mb-6">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                             inCart ? 'bg-prism-emerald text-white' : 'bg-white/5 text-prism-emerald border border-white/10'
                          }`}>
                             {test.category === 'Radiology' ? <Activity size={24} /> : <Droplet size={24} />}
                          </div>
                          {inCart && <CheckCircle size={20} className="text-prism-emerald" />}
                       </div>
                       <h4 className="text-lg font-bold text-white mb-1 uppercase tracking-tight">{test.name}</h4>
                       <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-4">{test.category} Node</p>
                       <div className="flex items-center gap-2 mb-6">
                          <Clock size={12} className="text-white/20" />
                          <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Result in {test.turnaround || '24h'}</span>
                       </div>
                    </div>
                    <div className="flex items-end justify-between">
                       <span className="text-2xl font-mono font-bold text-white tracking-widest">PKR {test.price}</span>
                       <span className="text-[10px] font-black uppercase text-prism-emerald tracking-widest underline decoration-2">Select Node</span>
                    </div>
                 </GlassCard>
              </motion.div>
           )})}
        </div>
      )}

      {/* Checkout Backdrop */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
          >
            <motion.div 
               initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95 }}
               className="w-full max-w-xl bg-prism-surface border border-white/10 rounded-[40px] p-10 shadow-2xl overflow-hidden relative"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-prism-emerald/10 blur-[60px]" />
               
               <h3 className="text-2xl font-display font-medium text-white mb-8 flex items-center gap-3">
                  <Microscope size={28} className="text-prism-emerald" /> Sampling Schedule
               </h3>

               <div className="flex flex-col gap-4 mb-8">
                  {cart.map(t => (
                     <div key={t.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
                        <span className="text-sm font-bold text-white uppercase tracking-tight">{t.name}</span>
                        <span className="text-sm font-mono font-bold text-white/60">PKR {t.price}</span>
                     </div>
                  ))}
               </div>

               <div className="flex flex-col gap-4 mb-10">
                  <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                     <MapPin size={20} className="text-prism-emerald" />
                     <div className="flex-1">
                        <p className="text-[8px] font-black uppercase text-white/30 tracking-widest">Collection Point</p>
                        <p className="text-xs font-bold text-white">Using stored biometric address...</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                     <Calendar size={20} className="text-prism-emerald" />
                     <div className="flex-1">
                        <p className="text-[8px] font-black uppercase text-white/30 tracking-widest">Collection Date</p>
                        <p className="text-xs font-bold text-white">Tomorrow, AM Slot 09:00 - 12:00</p>
                     </div>
                  </div>
               </div>

               <div className="flex justify-between items-end mb-8">
                  <div>
                    <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">Global Aggregate</p>
                    <p className="text-4xl font-display font-medium text-white">PKR {cart.reduce((a, b) => a + Number(b.price), 0)}</p>
                  </div>
                  <Button variant="emerald" className="h-16 px-10 text-xs font-black uppercase tracking-widest" onClick={finalizeBooking} loading={loading}>
                     Confirm Sample Dispatch
                  </Button>
               </div>
               
               <button onClick={() => setShowCheckout(false)} className="w-full text-center text-xs font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors">Abort Matrix</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
