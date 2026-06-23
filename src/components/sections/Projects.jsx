import React, { useRef, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Github, ArrowUpRight } from 'lucide-react';
import Magnetic from '../common/Magnetic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ProjectCard = ({ project, index, total }) => {
  const { t } = useTranslation();
  const cardRef = useRef(null);
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const overlayTextRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Parallax for image on mouse move
  const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 50, damping: 20 });

  const imgX = useTransform(mouseX, [-0.5, 0.5], [-20, 20]);
  const imgY = useTransform(mouseY, [-0.5, 0.5], [-20, 20]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - left) / width - 0.5);
    mouseY.set((e.clientY - top) / height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div ref={containerRef} className="project-card relative h-[100vh] w-full bg-black">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="relative w-full max-w-[1600px] grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">

          {/* Project Media Container */}
          <motion.div
            style={{ scale, opacity }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative group aspect-[16/10] w-full rounded-2xl md:rounded-[2.5rem] overflow-hidden cursor-none bg-slate-900/50 border border-white/5"
          >
            <motion.div
              style={{ x: imgX, y: imgY, scale: 1.1 }}
              className="absolute inset-0 w-full h-full"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${project.iconColor} opacity-20 group-hover:opacity-40 transition-opacity duration-1000`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[120px] h-[120px] md:w-[200px] md:w-[200px] relative">
                   <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl animate-pulse" />
                   <div className="relative z-10 w-full h-full flex items-center justify-center text-white/10 font-black text-8xl md:text-[12rem] select-none italic tracking-tighter">
                      0{index + 1}
                   </div>
                </div>
              </div>
            </motion.div>

            {/* Hover Reveal HUD */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col items-center justify-center">
               <div className="text-white/40 text-[10px] tracking-[0.6em] uppercase font-black mb-4">Click to Explore</div>
               <div className="w-16 h-px bg-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
            </div>
          </motion.div>

          {/* Project Info */}
          <div className="flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-6 mb-8"
            >
              <span className="text-white/20 text-sm font-black tracking-widest">{project.year}</span>
              <div className="w-8 h-px bg-white/10" />
              <span className="text-[10px] font-black tracking-[0.4em] uppercase" style={{ color: project.accentHex }}>{project.category}</span>
            </motion.div>

            <h3 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.85] mb-10 overflow-hidden" style={{ fontFamily: 'var(--font-display)' }}>
              {project.title}
            </h3>

            <div className="flex flex-wrap gap-4 mb-12">
              {project.tags.map((tag, ti) => (
                <span key={ti} className="px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border transition-all hover:bg-white/5" style={{ color: project.accentHex, borderColor: project.accentHex + '30' }}>
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-12">
              <Magnetic>
                <span className="group flex items-center gap-3 text-sm text-white/40 hover:text-white transition-colors cursor-pointer font-bold tracking-[0.2em] uppercase">
                  <Github size={18} /> {project.viewSourceLabel}
                </span>
              </Magnetic>
              <Magnetic>
                <span className="group flex items-center gap-4 text-sm font-black tracking-[0.2em] transition-colors cursor-pointer uppercase" style={{ color: project.accentHex }}>
                  {project.viewLiveLabel}
                  <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </span>
              </Magnetic>
            </div>
          </div>
        </div>

        {/* Cinematic Description Overlay */}
        <motion.p
          style={{ y, opacity }}
          className="w-full max-w-4xl mt-20 text-base md:text-xl text-white/40 font-medium leading-relaxed italic text-center px-4"
        >
          {project.description}
        </motion.p>
      </div>
    </div>
  );
};

const Projects = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  const projects = useMemo(() => [1, 2, 3].map((i) => ({
    title: t(`projects.project${i}.title`),
    description: t(`projects.project${i}.description`),
    tags: i === 1 ? [t('projects.tags.react'), t('projects.tags.ts'), t('projects.tags.go')] : i === 2 ? [t('projects.tags.electron'), t('projects.tags.js'), t('projects.tags.node')] : [t('projects.tags.react'), t('projects.tags.electron'), t('projects.tags.perf')],
    iconColor: i === 1 ? 'from-blue-600 via-indigo-600 to-violet-600' : i === 2 ? 'from-cyan-500 via-teal-500 to-emerald-500' : 'from-violet-600 via-purple-600 to-fuchsia-500',
    accentHex: i === 1 ? '#818cf8' : i === 2 ? '#2dd4bf' : '#c084fc',
    year: '2024',
    category: i === 1 ? 'WEB ARCHITECTURE' : i === 2 ? 'SYSTEM INTERFACE' : 'CORE ENGINE',
    viewSourceLabel: t('projects.sourceCode'),
    viewLiveLabel: t('projects.liveDemo'),
  })), [t]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headerLines = headerRef.current?.querySelectorAll('[data-gsap-reveal]');
      if (headerLines?.length) {
        gsap.set(headerLines, { y: 120, opacity: 0 });
        gsap.to(headerLines, {
          y: 0, opacity: 1,
          duration: 1.5, stagger: 0.2, ease: 'power4.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 90%', end: 'bottom 40%', scrub: 1 }
        });
      }

      const cards = sectionRef.current?.querySelectorAll('.project-card');
      cards?.forEach((current, i) => {
        const next = cards[i + 1];
        if (next) {
          const nextSticky = next.querySelector('.sticky');
          // Clip-path reveal transition
          gsap.fromTo(nextSticky, { clipPath: 'inset(100% 0 0 0)' }, {
            clipPath: 'inset(0% 0 0 0)',
            ease: 'none',
            scrollTrigger: {
               trigger: current,
               start: '40% top',
               end: 'bottom top',
               scrub: true,
               onUpdate: (self) => {
                  // Emit interaction event for 3D glitch
                  if (self.progress > 0.1 && self.progress < 0.9) {
                     window.dispatchEvent(new CustomEvent('ui-focus', { detail: { focus: true, click: true } }));
                  }
               }
            }
          });
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="relative bg-black">
      <div className="relative z-10 pt-64 pb-32">
        <div ref={headerRef} className="flex flex-col items-center text-center px-6">
          <div data-gsap-reveal className="flex items-center gap-6 mb-12">
            <div className="w-24 h-px bg-gradient-to-r from-transparent to-cyan-400" />
            <span className="text-xs font-black uppercase tracking-[0.6em] text-cyan-400">{t('projects.subtitle')}</span>
            <div className="w-24 h-px bg-gradient-to-l from-transparent to-cyan-400" />
          </div>
          <div data-gsap-reveal className="overflow-hidden mb-12">
            <h2 className="text-6xl md:text-8xl lg:text-[12rem] font-black text-white tracking-tighter leading-[0.8]" style={{ fontFamily: 'var(--font-display)' }}>
              {t('projects.title')}
            </h2>
          </div>
          <div data-gsap-reveal className="max-w-2xl">
            <p className="text-lg md:text-2xl text-white/30 font-medium leading-relaxed italic">{t('projects.intro')}</p>
          </div>
        </div>
      </div>

      {projects.map((project, i) => <ProjectCard key={i} project={project} index={i} total={projects.length} />)}

      <div className="relative h-[50vh] bg-gradient-to-b from-black to-slate-950 pointer-events-none" />
    </section>
  );
};

export default Projects;
