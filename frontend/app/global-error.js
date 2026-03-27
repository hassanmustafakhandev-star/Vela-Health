'use client';
import { useEffect } from 'react';
import { AlertTriangle, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Attempt to log gracefully to a remote telemetry service in production
    console.error('CRITICAL UNHANDLED ERROR:', error);
  }, [error]);

  return (
    <html>
      <body className="bg-prism-bg flex items-center justify-center min-h-screen text-white">
        <div className="flex flex-col items-center bg-white/5 p-12 rounded-[40px] border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)] text-center max-w-lg mx-auto">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle size={32} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-display font-bold mb-4">A critical error occurred</h2>
          <p className="text-white/40 mb-8 max-w-sm">
            Our systems have captured the crash context securely. We apologize for the interruption to your medical workflow.
          </p>
          <div className="flex flex-col w-full gap-3">
            <button
              onClick={() => reset()}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl transition-colors tracking-widest text-sm uppercase"
            >
              Reinitialize Context
            </button>
            <Link href="/" className="bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl transition-colors tracking-widest text-sm uppercase font-bold flex items-center justify-center gap-2">
              <Home size={16} /> Return to Nexus
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
