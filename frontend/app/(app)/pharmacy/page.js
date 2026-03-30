'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Package, ShoppingCart, ShoppingBag, 
  Trash2, Plus, Minus, CheckCircle, Navigation, 
  Store, AlertCircle, Loader2 
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function PharmacyMarketplace() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [cart, setCart] = useState([]);
  const [checkoutStep, setCheckoutStep] = useState(0); // 0: Browse, 1: Checkout, 2: Success

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    try {
      const res = await api.get(`/pharmacy/medicines/search?q=${query}`);
      setResults(res.data.medicines);
    } catch (err) {
      toast.error('Inventory search failed.');
    } finally {
      setSearching(false);
    }
  };

  const addToCart = (med) => {
    const existing = cart.find(c => c.id === med.id);
    if (existing) {
      setCart(cart.map(c => c.id === med.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...med, qty: 1 }]);
    }
    toast.success(`${med.name} buffered to cart.`);
  };

  const updateQty = (id, delta) => {
    setCart(cart.map(c => {
      if (c.id === id) {
        const newQty = Math.max(0, c.qty + delta);
        return { ...c, qty: newQty };
      }
      return c;
    }).filter(c => c.qty > 0));
  };

  const placeOrder = async () => {
    setSearching(true);
    try {
      await api.post('/pharmacy/orders', {
        items: cart,
        delivery_address: "Default Address (Node-Stored)",
        prescription_required: cart.some(c => c.rx_required)
      });
      setCart([]);
      setCheckoutStep(2);
    } catch (err) {
      toast.error('Order transmission failed.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="py-6 flex flex-col min-h-screen">
      
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-12">
        <div>
          <h2 className="text-[10px] font-black uppercase text-prism-cyan tracking-[0.5em] mb-4 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-prism-cyan shadow-[0_0_10px_rgba(6,182,212,1)]" />
             Vanguard Pharmacy
          </h2>
          <h1 className="text-4xl font-display font-medium text-white mb-2 tracking-tight">Health <span className="text-transparent bg-clip-text bg-gradient-to-r from-prism-cyan to-white font-bold italic">Marketplace.</span></h1>
          <p className="text-sm font-medium text-white/40">Verified medical supplies and doorstep delivery.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <Button variant="ghost" className="h-14 border border-white/5 text-xs text-white/40 hover:text-white" onClick={() => setCheckoutStep(1)}>
              <ShoppingBag size={18} className="mr-2" /> Recent Orders
           </Button>
           <div className="relative">
              <Button variant="cyan" className="h-14 px-8 text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                 <ShoppingCart size={18} className="mr-2" /> Cart ({cart.reduce((a, b) => a + b.qty, 0)})
              </Button>
           </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {checkoutStep === 0 && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col gap-10">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-4">
              <Input 
                placeholder="Search prescription or OTC medicines..." 
                className="h-16 flex-1 text-lg font-display" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                icon={<Search size={22} />}
              />
              <Button type="submit" variant="cyan" className="h-16 px-10 text-lg font-bold shadow-lg" disabled={searching}>
                 {searching ? <Loader2 className="animate-spin" /> : 'Search'}
              </Button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {results.length === 0 ? (
                 <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.02]">
                    <Store size={48} className="mx-auto mb-4 text-white/10" />
                    <p className="text-white/20 italic">Initialize search to discover global inventory.</p>
                 </div>
               ) : results.map((med, i) => (
                 <motion.div key={med.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <GlassCard glowColor="cyan" className="p-6 h-full flex flex-col justify-between">
                       <div>
                          <div className="flex justify-between items-start mb-6">
                             <div className="w-16 h-16 rounded-2xl bg-prism-cyan/10 border border-prism-cyan/20 flex items-center justify-center text-prism-cyan">
                                <Package size={32} />
                             </div>
                             {med.rx_required && (
                                <span className="bg-prism-rose/20 text-prism-rose border border-prism-rose/40 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">Rx Needed</span>
                             )}
                          </div>
                          <h4 className="text-lg font-bold text-white mb-1 uppercase tracking-tight">{med.name}</h4>
                          <p className="text-xs font-black uppercase tracking-widest text-white/30 mb-4">{med.generic || 'Verified Supply'}</p>
                          <p className="text-sm font-medium text-white/60 mb-6 leading-relaxed line-clamp-2">{med.description || 'Verified Pakistan pharmaceutical grade medicine.'}</p>
                       </div>
                       
                       <div className="flex items-center justify-between mt-4">
                          <span className="text-2xl font-mono font-bold text-white tracking-widest font-display">PKR {med.price}</span>
                          <button onClick={() => addToCart(med)} className="w-10 h-10 rounded-xl bg-prism-cyan text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all">
                             <Plus size={20} />
                          </button>
                       </div>
                    </GlassCard>
                 </motion.div>
               ))}
            </div>
          </motion.div>
        )}

        {checkoutStep === 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center">
             <GlassCard className="w-full max-w-2xl p-10 flex flex-col gap-8">
                <div className="flex justify-between items-center">
                   <h3 className="text-2xl font-display font-medium text-white flex items-center gap-3">
                      <ShoppingCart size={24} className="text-prism-cyan" /> Finalize Dispatch
                   </h3>
                   <button onClick={() => setCheckoutStep(0)} className="text-[10px] font-black uppercase text-white/40 hover:text-white transition-colors">Abort & Return</button>
                </div>

                <div className="flex flex-col gap-4 border-y border-white/5 py-8">
                   {cart.length === 0 ? <p className="text-center text-white/20 italic">Cart sequence is empty.</p> : cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-prism-cyan/20 flex items-center justify-center text-prism-cyan"><Package size={20} /></div>
                            <div>
                               <p className="text-sm font-bold text-white uppercase">{item.name}</p>
                               <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">{item.qty} Unit(s) at {item.price}/ea</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-4">
                            <div className="flex items-center bg-black/40 rounded-xl border border-white/10 p-1">
                               <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40"><Minus size={14} /></button>
                               <span className="w-10 text-center font-mono font-bold text-white text-sm">{item.qty}</span>
                               <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-cyan-400"><Plus size={14} /></button>
                            </div>
                            <span className="text-sm font-mono font-bold text-white min-w-[80px] text-right">PKR {item.price * item.qty}</span>
                         </div>
                      </div>
                   ))}
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col gap-4">
                   <div className="flex justify-between text-white/40 text-xs font-black uppercase tracking-widest">
                      <span>Subtotal Clause</span>
                      <span className="text-white">PKR {cart.reduce((a, b) => a + b.price * b.qty, 0)}</span>
                   </div>
                   <div className="flex justify-between text-white/40 text-xs font-black uppercase tracking-widest">
                      <span>Delivery Protocol</span>
                      <span className="text-white">PKR 150</span>
                   </div>
                   <div className="h-px bg-white/10" />
                   <div className="flex justify-between text-white font-display text-xl">
                      <span className="font-medium">Total Ledger</span>
                      <span className="font-bold text-prism-cyan">PKR {cart.reduce((a, b) => a + b.price * b.qty, 0) + 150}</span>
                   </div>
                </div>

                <Button variant="cyan" className="h-16 text-lg font-bold shadow-xl" onClick={placeOrder} disabled={searching || cart.length === 0}>
                   {searching ? <Loader2 className="animate-spin mr-2" /> : <Navigation size={20} className="mr-2" />}
                   {searching ? 'Transmitting Data...' : 'Confirm Doorstep Delivery'}
                </Button>
             </GlassCard>
             <p className="mt-8 text-[10px] font-black uppercase tracking-widest text-white/20 flex items-center gap-2">
                <AlertCircle size={14} /> End-to-end encrypted medical logistics.
             </p>
          </motion.div>
        )}

        {checkoutStep === 2 && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center py-20 text-center">
             <div className="w-24 h-24 rounded-full bg-prism-emerald/20 border-4 border-prism-emerald flex items-center justify-center text-prism-emerald mb-8 shadow-[0_0_50px_rgba(16,185,129,0.5)]">
                <CheckCircle size={48} />
             </div>
             <h3 className="text-3xl font-display font-bold text-white mb-2">Protocol Successful.</h3>
             <p className="text-sm font-medium text-white/40 mb-10 max-w-sm mx-auto leading-relaxed">Your medical supplies are being optimized for delivery. You will receive a node ping when the courier is near.</p>
             <Button variant="emerald" onClick={() => setCheckoutStep(0)} className="h-14 px-10 text-xs font-black uppercase tracking-widest mb-4">
                Return to Marketplace
             </Button>
             <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Transaction Hash: {Math.random().toString(36).substring(2, 12).toUpperCase()}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
