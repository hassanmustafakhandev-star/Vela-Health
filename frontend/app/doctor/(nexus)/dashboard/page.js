'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import AppointmentList from '@/components/doctor/appointment/AppointmentList';
import EarningsChart from '@/components/doctor/earnings/EarningsChart';
import {
  Users, Calendar, Clock, Banknote,
  TrendingUp, Video, ChevronRight,
  Activity, Star, Globe, Zap,
} from 'lucide-react';
import { useDoctorAuthStore } from '@/store/doctor/doctorAuthStore';
import { useAppointmentsDoctor } from '@/hooks/doctor/useAppointmentsDoctor';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function DoctorDashboard() {
  const router = useRouter(); // Fix Bug #2 — was missing, caused crash on "Initialize Connection"
  const { doctorProfile } = useDoctorAuthStore();
  const { todayAppointments, upcomingAppointments, loading, todayCount } =
    useAppointmentsDoctor();

  if (!doctorProfile) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-prism-rose/20 border-t-prism-rose rounded-full animate-spin" />
          <p className="text-white/30 text-xs font-black uppercase tracking-widest">
            Syncing Credentials...
          </p>
        </div>
      </div>
    );
  }

  const firstName = doctorProfile?.name?.split(' ')[0] || 'Specialist';
  const nextAppt = upcomingAppointments[0];

  return (
    <div className="py-2">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 relative"
      >
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-prism-rose/10 blur-[120px] pointer-events-none" />

        <div className="relative z-10">
          <h2 className="text-sm font-black text-prism-rose uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-prism-rose shadow-[0_0_10px_rgba(244,63,94,1)] animate-pulse" />
            Clinical Command Active
          </h2>
          <h1 className="text-4xl sm:text-5xl font-display font-medium text-white tracking-tight">
            Welcome back,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-prism-rose to-prism-fuchsia font-bold italic">
              Dr. {firstName}.
            </span>
          </h1>
        </div>

        <div className="flex gap-4 relative z-10">
          <GlassCard className="px-6 py-4 border-white/5 bg-white/5 flex flex-col justify-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">
              Today's Queue
            </span>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-mono font-bold text-white">
                {todayCount}
              </span>
              <Badge variant={todayCount > 5 ? 'rose' : 'emerald'} className="h-5 text-[9px] px-2">
                {todayCount > 5 ? 'High' : 'Normal'}
              </Badge>
            </div>
          </GlassCard>
          <GlassCard className="px-6 py-4 border-white/5 bg-white/5 flex flex-col justify-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">
              Specialty
            </span>
            <span className="text-sm font-bold text-white">
              {doctorProfile?.specialties?.[0] || 'General'}
            </span>
          </GlassCard>
        </div>
      </motion.div>

      {/* Main Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10"
      >
        {/* Left — Today's Registry (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <motion.section variants={item}>
            <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-prism-rose" />
                <h3 className="text-sm font-black uppercase tracking-widest text-white">
                  Today's Registry
                </h3>
              </div>
              <Link
                href="/doctor/appointments"
                className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors"
              >
                View Full Queue
              </Link>
            </div>
            <AppointmentList appointments={todayAppointments} loading={loading} />
          </motion.section>

          <motion.section variants={item}>
            <GlassCard className="p-8">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <TrendingUp size={18} className="text-prism-emerald" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-white">
                    Practice Yield
                  </h3>
                </div>
                <Badge variant="emerald">Live Tracking</Badge>
              </div>
              <EarningsChart />
            </GlassCard>
          </motion.section>
        </div>

        {/* Right — Actions & Analytics (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          {/* Next Consult Action */}
          <motion.div variants={item}>
            <GlassCard
              glowColor="rose"
              className="p-8 border-prism-rose/20 bg-prism-rose/[0.03] relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-prism-rose/10 blur-3xl pointer-events-none group-hover:bg-prism-rose/20 transition-colors" />
              <div className="mb-6 flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-prism-rose/10 border border-prism-rose/30 flex items-center justify-center text-prism-rose shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                  <Video size={24} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                    Next Consult
                  </span>
                  <span className="text-sm font-bold text-white">
                    {nextAppt?.time || '—'}
                  </span>
                </div>
              </div>
              <h4 className="text-xl font-bold text-white mb-2">
                {nextAppt?.patient_name || 'No Pending Consults'}
              </h4>
              <p className="text-xs text-white/40 italic mb-8">
                {nextAppt?.reason || 'Your clinical queue is currently empty.'}
              </p>
              <button
                onClick={() => nextAppt && router.push(`/consultation/${nextAppt.id}`)}
                disabled={!nextAppt}
                className="w-full h-14 rounded-2xl bg-prism-rose text-white font-bold shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Initialize Connection <ChevronRight size={16} />
              </button>
            </GlassCard>
          </motion.div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Patients',  val: doctorProfile?.total_patients ?? '—', icon: Users,  color: 'cyan',  sub: 'Lifetime' },
              { label: 'Rating',    val: doctorProfile?.rating?.toFixed(1) ?? '—', icon: Star, color: 'amber', sub: `${doctorProfile?.total_reviews ?? 0} reviews` },
            ].map((m) => (
              <motion.div key={m.label} variants={item}>
                <GlassCard className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <m.icon size={16} className={`text-prism-${m.color}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20">
                      {m.label}
                    </span>
                  </div>
                  <p className="text-2xl font-mono font-bold text-white">{m.val}</p>
                  <p className="text-[9px] font-bold text-white/30 mt-1">{m.sub}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* System Feed */}
          <motion.div variants={item}>
            <GlassCard className="p-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white mb-6">
                System Feed
              </h4>
              <div className="flex flex-col gap-4">
                {[
                  { icon: Activity, color: 'fuchsia', text: 'New AI diagnostic algorithm v4.2 active in Sehat AI.' },
                  { icon: Globe,    color: 'emerald', text: 'Regional health server latency optimized for South Asia.' },
                  { icon: Zap,      color: 'cyan',    text: 'Real-time prescription sync enabled for your account.' },
                ].map((f, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`w-8 h-8 rounded-lg bg-prism-${f.color}/10 flex items-center justify-center text-prism-${f.color} flex-shrink-0`}>
                      <f.icon size={14} />
                    </div>
                    <p className="text-[11px] text-white/40 leading-relaxed font-medium">
                      {f.text}
                    </p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            {[
              { href: '/doctor/profile',      label: 'Credential Portfolio' },
              { href: '/doctor/availability', label: 'Temporal Command'      },
              { href: '/doctor/prescriptions', label: 'Prescription Archive' },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
              >
                <span className="text-xs font-bold text-white group-hover:text-prism-cyan transition-colors">
                  {l.label}
                </span>
                <ChevronRight size={14} className="text-white/20 group-hover:text-prism-cyan transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}