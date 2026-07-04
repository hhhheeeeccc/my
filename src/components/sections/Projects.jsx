import React, { useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PROJECT_IMAGES = [
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1558494949-ef010ca7382f?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200',
];

function AnimatedCounter({ target, suffix = '' }) {
  const numRef = useRef(null);
  useEffect(() => {
    if (!numRef.current) return;
    const obj = { val: 0 };
    const el = numRef.current;
    gsap.to(obj, {
      val: target,
      duration: 2.5,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
      onUpdate: () => { if (el) el.textContent = String(Math.round(obj.val)).padStart(2, '0') + suffix; }
    });
  }, [target, suffix]);
  return <span ref={numRef}>00{suffix}</span>;
}

function LineDivider({ color, index }) {
  const lineRef = useRef(null);
  useEffect(() => {
    if (!lineRef.current) return;
    const path = lineRef.current.querySelector('line');
    if (!path) return;
    const length = path.getTotalLength ? path.getTotalLength() : 400;
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 2,
      ease: 'power3.inOut',
      scrollTrigger: { trigger: lineRef.current, start: 'top 90%' }
    });
  }, [index]);
  return (
    <svg ref={lineRef} className="w-full h-8 my-8" viewBox="0 0 1200 30" preserveAspectRatio="none" fill="none">
      <defs>
        <linearGradient id={`lineGrad${index}`} x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="50%" stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="0" y1="15" x2="1200" y2="15" stroke={`url(#lineGrad${index})`} strokeWidth="1" />
    </svg>
  );
}

function ProjectCard({ project, index, totalProjects }) {
  const { t } = useTranslation();
  const cardRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const tagsRef = useRef(null);
  const accent = useMemo(() => [
    { from: '#06b6d4', to: '#3b82f6' },
    { from: '#8b5cf6', to: '#d946ef' },
    { from: '#10b981', to: '#06b6d4' }
  ][index % 3], [index]);

  const { scrollYProgress } = useScroll({ target: cardRef, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = [titleRef.current, descRef.current, tagsRef.current].filter(Boolean);
      gsap.fromTo(els, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: cardRef.current, start: 'top 80%' } });
    }, cardRef);
    return () => ctx.revert();
  }, []);

  return (
    <motion.div ref={cardRef} style={{ scale }} className="relative mb-32 md:mb-48 last:mb-0 group">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className={`relative order-2 ${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
          <motion.div style={{ y }} className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
            <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-700" />
            <div className="absolute inset-0 bg-white/5 mix-blend-overlay" />
          </motion.div>
        </div>
        <div className={`order-1 ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl md:text-5xl font-black text-white/5 font-display"><AnimatedCounter target={index + 1} /></span>
          </div>
          <h3 ref={titleRef} className="text-4xl md:text-6xl font-display text-white leading-none tracking-tighter mb-8">{project.title}</h3>
          <div ref={descRef} className="mb-10 max-w-xl"><p className="text-base md:text-lg text-white/40 font-body leading-relaxed">{project.description}</p></div>
          <div ref={tagsRef} className="flex flex-wrap gap-3 mb-12">
            {project.tags.map((tag, j) => <span key={`tag-${project.id}-${j}`} className="px-3 py-1 text-[9px] font-black uppercase text-white/40 border border-white/5 rounded-full bg-white/[0.02]">{t(`projects.tags.${tag}`)}</span>)}
          </div>
          <div className="flex items-center gap-8">
            {project.links.github !== '#' && <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] font-black uppercase text-white/60 hover:text-white"><Github className="w-4 h-4" /><span>Source</span></a>}
            {project.links.demo !== '#' && <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] font-black uppercase text-white/60 hover:text-white"><ExternalLink className="w-4 h-4" /><span>Live</span></a>}
          </div>
        </div>
      </div>
      {index < totalProjects - 1 && <LineDivider color={accent.from} index={index} />}
    </motion.div>
  );
}

const Projects = () => {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef(null);
  const marqueeRef = useRef(null);
  const projects = useMemo(() => [
    { id: 'p1', title: t('projects.project1.title'), description: t('projects.project1.description'), image: PROJECT_IMAGES[0], tags: ['react', 'ts', 'go', 'arch'], links: { github: 'https://github.com/mattermost', demo: 'https://mattermost.com' } },
    { id: 'p2', title: t('projects.project2.title'), description: t('projects.project2.description'), image: PROJECT_IMAGES[1], tags: ['electron', 'networking', 'ts'], links: { github: '#', demo: '#' } },
    { id: 'p3', title: t('projects.project3.title'), description: t('projects.project3.description'), image: PROJECT_IMAGES[2], tags: ['uiohook', 'node', 'js'], links: { github: '#', demo: '#' } }
  ], [t]);

  const mqItems = useMemo(() => [0, 1, 2, 3], []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = marqueeRef.current?.querySelector('[data-marquee-track]');
      if (track) gsap.to(track, { xPercent: -50, ease: 'none', duration: 25, repeat: -1 });
    }, sectionRef);
    return () => ctx.revert();
  }, [i18n.language]);

  return (
    <section ref={sectionRef} id="projects" className="relative py-48 bg-transparent overflow-hidden">
      <div ref={marqueeRef} className="relative mb-32 overflow-hidden py-8 border-y border-white/[0.04] select-none">
        <div data-marquee-track className="flex whitespace-nowrap">
          {mqItems.map((i) => (
            <span key={`mq-span-${i}`} className="text-[6rem] md:text-[10rem] font-black text-white/[0.03] leading-none tracking-tight mx-4 font-display">
               FEATURED WORK SELECTED PROJECTS ENGINEERING EXCELLENCE
            </span>
          ))}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-32">
          <h2 className="text-5xl md:text-8xl font-display text-white leading-none tracking-tighter mb-10">{t('projects.title')}</h2>
          <p className="text-base md:text-xl text-white/40 font-body leading-relaxed max-w-2xl">{t('projects.intro')}</p>
        </div>
        <div className="flex flex-col">{projects.map((p, i) => <ProjectCard key={`pcard-${p.id}`} project={p} index={i} totalProjects={projects.length} />)}</div>
      </div>
    </section>
  );
};

export default Projects;
