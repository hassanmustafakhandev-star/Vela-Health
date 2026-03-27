'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, Video as VidIcon, VideoOff, 
  PhoneOff, Maximize2, Monitor, Settings,
  Activity, AlertCircle, User
} from 'lucide-react';
import { useState, useEffect } from 'react';
import useConsultation from '@/hooks/useConsultation';

export default function VideoRoomDoctor({ sessionId, onEnd }) {
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [duration, setDuration] = useState(0);

  const { 
    connectionStatus, 
    userVideo, 
    partnerVideo, 
    endCall 
  } = useConsultation(sessionId, 'doctor');

  useEffect(() => {
    let timer;
    if (connectionStatus === 'connected') {
      timer = setInterval(() => setDuration(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [connectionStatus]);

  const handleEnd = () => {
    endCall();
    if (onEnd) onEnd();
  };

  const formatDuration = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative h-full bg-black/40 rounded-[32px] overflow-hidden border border-white/5 shadow-2xl group">
      {/* Patient Video (Main) */}
      <div className="absolute inset-0 bg-prism-surface/20 flex items-center justify-center">
        {connectionStatus === 'connected' ? (
          <video ref={partnerVideo} autoPlay playsInline className="w-full h-full object-cover" />
        ) : (
          <div className="text-center flex flex-col items-center gap-4">
            <VidIcon size={80} className="text-white/5 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
              {connectionStatus === 'waiting' ? 'Waiting for Patient...' : 'Syncing Telemetry...'}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
      </div>

      {/* Overlays */}
      <div className="absolute top-6 left-6 flex items-center gap-3">
         <div className="px-4 py-2 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-prism-rose animate-pulse' : 'bg-white/20'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">
              {connectionStatus === 'connected' ? `Live • ${formatDuration(duration)}` : connectionStatus.toUpperCase()}
            </span>
         </div>
         {connectionStatus === 'connected' && (
           <div className="px-4 py-2 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 flex items-center gap-2">
              <Activity size={12} className="text-prism-emerald" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">72 BPM</span>
           </div>
         )}
      </div>

      <div className="absolute top-6 right-6">
         <button className="w-10 h-10 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all">
            <Maximize2 size={18} />
         </button>
      </div>

      {/* Doctor Video (PIP) */}
      <motion.div 
        drag
        dragConstraints={{ left: 0, right: 300, top: 0, bottom: 400 }}
        className="absolute bottom-24 right-6 w-40 h-52 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-3xl overflow-hidden shadow-2xl z-10 cursor-move"
      >
         <div className="absolute inset-0 flex items-center justify-center bg-prism-surface">
            {videoOff ? (
              <User color="white" opacity={0.2} />
            ) : (
              <video ref={userVideo} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
            )}
         </div>
         <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-md text-[8px] font-black uppercase tracking-widest text-white/60">
            Self View
         </div>
      </motion.div>

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-4 rounded-[28px] bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl transition-all group-hover:bottom-8">
        <button 
          onClick={() => setMuted(!muted)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border ${muted ? 'bg-prism-rose/20 border-prism-rose text-prism-rose' : 'bg-white/5 border-white/10 text-white/60 hover:text-white'}`}
        >
          {muted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
        <button 
          onClick={() => setVideoOff(!videoOff)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border ${videoOff ? 'bg-prism-rose/20 border-prism-rose text-prism-rose' : 'bg-white/5 border-white/10 text-white/60 hover:text-white'}`}
        >
          {videoOff ? <VideoOff size={20} /> : <VidIcon size={20} />}
        </button>
        <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white flex items-center justify-center">
           <Monitor size={20} />
        </button>
        <div className="w-[1px] h-8 bg-white/10 mx-2" />
        <button 
          onClick={handleEnd}
          className="w-16 h-12 rounded-2xl bg-prism-rose text-white flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:scale-105 transition-all"
        >
          <PhoneOff size={22} />
        </button>
      </div>

      {/* Signal Bars */}
      <div className="absolute bottom-6 left-6 flex items-end gap-1">
         {[0.4, 0.6, 0.8, 1].map((op, i) => (
           <div key={i} className={`w-1 rounded-full ${connectionStatus === 'connected' ? 'bg-prism-emerald' : 'bg-white/10'}`} style={{ height: `${(i+1)*4}px`, opacity: op }} />
         ))}
      </div>
    </div>
  );
}