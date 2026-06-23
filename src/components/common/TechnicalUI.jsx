import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';

const TechnicalUI = () => {
  const { scrollYProgress } = useScroll();
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [time, setTime] = useState('');

  useEffect(() => {
    const onMove = (e) => setCoords({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove);

    // Use a robust GSAP ticker or simple interval with guaranteed cleanup
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };

    const timer = setInterval(updateTime, 1000);
    updateTime();

    return () => {
      window.removeEventListener('mousemove', onMove);
      clearInterval(timer);
    };
  }, []);

  const op = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);

  return (
    <motion.div style={{ opacity: op }} className="fixed inset-0 pointer-events-none z-[60] overflow-hidden hidden md:block">
      <div className="absolute top-8 left-8 flex flex-col gap-1">
        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" /><span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500/80">System.Online</span></div>
        <div className="text-[9px] font-medium text-slate-500 tracking-widest uppercase">Latency: <span className="text-slate-300">0.04ms</span></div>
      </div>
      <div className="absolute top-8 right-8 flex flex-col items-end gap-1 text-right">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{time}</span>
        <span className="text-[9px] font-medium text-slate-600 tracking-[0.3em] uppercase">NEON_ENGINE_V4.2</span>
      </div>
      <div className="absolute bottom-8 left-8 flex items-center gap-3">
        <div className="flex flex-col"><span className="text-[8px] text-slate-600 uppercase font-bold tracking-tighter">X-Pos</span><span className="text-[11px] tabular-nums font-medium text-cyan-500/60">{coords.x}</span></div>
        <div className="w-px h-6 bg-white/10" />
        <div className="flex flex-col"><span className="text-[8px] text-slate-600 uppercase font-bold tracking-tighter">Y-Pos</span><span className="text-[11px] tabular-nums font-medium text-cyan-500/60">{coords.y}</span></div>
      </div>
      <div className="absolute bottom-8 right-8 flex flex-col items-end gap-1">
        <span className="text-[8px] text-slate-600 uppercase font-bold tracking-widest">Scroll_Depth</span>
        <div className="flex items-center gap-2"><span className="text-[11px] tabular-nums font-medium text-white/40">{Math.floor(scrollYProgress.get() * 100)}%</span><div className="w-24 h-0.5 bg-white/5 rounded-full overflow-hidden"><motion.div className="h-full bg-cyan-500/40" style={{ scaleX: scrollYProgress, transformOrigin: 'left' }} /></div></div>
      </div>
      <div className="absolute inset-20 border-white/[0.03] pointer-events-none">
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/10" /><div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/10" /><div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/10" /><div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/10" />
      </div>
      <motion.div animate={{ top: ['-10%', '110%'] }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }} className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent z-10" />
    </motion.div>
  );
};

export default TechnicalUI;
