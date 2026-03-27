'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDoctorAuthStore } from '@/store/doctor/doctorAuthStore';
import useAuthStore from '@/store/authStore';
import GlassCard from '@/components/ui/GlassCard';
import { auth } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import { ShieldAlert, Clock, XCircle } from 'lucide-react';

/**
 * DoctorAuthGuard
 *
 * Pure status-gating component. Does NOT run any Firestore listeners —
 * that responsibility belongs exclusively to DoctorAuthProvider in layout.js.
 *
 * Gate sequence:
 *   mainLoading  → full-screen spinner (global Firebase auth syncing)
 *   !mainToken   → redirect to /login (not logged in)
 *   status=null  → syncing spinner (waiting for Firestore doctor doc)
 *   status=pending   → pending verification screen
 *   status=rejected  → rejected terminal screen
 *   status=suspended → suspended screen
 *   status=verified  → render children (dashboard)
 */
export default function DoctorAuthGuard({ children }) {
  const router = useRouter();
  const { loading: mainLoading, token: mainToken } = useAuthStore();
  const { status, loading: doctorLoading } = useDoctorAuthStore();

  useEffect(() => {
    if (!mainLoading && !mainToken) {
      router.push('/login');
    }
  }, [mainLoading, mainToken, router]);

  // ─── Gate 0: Global Firebase auth syncing ───────────────────────────────────
  if (mainLoading) {
    return <LoadingScreen message="Initializing Secure Session..." color="cyan" />;
  }

  // ─── Gate 1: Not authenticated ──────────────────────────────────────────────
  if (!mainToken) return null; // redirect in progress

  // ─── Gate 2: Firestore doctor doc syncing ───────────────────────────────────
  if (status === null) {
    return <LoadingScreen message="Syncing Medical Registry..." color="rose" />;
  }

  // ─── Gate 3: Rejected ───────────────────────────────────────────────────────
  if (status === 'rejected') {
    return (
      <TerminalScreen color="rose" icon={XCircle} title="Identity Terminated">
        <p className="text-white/40 font-medium leading-relaxed mb-10 text-sm">
          Vela's medical board has reached a final verdict. Access to the clinical
          framework has been permanently revoked. Contact support if you believe this
          is an error.
        </p>
        <SignOutButton label="Acknowledge & Exit" color="rose" router={router} />
      </TerminalScreen>
    );
  }

  // ─── Gate 4: Suspended ──────────────────────────────────────────────────────
  if (status === 'suspended') {
    return (
      <TerminalScreen color="amber" icon={ShieldAlert} title="Access Restricted">
        <p className="text-white/60 leading-relaxed mb-8 text-sm">
          Your professional activities have been suspended while the medical board
          reviews your practice logs. You will be notified upon resolution.
        </p>
        <SignOutButton label="Leave Nexus Portal" color="amber" router={router} />
      </TerminalScreen>
    );
  }

  // ─── Gate 5: Pending verification ───────────────────────────────────────────
  if (status === 'pending') {
    return (
      <TerminalScreen color="rose" icon={Clock} title="Identity Under Review">
        <p className="text-white/40 font-medium leading-relaxed mb-8 text-sm">
          Your clinical credentials are being audited by the Vela medical board.
          Dashboard access will activate automatically upon approval — no action needed.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={async () => {
              const tid = toast.loading('Syncing identity...');
              try {
                await auth.currentUser?.getIdToken(true);
                toast.success('Token refreshed', { id: tid });
              } catch {
                toast.error('Sync failed', { id: tid });
              }
            }}
            className="w-full py-4 bg-prism-rose/10 hover:bg-prism-rose/20 border border-prism-rose/30 rounded-2xl text-prism-rose text-[10px] font-black uppercase tracking-widest transition-all"
          >
            Force Identity Sync
          </button>
          <SignOutButton label="Exit Portal" color="white" router={router} />
        </div>
      </TerminalScreen>
    );
  }

  // ─── Gate 6: Verified — mount dashboard ─────────────────────────────────────
  if (status === 'verified') return children;

  // Default fallback (should never reach here)
  return <LoadingScreen message="Resolving Access Level..." color="rose" />;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function LoadingScreen({ message, color = 'rose' }) {
  const borderColor = `border-prism-${color}`;
  return (
    <div className="min-h-screen flex items-center justify-center bg-prism-bg">
      <div className="flex flex-col items-center gap-6">
        <div className={`w-12 h-12 border-4 border-white/10 border-t-prism-${color} rounded-full animate-spin`} />
        <p className={`text-prism-${color}/60 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse`}>
          {message}
        </p>
      </div>
    </div>
  );
}

function TerminalScreen({ color, icon: Icon, title, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-prism-bg">
      <GlassCard
        className={`max-w-md w-full p-10 text-center border-prism-${color}/20 relative overflow-hidden`}
      >
        <div
          className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-prism-${color} to-transparent`}
        />
        <div
          className={`w-20 h-20 rounded-3xl bg-prism-${color}/10 border border-prism-${color}/20 flex items-center justify-center text-prism-${color} mx-auto mb-8`}
        >
          <Icon size={36} />
        </div>
        <h2
          className={`text-2xl font-display font-bold text-prism-${color} mb-4 tracking-tight uppercase`}
        >
          {title}
        </h2>
        {children}
      </GlassCard>
    </div>
  );
}

function SignOutButton({ label, color, router }) {
  return (
    <button
      onClick={() => { auth.signOut(); router.push('/login'); }}
      className={`w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-${
        color === 'white' ? 'white/60' : `prism-${color}`
      } text-[10px] font-black uppercase tracking-widest transition-all border border-white/10`}
    >
      {label}
    </button>
  );
}