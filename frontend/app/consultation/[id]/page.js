'use client';
import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, MonitorUp, 
  MessageSquare, LayoutPanelLeft, Activity, BrainCircuit,
  Maximize, MoreVertical, ShieldCheck, FileText
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import useAuthStore from '@/store/authStore';

export default function ConsultationRoom() {
  const { id } = useParams(); // This is the appointment ID
  const router = useRouter();
  const { role } = useAuthStore();
  
  const [session, setSession] = useState(null);
  const [apptData, setApptData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Media states
  const localVideoRef = useRef(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [stream, setStream] = useState(null);
  const [remoteConnected, setRemoteConnected] = useState(false);
  
  // Call duration array
  const [duration, setDuration] = useState(0);

  // Initialize the session with the backend
  useEffect(() => {
    const initSession = async () => {
      try {
        const [sessionRes, apptRes] = await Promise.all([
          api.post('/consult/start', { appointment_id: id }),
          api.get(`/appointments/${id}`)
        ]);
        
        setSession(sessionRes.data.session_id);
        const data = apptRes.data;
        // Mock patient name if missing in backend appt record (usually nested or separate)
        setApptData({
           patient_id: data.patient_id,
           patient_name: data.patient_name || 'Patient Node'
        });
        
        // Simulate remote connecting after 4 seconds
        setTimeout(() => setRemoteConnected(true), 4000);
      } catch (err) {
        toast.error('Failed to establish secure WebRTC uplink.');
      } finally {
        setLoading(false);
      }
    };
    if (id) initSession();
  }, [id]);

  // Request actual Webcam
  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        setStream(mediaStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        toast.error("Camera access required for secure consultation.");
      }
    };
    startCamera();

    return () => {
      // Cleanup stream on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Update tracks when toggled
  useEffect(() => {
    if (stream) {
      stream.getVideoTracks().forEach(track => { track.enabled = isVideoOn; });
      stream.getAudioTracks().forEach(track => { track.enabled = isMicOn; });
    }
  }, [isVideoOn, isMicOn, stream]);

  // Duration Timer
  useEffect(() => {
    if (!remoteConnected) return;
    const interval = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(interval);
  }, [remoteConnected]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const endCall = async () => {
    if (stream) stream.getTracks().forEach(t => t.stop());
    try {
      if (session) {
         await api.post('/consult/end', { session_id: session, duration_seconds: duration });
      }
    } catch(e) {}
    router.replace('/dashboard');
  };

  if (loading) {
    return (
      <div className="h-screen w-full bg-prism-bg flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-prism-cyan/20 border-t-prism-cyan rounded-full animate-spin mb-8" />
        <h2 className="text-2xl font-display font-medium text-white tracking-widest mt-4">Connecting to Secure Node</h2>
        <p className="text-prism-cyan font-black uppercase tracking-widest text-xs mt-2 animate-pulse">Initializing WebRTC Handshake...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-black overflow-hidden relative flex flex-col font-sans">
      
      {/* BACKGROUND (The Remote Video) */}
      <div className="absolute inset-0 z-0 bg-[#0f1115]">
        <AnimatePresence>
          {!remoteConnected ? (
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="w-full h-full flex flex-col items-center justify-center relative"
             >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_50%)]" />
                <div className="w-32 h-32 rounded-full border border-prism-cyan/30 flex items-center justify-center relative shadow-[0_0_50px_rgba(6,182,212,0.2)]">
                   <div className="absolute inset-0 rounded-full border border-prism-cyan animate-ping opacity-20" />
                   <img src="https://i.pravatar.cc/150?img=11" className="w-24 h-24 rounded-full filter grayscale object-cover" />
                </div>
                <h3 className="text-white text-xl font-display font-bold mt-8">Waiting for participant...</h3>
                <p className="text-white/40 text-sm mt-2 font-medium">Session ID: {session?.slice(0,8)}</p>
             </motion.div>
          ) : (
             <motion.div 
               initial={{ opacity: 0, scale: 1.1 }} 
               animate={{ opacity: 1, scale: 1 }} 
               transition={{ duration: 1 }}
               className="w-full h-full relative"
             >
               {/* Simulated Remote Feed (using a highly detailed generic medical video or just an abstract moving gradient if no video available) */}
               <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover filter brightness-[0.7] contrast-125" />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* TOP BAR / HUD */}
      <div className="absolute top-0 inset-x-0 p-6 z-20 flex justify-between items-start pointer-events-none">
         <div className="flex flex-col gap-2">
           <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3 w-fit pointer-events-auto shadow-2xl">
              <ShieldCheck size={16} className="text-prism-emerald" />
              <span className="text-xs font-black tracking-widest uppercase text-white">E2E Encrypted</span>
              <div className="w-px h-3 bg-white/20" />
              <span className="text-sm font-bold text-white font-mono">{formatTime(duration)}</span>
           </div>
         </div>
      </div>

      {/* SELF VIEW (Picture-in-Picture) */}
      <motion.div 
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.2}
        className="absolute bottom-32 right-6 w-48 h-72 md:w-64 md:h-96 z-30 rounded-[32px] overflow-hidden bg-zinc-900 border-2 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-grab active:cursor-grabbing hover:border-prism-cyan transition-colors"
      >
        {!isVideoOn ? (
           <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900">
             <div className="w-16 h-16 rounded-full bg-prism-cyan/20 flex items-center justify-center text-prism-cyan">
               <VideoOff size={24} />
             </div>
           </div>
        ) : (
           <video 
             ref={localVideoRef} 
             autoPlay 
             playsInline 
             muted 
             className="w-full h-full object-cover transform -scale-x-100 filter contrast-110 saturate-150"
           />
        )}
        
        {/* Local user status badge */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
           <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] font-black tracking-widest uppercase text-white">
             You
           </div>
           {!isMicOn && (
             <div className="w-8 h-8 rounded-full bg-prism-rose/80 backdrop-blur text-white flex items-center justify-center shadow-lg">
               <MicOff size={14} />
             </div>
           )}
        </div>
      </motion.div>

      {/* BOTTOM CONTROL BAR */}
      <div className="absolute bottom-8 inset-x-0 z-40 flex justify-center">
         <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-full p-2 flex items-center gap-2 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <ControlButton 
              active={isMicOn} 
              onClick={() => setIsMicOn(!isMicOn)}
              icon={isMicOn ? <Mic size={20} /> : <MicOff size={20} />} 
              danger={!isMicOn}
              tooltip="Microphone"
            />
            <ControlButton 
              active={isVideoOn} 
              onClick={() => setIsVideoOn(!isVideoOn)}
              icon={isVideoOn ? <Video size={20} /> : <VideoOff size={20} />} 
              danger={!isVideoOn}
              tooltip="Camera"
            />
            <div className="w-px h-8 bg-white/10 mx-2" />
            <ControlButton active={true} icon={<MonitorUp size={20} />} tooltip="Share Screen" />
            <ControlButton active={true} icon={<MessageSquare size={20} />} tooltip="Chat" />
            <div className="w-px h-8 bg-white/10 mx-2" />
            
            <button 
              onClick={endCall}
              className="w-14 h-14 rounded-full bg-prism-rose hover:bg-rose-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all transform hover:scale-105"
            >
               <PhoneOff size={22} className="fill-current" />
            </button>
         </div>
      </div>

      {/* OPTIONAL AI PANEL (Simulated) */}
      <div className="absolute top-24 right-6 w-80 z-20 hidden lg:block pointer-events-none">
        {remoteConnected && (
           <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-2xl">
             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-prism-fuchsia flex items-center gap-2 mb-6">
                <BrainCircuit size={14} /> AI Telemetry Active
             </h4>
             <div className="space-y-4">
                <VitalBar label="Heart Rate Estimate" value="78 bpm" color="emerald" progress="65" />
                <VitalBar label="Voice Stress Level" value="Low" color="cyan" progress="20" />
                
                {role === 'doctor' && (
                  <div className="mt-4 pt-4 border-t border-white/10 pointer-events-auto">
                    <button 
                      onClick={() => window.open(`/doctor/prescriptions/new?patient_id=${apptData.patient_id}&appointment_id=${id}&patient_name=${encodeURIComponent(apptData.patient_name)}`, '_blank')}
                      className="w-full h-12 rounded-xl bg-prism-emerald/20 border border-prism-emerald/40 text-prism-emerald text-[10px] font-black uppercase tracking-widest hover:bg-prism-emerald/30 transition-all flex items-center justify-center gap-2"
                    >
                      <FileText size={14} /> Open Prescription Writer
                    </button>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-white/10">
                   <span className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2 block">Live Transcript</span>
                   <p className="text-sm font-medium text-white/80 leading-relaxed italic">
                     "Yes doctor, the headaches usually start around the evening. I've been taking Panadol but..."
                   </p>
                </div>
             </div>
           </motion.div>
        )}
      </div>

    </div>
  );
}

function ControlButton({ active, onClick, icon, danger, tooltip }) {
  return (
    <button 
      onClick={onClick}
      className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all ${
        danger 
          ? 'bg-prism-rose/20 text-prism-rose hover:bg-prism-rose/30 border border-prism-rose/30' 
          : active
            ? 'bg-white/10 text-white hover:bg-white/20 border border-transparent'
            : 'bg-white/5 text-white/50 border border-white/10'
      }`}
      title={tooltip}
    >
      {icon}
    </button>
  );
}

function VitalBar({ label, value, color, progress }) {
  return (
    <div>
      <div className="flex justify-between items-end mb-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{label}</span>
        <span className={`text-xs font-bold text-prism-${color}`}>{value}</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
         <div className={`h-full bg-prism-${color} rounded-full`} style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
