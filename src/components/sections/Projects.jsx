import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ProjectCard = ({ project, idx }) => {
  const { t } = useTranslation();
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!cardRef.current) return;
    const card = cardRef.current;

    // GSAP scroll-driven entry
    gsap.fromTo(card,
      { y: 120, opacity: 0, scale: 0.95 },
      {
        y: 0, opacity: 1, scale: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          end: 'top 50%',
          scrub: 1,
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(tr => {
        if (tr.trigger === card) tr.kill();
      });
    };
  }, []);

  return (
    <motion.div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative cursor-pointer"
      style={{ perspective: '1200px' }}
    >
      <div className="relative overflow-hidden rounded-2xl bg-slate-900/50 border border-white/[0.06] backdrop-blur-sm transition-all duration-700 group-hover:border-white/[0.12]">
        {/* Image / Color header */}
        <div className="relative h-[280px] md:h-[360px] overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${project.iconColor} opacity-70 transition-all duration-1000 group-hover:scale-110 group-hover:opacity-90`} />

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />

          {/* Large number */}
          <motion.span
            className="absolute bottom-4 left-6 text-[8rem] md:text-[10rem] font-black text-white/[0.04] select-none leading-none pointer-events-none"
            style={{ fontFamily: 'var(--font-display)' }}
            animate={{ scale: isHovered ? 1.05 : 1, x: isHovered ? -10 : 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            0{idx + 1}
          </motion.span>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-end">
            <div className="p-6 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
              <div className="flex gap-3">
                <motion.span whileHover={{ scale: 1.1 }} className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white cursor-pointer hover:bg-white/20 transition-colors">
                  <Github size={18} />
                </motion.span>
                <motion.span whileHover={{ scale: 1.1 }} className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white cursor-pointer hover:bg-white/20 transition-colors">
                  <ExternalLink size={18} />
                </motion.span>
              </div>
            </div>
          </div>

          {/* Top-right arrow */}
          <motion.div
            className="absolute top-5 right-5"
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8, rotate: isHovered ? 0 : -45 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <ArrowUpRight size={16} className="text-white" />
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-7 md:p-9">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {project.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] rounded-full bg-white/[0.04] text-slate-500 border border-white/[0.04]">
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="text-xl md:text-2xl font-black text-white mb-3 group-hover:text-cyan-300 transition-colors duration-500">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-slate-500 leading-relaxed font-medium text-sm line-clamp-2 group-hover:text-slate-400 transition-colors duration-500">
            {project.description}
          </p>

          {/* Bottom links */}
          <div className="mt-7 pt-5 border-t border-white/[0.06] flex items-center justify-between">
            <div className="flex gap-5">
              <a href="#" className="flex items-center gap-2 text-xs text-slate-500 hover:text-cyan-400 transition-colors font-medium">
                <Github size={14} /> {t('projects.sourceCode')}
              </a>
              <a href="#" className="flex items-center gap-2 text-xs text-cyan-400/70 hover:text-cyan-300 transition-colors font-bold">
                <ExternalLink size={14} /> {t('projects.liveDemo')}
              </a>
            </div>
            <motion.div
              className="text-slate-600 group-hover:text-cyan-400 transition-colors"
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowUpRight size={18} />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    iconColor: PropTypes.string.isRequired
  }).isRequired,
  idx: PropTypes.number.isRequired,
};

const Projects = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headerLines = headerRef.current?.querySelectorAll('[data-gsap-reveal]');
      if (headerLines?.length) {
        gsap.set(headerLines, { y: 60, opacity: 0 });
        gsap.to(headerLines, {
          y: 0, opacity: 1,
          duration: 1,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 1,
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const projects = [1, 2, 3].map(i => ({
    title: t(`projects.project${i}.title`),
    description: t(`projects.project${i}.description`),
    tags: i === 1 ? [t('projects.tags.react'), t('projects.tags.ts'), t('projects.tags.go'), t('projects.tags.tailwind'), t('projects.tags.arch')] :
          i === 2 ? [t('projects.tags.electron'), t('projects.tags.js'), t('projects.tags.node'), t('projects.tags.networking'), t('projects.tags.proxy')] :
          [t('projects.tags.react'), t('projects.tags.electron'), t('projects.tags.node'), t('projects.tags.uiohook'), t('projects.tags.perf')],
    iconColor: i === 1 ? "from-blue-600 via-indigo-600 to-violet-600" : i === 2 ? "from-cyan-500 via-blue-500 to-indigo-500" : "from-violet-600 via-purple-600 to-blue-600"
  }));

  return (
    <section ref={sectionRef} id="projects" className="relative py-48 bg-transparent overflow-hidden">
      {/* Background number */}
      <div className="absolute top-16 left-8 md:left-16 text-[10rem] md:text-[14rem] font-black text-white/[0.015] leading-none select-none pointer-events-none" style={{ fontFamily: 'var(--font-display)' }}>
        03
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center">
          {/* Header */}
          <div ref={headerRef} className="mb-36 flex flex-col items-center text-center">
            <div data-gsap-reveal className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-blue-500/60" />
              <span className="text-xs font-black uppercase tracking-[0.4em] text-blue-400/70">{t('projects.subtitle')}</span>
              <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-blue-500/60" />
            </div>
            <div data-gsap-reveal className="overflow-hidden">
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[0.9]" style={{ fontFamily: 'var(--font-display)' }}>
                {t('projects.title')}
              </h2>
            </div>
            <div data-gsap-reveal className="mt-10 max-w-3xl">
              <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed">
                {t('projects.intro')}
              </p>
            </div>
          </div>

          {/* Project grid */}
          <div className="w-full">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {projects.slice(0, 2).map((p, i) => (
                <ProjectCard key={i} project={p} idx={i} />
              ))}
            </div>
            <div className="max-w-2xl mx-auto">
              <ProjectCard project={projects[2]} idx={2} />
            </div>
          </div>

          {/* View more */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-24"
          >
            <motion.a
              href="#"
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.96 }}
              className="group inline-flex items-center gap-4 px-14 py-5 rounded-full bg-white/[0.04] text-white text-[13px] font-black tracking-[0.15em] uppercase border border-white/[0.08] hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-700"
            >
              <span>{t('projects.viewMore')}</span>
              <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default Projects;