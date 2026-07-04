import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * TechnicalUI - Immersive FUI Overlay
 * - Interactive Brackets
 * - Cursor Coordinates
 * - Dynamic System Nodes
 * - Passive visual layer (pointer-events-none)
 */

const TechnicalUI = () => {
  const containerRef = useRef(null);
  const cursorRef = useRef(null);
  const coordsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;

        // Smooth cursor follow
        gsap.to(cursorRef.current, {
          x: clientX,
          y: clientY,
          duration: 0.5,
          ease: 'power2.out'
        });

        // Update coordinates text
        if (coordsRef.current) {
          coordsRef.current.innerText = `${Math.round(clientX)} / ${Math.round(clientY)}`;
        }
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] pointer-events-none select-none overflow-hidden"
    >
      {/* Corner Brackets - Global Static */}
      <div className="absolute top-8 left-8 w-12 h-12 border-l border-t border-white/10" />
      <div className="absolute top-8 right-8 w-12 h-12 border-r border-t border-white/10" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-l border-b border-white/10" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-r border-b border-white/10" />

      {/* Interactive Cursor Brackets */}
      <div
        ref={cursorRef}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none hidden lg:flex"
      >
        <div className="w-16 h-16 border border-white/5 rounded-full" />
        <div className="absolute w-2 h-2 bg-white/20 rounded-full" />

        {/* Real-time Data Label */}
        <div className="absolute top-10 left-10 flex flex-col items-start gap-1">
          <span className="text-[8px] tracking-[0.2em] text-white/20 uppercase font-black">Tracking</span>
          <span ref={coordsRef} className="text-[10px] tracking-widest text-white/40 font-mono">0 / 0</span>
        </div>
      </div>

      {/* Floating System Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-12">
        <div className="flex flex-col items-center gap-2">
          <div className="w-1 h-1 bg-white/20 rounded-full animate-pulse" />
          <span className="text-[8px] tracking-[0.4em] text-white/10 uppercase">System Active</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-1">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-[2px] h-3 bg-white/10" />
            ))}
          </div>
          <span className="text-[8px] tracking-[0.4em] text-white/10 uppercase">Data Stream</span>
        </div>
      </div>

      {/* Side Status Bars */}
      <div className="absolute top-1/2 left-8 -translate-y-1/2 flex flex-col gap-1 hidden xl:flex">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="w-1 h-[2px] bg-white/5" />
        ))}
      </div>
      <div className="absolute top-1/2 right-8 -translate-y-1/2 flex flex-col gap-1 hidden xl:flex">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="w-1 h-[2px] bg-white/5" />
        ))}
      </div>
    </div>
  );
};

export default TechnicalUI;
