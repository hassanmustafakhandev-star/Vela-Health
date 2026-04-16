'use client';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Printer, Download, X, Stethoscope } from 'lucide-react';
import { usePrescriptionStore } from '@/store/doctor/prescriptionStore';
import { useDoctorAuthStore } from '@/store/doctor/doctorAuthStore';
import { VelaLogoFull } from '@/components/brand/VelaLogo';

/**
 * PrescriptionPreview
 * Renders a print-ready preview of the current prescription being built.
 * Props:
 *  - patientName: string
 *  - onClose: fn() — called to dismiss the preview
 */
export default function PrescriptionPreview({ patientName = 'Patient', onClose }) {
  const { diagnosis, medicines, advice } = usePrescriptionStore();
  const doctorProfile = useDoctorAuthStore((s) => s.doctorProfile);
  const printRef = useRef(null);

  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head>
          <title>Vela Rx — ${patientName}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Arial', sans-serif; padding: 40px; color: #111; background: #fff; }
            .rx-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #06b6d4; padding-bottom: 20px; margin-bottom: 20px; }
            .rx-title { font-size: 22px; font-weight: bold; }
            .rx-sub { font-size: 12px; color: #666; margin-top: 4px; }
            .rx-symbol { font-size: 60px; color: #06b6d4; font-weight: 900; }
            .section { margin-bottom: 20px; }
            .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #06b6d4; font-weight: 900; margin-bottom: 8px; }
            .diagnosis { font-size: 18px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; }
            th { background: #f5f5f5; padding: 8px 12px; text-align: left; font-size: 11px; text-transform: uppercase; color: #888; }
            td { padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 14px; }
            .advice { background: #f9f9f9; padding: 12px; border-left: 3px solid #06b6d4; font-style: italic; font-size: 13px; }
            .footer { margin-top: 40px; border-top: 1px solid #ddd; padding-top: 16px; display: flex; justify-content: space-between; font-size: 11px; color: #aaa; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4"
    >
      <div className="bg-prism-surface border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h3 className="text-sm font-black uppercase tracking-widest text-white">Prescription Preview</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 h-9 px-4 rounded-xl bg-prism-cyan/10 border border-prism-cyan/30 text-prism-cyan text-xs font-bold hover:bg-prism-cyan/20 transition-all"
            >
              <Printer size={14} /> Print
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Content */}
        <div className="overflow-y-auto flex-1 p-6">
          <div
            ref={printRef}
            className="bg-white text-black rounded-2xl p-8 min-h-[500px] font-sans"
          >
            {/* Rx Header */}
            <div className="rx-header flex justify-between items-start border-b-2 border-cyan-500 pb-5 mb-6">
              <div>
                <div className="text-xl font-black text-black tracking-tight">Vela Health Nexus</div>
                <div className="text-sm text-gray-500 mt-1">
                  {doctorProfile?.name || 'Specialist Physician'} 
                  {doctorProfile?.specialization ? ` · ${doctorProfile.specialization}` : ''}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  PMDC: {doctorProfile?.pmdc_number || 'Verified'} · Issued: {today}
                </div>
              </div>
              <div className="text-6xl font-black text-cyan-500 leading-none">℞</div>
            </div>

            {/* Patient */}
            <div className="mb-5">
              <div className="text-[10px] uppercase tracking-[0.3em] text-cyan-500 font-black mb-1">Patient</div>
              <div className="text-lg font-bold">{patientName}</div>
            </div>

            {/* Diagnosis */}
            {diagnosis && (
              <div className="mb-6">
                <div className="text-[10px] uppercase tracking-[0.3em] text-cyan-500 font-black mb-1">Clinical Diagnosis</div>
                <div className="text-base font-bold">{diagnosis}</div>
              </div>
            )}

            {/* Medications Table */}
            {medicines.length > 0 && (
              <div className="mb-6">
                <div className="text-[10px] uppercase tracking-[0.3em] text-cyan-500 font-black mb-3">Medications</div>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-2 text-[10px] uppercase tracking-widest text-gray-400 font-black">#</th>
                      <th className="text-left p-2 text-[10px] uppercase tracking-widest text-gray-400 font-black">Medicine</th>
                      <th className="text-left p-2 text-[10px] uppercase tracking-widest text-gray-400 font-black">Dosage</th>
                      <th className="text-left p-2 text-[10px] uppercase tracking-widest text-gray-400 font-black">Frequency</th>
                      <th className="text-left p-2 text-[10px] uppercase tracking-widest text-gray-400 font-black">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicines.map((med, i) => (
                      <tr key={med.id} className="border-b border-gray-100">
                        <td className="p-2 text-sm text-gray-400">{i + 1}</td>
                        <td className="p-2 text-sm font-bold">{med.name || '—'}</td>
                        <td className="p-2 text-sm">{med.dosage || '—'}</td>
                        <td className="p-2 text-sm">{med.frequency || '—'}</td>
                        <td className="p-2 text-sm">{med.duration || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Advice */}
            {advice && (
              <div className="mb-6">
                <div className="text-[10px] uppercase tracking-[0.3em] text-cyan-500 font-black mb-2">Clinical Advice</div>
                <div className="bg-gray-50 border-l-4 border-cyan-400 p-3 text-sm italic text-gray-600">{advice}</div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-10 border-t border-gray-200 pt-4 flex justify-between items-center">
              <span className="text-xs text-gray-400">Generated by Vela Health Platform</span>
              <div className="flex flex-col items-end">
                <div className="w-32 border-t border-gray-400 mb-1" />
                <span className="text-xs text-gray-400">Doctor&apos;s Signature</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}