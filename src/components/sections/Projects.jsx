import React, { useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Github, ExternalLink, ArrowUpRight, Code2, Globe, Monitor } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const C = {
  CONT: "w-[85vw] max-w-[1400px]",
  TEXT_M: "text-white/25 font-medium leading-relaxed",
  F_DISP: "font-display"
};

const padNum = (n) => (n + 1).toString().padStart(2, '0');

const ProjectIcon = ({ id }) => {
  const s = 48;
  if (id === 'p1') return <Globe size={s} className="text-blue-400" />;
  if (id === 'p2') return <Monitor size={s} className="text-cyan-400" />;
  return <Code2 size={s} className="text-violet-400" />;
};

const ActionButton = ({ icon: Icon }) => (
  <span className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white hover:bg-white/20 transition-colors">
    <Icon size={18} />
  </span>
);

const ProjectCard = ({ project, index }) => {
  const ref = useRef(null);
  const { scrollYProgress: sp } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const y = useTransform(sp, [0, 1], [-100, 100]);
  const rX = useTransform(sp, [0, 1], [5, -5]);
  const s = useTransform(sp, [0, 0.5, 1], [0.95, 1, 0.95]);
  const sT = useTransform(sp, [0.3, 0.7], ['-10%', '110%']);
  const sO = useTransform(sp, [0.3, 0.4, 0.6, 0.7], [0, 1, 1, 0]);

  return (
    <div ref={ref} className="project-card relative h-[150vh] w-full">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black px-6">
        <motion.div style={{ top: sT, opacity: sO }} className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent z-10 pointer-events-none" />

        <div className="relative w-full max-w-[1400px] aspect-[16/9] md:aspect-[21/9] group overflow-hidden rounded-[2rem] border border-white/[0.05] bg-slate-900/20 backdrop-blur-xl">
          <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${project.iconColor} mix-blend-overlay`} />
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div style={{ rotateX: rX, y, scale: s }} className="relative w-32 h-32 md:w-48 md:h-48 flex items-center justify-center">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 border border-dashed border-white/10 rounded-full" />
              <div className="relative z-10 p-10 bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-2xl transition-transform duration-700 group-hover:scale-110">
                <ProjectIcon id={project.id} />
              </div>
            </motion.div>
          </div>

          <div className="absolute inset-0 pointer-events-none opacity-40 text-white/20 p-10">
            <div className="text-[8px] font-bold tracking-widest uppercase mb-auto">Ref: {project.year} // 0{index + 1}</div>
            <div className="text-[8px] font-bold tracking-widest uppercase mt-auto text-right w-full absolute bottom-10 right-10">Status: Verified</div>
          </div>

          <span className={`absolute -bottom-6 -right-2 text-[12rem] md:text-[18rem] font-black text-white/[0.025] select-none leading-none pointer-events-none ${C.F_DISP}`}>{padNum(index)}</span>

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-700 flex items-end cursor-pointer">
            <div className="p-8 md:p-12 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out flex gap-4"><ActionButton icon={Github} /><ActionButton icon={ExternalLink} /></div>
          </div>
        </div>

        <div className={`${C.CONT} h-px my-6 md:my-8`} style={{ background: `linear-gradient(90deg, transparent, ${project.accentHex}40, transparent)`, transformOrigin: 'center' }} />

        <div className={`${C.CONT} flex flex-col md:flex-row items-start md:items-end justify-between gap-4 md:gap-8`}>
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">{project.year}</span>
              <span className="w-1 h-1 rounded-full bg-white/15" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: project.accentHex }}>{project.category}</span>
            </div>
            <h3 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1] tracking-tight ${C.F_DISP}`}>{project.title}</h3>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4">
            <div className="flex flex-wrap gap-2">{project.tags.map((tag) => <span key={`${project.id}-${tag}`} className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] rounded-full border border-white/5 bg-white/[0.03] text-white/40">{tag}</span>)}</div>
            <div className="flex items-center gap-6">
              <span className="group flex items-center gap-2 text-xs text-white/30 hover:text-white/70 font-medium transition-colors cursor-pointer"><Github size={14} />{project.sourceLabel}</span>
              <span className="group flex items-center gap-2 text-xs font-medium transition-colors cursor-pointer" style={{ color: project.accentHex }}><ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />{project.liveLabel}</span>
            </div>
          </div>
        </div>

        <p className={`${C.CONT} max-w-2xl mt-6 text-sm md:text-base ${C.TEXT_M}`}>{project.description}</p>
      </div>
    </div>
  );
};

const Projects = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  const projects = useMemo(() => [
    { id: 'p1', title: t('projects.project1.title'), description: t('projects.project1.description'), tags: [t('projects.tags.react'), t('projects.tags.ts'), t('projects.tags.go')], iconColor: 'from-blue-600 to-violet-600', accentHex: '#818cf8', year: '2024', category: 'WEB', sourceLabel: t('projects.sourceCode'), liveLabel: t('projects.liveDemo') },
    { id: 'p2', title: t('projects.project2.title'), description: t('projects.project2.description'), tags: [t('projects.tags.electron'), t('projects.tags.js'), t('projects.tags.node')], iconColor: 'from-cyan-500 to-emerald-500', accentHex: '#2dd4bf', year: '2024', category: 'DESKTOP', sourceLabel: t('projects.sourceCode'), liveLabel: t('projects.liveDemo') },
    { id: 'p3', title: t('projects.project3.title'), description: t('projects.project3.description'), tags: [t('projects.tags.react'), t('projects.tags.electron')], iconColor: 'from-violet-600 to-fuchsia-500', accentHex: '#c084fc', year: '2024', category: 'PERFORMANCE', sourceLabel: t('projects.sourceCode'), liveLabel: t('projects.liveDemo') }
  ], [t]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headerLines = headerRef.current?.querySelectorAll('[data-gsap-reveal]');
      if (headerLines?.length) {
        gsap.set(headerLines, { y: 100, opacity: 0 });
        gsap.to(headerLines, { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: headerRef.current, start: 'top 85%', end: 'top 30%', scrub: 1 } });
      }

      const cards = sectionRef.current?.querySelectorAll('.project-card');
      if (cards?.length) {
        for (let i = 0; i < cards.length - 1; i++) {
          const nextSticky = cards[i + 1]?.querySelector('.sticky');
          if (nextSticky) {
            gsap.fromTo(nextSticky, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', ease: 'none', scrollTrigger: { trigger: cards[i], start: '60% top', end: 'bottom top', scrub: 0.4 } });
          }
        }
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="relative bg-black">
      <div className="relative z-10 pt-48 pb-24 md:pb-32 text-center px-6">
        <div ref={headerRef} className="flex flex-col items-center">
          <div data-gsap-reveal className="flex items-center gap-4 mb-8"><div className="w-16 h-px bg-white/20" /><span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/30">{t('projects.subtitle')}</span><div className="w-16 h-px bg-white/20" /></div>
          <div data-gsap-reveal className="overflow-hidden"><h2 className={`text-5xl md:text-7xl lg:text-[8.5rem] font-black text-white tracking-tight leading-[0.85] ${C.F_DISP}`}>{t('projects.title')}</h2></div>
          <div data-gsap-reveal className="mt-8 max-w-xl"><p className={`text-base md:text-lg ${C.TEXT_M}`}>{t('projects.intro')}</p></div>
        </div>
      </div>
      {projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
      <div className="relative h-64"><div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950 pointer-events-none" /></div>
    </section>
  );
};

export default Projects;
