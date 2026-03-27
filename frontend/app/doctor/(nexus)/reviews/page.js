'use client';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import { Star, MessageSquare, ThumbsUp, TrendingUp } from 'lucide-react';

const mockReviews = [
  { id: 1, patient: 'Hassan M.', rating: 5, comment: 'Exceptional care and diagnosis. The doctor was thorough and compassionate.', date: 'Mar 22, 2026', type: 'video' },
  { id: 2, patient: 'Zoya K.', rating: 5, comment: 'Quick to respond and very knowledgeable. Highly recommend!', date: 'Mar 18, 2026', type: 'clinic' },
  { id: 3, patient: 'Ahmed A.', rating: 4, comment: 'Professional and precise. Wait time could be reduced.', date: 'Mar 12, 2026', type: 'video' },
  { id: 4, patient: 'Sarah B.', rating: 5, comment: 'Best doctor I have visited. Will definitely return.', date: 'Mar 05, 2026', type: 'clinic' },
];

export default function DoctorReviews() {
  const avgRating = (mockReviews.reduce((s, r) => s + r.rating, 0) / mockReviews.length).toFixed(1);

  return (
    <div className="py-2">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h2 className="text-sm font-black text-prism-amber uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-prism-amber shadow-[0_0_10px_rgba(245,158,11,1)] animate-pulse" />
          Clinical Reputation
        </h2>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h1 className="text-4xl font-display font-medium text-white tracking-tight">
            Patient <span className="text-transparent bg-clip-text bg-gradient-to-r from-prism-amber to-white font-bold italic">Reviews.</span>
          </h1>
          <div className="flex gap-4">
            <GlassCard className="px-6 py-4 text-center border-prism-amber/20">
              <div className="flex items-center gap-2 justify-center mb-1">
                <Star size={18} className="text-prism-amber fill-prism-amber" />
                <span className="text-2xl font-bold text-white">{avgRating}</span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Avg Rating</p>
            </GlassCard>
            <GlassCard className="px-6 py-4 text-center border-prism-emerald/20">
              <div className="flex items-center gap-2 justify-center mb-1">
                <ThumbsUp size={18} className="text-prism-emerald" />
                <span className="text-2xl font-bold text-white">{mockReviews.length}</span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Total Reviews</p>
            </GlassCard>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4">
        {mockReviews.map((review, i) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <GlassCard glowColor="amber" className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-prism-amber/10 border border-prism-amber/20 flex items-center justify-center text-prism-amber flex-shrink-0">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-bold text-white">{review.patient}</p>
                      <Badge variant={review.type === 'video' ? 'cyan' : 'rose'} className="h-5 text-[9px] px-2">
                        {review.type}
                      </Badge>
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {[...Array(5)].map((_, si) => (
                        <Star key={si} size={12} className={si < review.rating ? 'text-prism-amber fill-prism-amber' : 'text-white/20'} />
                      ))}
                    </div>
                    <p className="text-sm text-white/50 leading-relaxed italic">&quot;{review.comment}&quot;</p>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20 flex-shrink-0 whitespace-nowrap">{review.date}</span>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
