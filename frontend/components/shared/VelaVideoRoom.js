'use client';
import { useEffect, useRef, useState } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import useAuthStore from '@/store/authStore';

/**
 * VelaVideoRoom — Shared ZegoCloud room component used by both Patient and Doctor.
 * 
 * SETUP (Free): 
 *   1. Go to https://console.zegocloud.com → Create project
 *   2. Copy AppID (a number) and AppSign (a string)
 *   3. Add to frontend/.env.local:
 *        NEXT_PUBLIC_ZEGO_APP_ID=your_app_id_number
 *        NEXT_PUBLIC_ZEGO_APP_SIGN=your_app_sign_string
 */
export default function VelaVideoRoom({ sessionId, role, onEnd }) {
  const containerRef = useRef(null);
  const { user } = useAuthStore();
  const [sdkReady, setSdkReady] = useState(false);
  const [credsMissing, setCredsMissing] = useState(false);

  useEffect(() => {
    if (!sessionId || !user || !containerRef.current) return;

    const appID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID || '0');
    const appSign = process.env.NEXT_PUBLIC_ZEGO_APP_SIGN || '';

    if (!appID || !appSign) {
      setCredsMissing(true);
      return;
    }

    const userName = user.displayName || user.email?.split('@')[0] || role;
    const userID = user.uid;

    // Generate a secure kit token for this room session
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      appSign,
      sessionId,   // roomID = consultation session_id
      userID,
      userName
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: containerRef.current,
      sharedLinks: [],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showPreJoinView: false,
      showLeaveRoomConfirmDialog: false,
      layout: 'Auto',
      showScreenSharingButton: true,
      showUserList: false,
      onLeaveRoom: () => {
        if (onEnd) onEnd();
      },
    });

    setSdkReady(true);

    return () => {
      try { zp.destroy(); } catch (_) {}
    };
  }, [sessionId, user]);

  if (credsMissing) {
    return (
      <div className="relative h-[60vh] md:h-full bg-black/60 rounded-[32px] overflow-hidden border border-amber-500/30 flex flex-col items-center justify-center gap-4 p-8">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl">!</div>
        <div className="text-center">
          <p className="text-white font-bold mb-1">ZegoCloud Credentials Missing</p>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs">
            Add <code className="text-amber-400 bg-black/30 px-1 rounded">NEXT_PUBLIC_ZEGO_APP_ID</code> and{' '}
            <code className="text-amber-400 bg-black/30 px-1 rounded">NEXT_PUBLIC_ZEGO_APP_SIGN</code> to your{' '}
            <code className="text-white/60">.env.local</code> file.
          </p>
          <a
            href="https://console.zegocloud.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-xs font-black uppercase tracking-widest text-amber-400 hover:text-white transition-colors"
          >
            Get Free API Keys &rarr;
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative h-[60vh] md:h-full rounded-[32px] overflow-hidden border border-white/10 shadow-2xl"
    />
  );
}
