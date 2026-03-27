'use client';
import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Send, User, Sparkles } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import useAIChat from '@/hooks/useAIChat';

export default function AISymptoms() {
  const { messages, isThinking, sendMessage, urgencyLevel } = useAIChat();
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isThinking]);

  const handleSend = (e) => {
    e.preventDefault();
    const val = inputRef.current.value;
    if (!val.trim() || isThinking) return;

    sendMessage(val);
    inputRef.current.value = '';
  };

  return (
    <div className="h-[85vh] md:h-[calc(100vh-140px)] flex flex-col pt-6 pb-2">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shadow-lg transition-all duration-500 ${
          urgencyLevel === 'red' ? 'bg-prism-rose/20 border-prism-rose text-prism-rose shadow-prism-rose/30' :
          urgencyLevel === 'yellow' ? 'bg-amber-500/20 border-amber-500 text-amber-500 shadow-amber-500/30' :
          'bg-prism-fuchsia/20 border-prism-fuchsia/40 text-prism-fuchsia shadow-prism-fuchsia/30'
        }`}>
          <Brain size={28} />
        </div>
        <div>
          <h2 className="text-xl font-display font-bold text-white tracking-tight flex items-center gap-2">
            Sehat AI 
            {urgencyLevel && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase font-black tracking-widest ${
                urgencyLevel === 'red' ? 'bg-prism-rose/20 border-prism-rose text-prism-rose' :
                urgencyLevel === 'yellow' ? 'bg-amber-500/20 border-amber-500 text-amber-500' :
                'bg-emerald-500/20 border-emerald-500 text-emerald-500'
              }`}>
                {urgencyLevel} Priority
              </span>
            )}
          </h2>
          <p className="text-xs font-black text-prism-fuchsia tracking-widest uppercase">
            {urgencyLevel === 'red' ? 'Emergency Protocol Active' : 'Neural Diagnostic Terminal'}
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <GlassCard glowColor={urgencyLevel === 'red' ? 'rose' : 'fuchsia'} className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden relative">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] blur-[100px] pointer-events-none transition-all duration-1000 ${
          urgencyLevel === 'red' ? 'bg-prism-rose/10' : 'bg-prism-fuchsia/10'
        }`} />
        
        <div ref={scrollRef} className="flex-1 overflow-y-auto hide-scrollbar flex flex-col gap-6 pr-2 z-10">
          <AnimatePresence>
            {messages.length === 0 && (
              <div className="text-center py-10 opacity-40">
                <Brain size={48} className="mx-auto mb-4 animate-pulse" />
                <p className="text-sm font-medium">Neural Net Ready. Describe your symptoms naturally.</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
              >
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border ${
                  msg.role === 'user' ? 'bg-white/10 border-white/20 text-white/50' : 
                  'bg-prism-fuchsia/20 border-prism-fuchsia/40 text-prism-fuchsia'
                }`}>
                  {msg.role === 'user' ? <User size={14} /> : <Brain size={14} />}
                </div>
                <div className={`p-4 rounded-2xl text-[15px] leading-relaxed backdrop-blur-md border ${
                  msg.role === 'user' ? 'bg-white/10 border-white/10 text-white !rounded-tr-sm' : 
                  'bg-white/5 border-white/10 text-white shadow-xl !rounded-tl-sm'
                }`}>
                  {msg.content || <span className="animate-pulse">Thinking...</span>}
                </div>
              </motion.div>
            ))}
            
            {isThinking && messages[messages.length-1]?.role === 'user' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 max-w-[85%] self-start items-center">
                 <div className="w-8 h-8 rounded-full bg-prism-fuchsia/20 border border-prism-fuchsia/40 text-prism-fuchsia flex items-center justify-center animate-pulse"><Brain size={14} /></div>
                 <div className="flex gap-1.5 p-4 rounded-2xl bg-prism-fuchsia/10 border border-prism-fuchsia/20">
                   {[0,1,2].map(i => <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i*0.1 }} className="w-1.5 h-1.5 rounded-full bg-prism-fuchsia" />)}
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="mt-4 relative z-10 flex gap-2">
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Describe symptoms (e.g. fever, chest pain)..."
            className="flex-1 h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white placeholder:text-white/30 focus:bg-white/10 focus:border-prism-fuchsia shadow-lg outline-none transition-all"
          />
          <button type="submit" disabled={isThinking} className="h-14 w-14 rounded-2xl bg-prism-fuchsia text-white flex items-center justify-center disabled:opacity-50 transition-all shadow-lg hover:scale-105 active:scale-95">
             <Send size={18} />
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
