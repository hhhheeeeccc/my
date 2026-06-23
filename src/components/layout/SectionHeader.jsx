import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SectionHeader = ({ subtitle, title, intro, center = true, accentColor = 'cyan' }) => {
  const headerRef = useRef(null);

  useEffect(() => {
    if (!headerRef.current) return;
    const items = headerRef.current.querySelectorAll('[data-header-item]');
    if (!items.length) return;

    gsap.set(items, { y: 50, opacity: 0 });
    gsap.to(items, {
      y: 0, opacity: 1,
      duration: 0.9,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: headerRef.current,
        start: 'top 82%',
        end: 'top 45%',
        scrub: 1,
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(tr => {
        if (tr.trigger === headerRef.current) tr.kill();
      });
    };
  }, []);

  const colorMap = {
    cyan: { line: 'from-transparent to-cyan-500/60', text: 'text-cyan-400/70' },
    violet: { line: 'from-transparent to-violet-500/60', text: 'text-violet-400/70' },
    blue: { line: 'from-transparent to-blue-500/60', text: 'text-blue-400/70' },
    emerald: { line: 'from-transparent to-emerald-500/60', text: 'text-emerald-400/70' },
  };

  const colors = colorMap[accentColor] || colorMap.cyan;

  return (
    <div
      ref={headerRef}
      className={`${center ? 'text-center items-center' : 'text-start items-start'} mb-36 flex flex-col`}
    >
      <div
        data-header-item
        className={`flex items-center gap-4 mb-8 ${center ? 'justify-center' : ''}`}
      >
        <div className={`w-12 h-[2px] bg-gradient-to-r ${colors.line}`} />
        <span className={`text-xs font-black uppercase tracking-[0.4em] ${colors.text}`}>
          {subtitle}
        </span>
        {center && <div className={`w-12 h-[2px] bg-gradient-to-l ${colors.line}`} />}
      </div>
      <div data-header-item className="overflow-hidden">
        <h2
          className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[0.9]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h2>
      </div>
      <div data-header-item className="mt-10 max-w-3xl">
        <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed">
          {intro}
        </p>
      </div>
    </div>
  );
};

SectionHeader.propTypes = {
  subtitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  intro: PropTypes.string.isRequired,
  center: PropTypes.bool,
  accentColor: PropTypes.string,
};

export default SectionHeader;