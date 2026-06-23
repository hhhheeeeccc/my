import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PANEL_HEIGHT = '220vh';

const Projects = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const [activeProject, setActiveProject] = useState(0);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 90, damping: 24, mass: 0.4 });
  const smoothY = useSpring(pointerY, { stiffness: 90, damping: 24, mass: 0.4 });
  const previewRotateY = useTransform(smoothX, [-200, 200], [-12, 12]);
  const previewRotateX = useTransform(smoothY, [-160, 160], [10, -10]);

  const projects = useMemo(() => [1, 2, 3].map((i) => ({
    title: t(`projects.project${i}.title`),
    description: t(`projects.project${i}.description`),
    tags:
      i === 1
        ? [t('projects.tags.react'), t('projects.tags.ts'), t('projects.tags.go'), t('projects.tags.tailwind'), t('projects.tags.arch')]
        : i === 2
          ? [t('projects.tags.electron'), t('projects.tags.js'), t('projects.tags.node'), t('projects.tags.networking'), t('projects.tags.proxy')]
          : [t('projects.tags.react'), t('projects.tags.electron'), t('projects.tags.node'), t('projects.tags.uiohook'), t('projects.tags.perf')],
    iconColor:
      i === 1 ? 'from-blue-600 via-indigo-600 to-violet-600'
      : i === 2 ? 'from-cyan-500 via-teal-500 to-emerald-500'
      : 'from-violet-600 via-purple-600 to-fuchsia-500',
    accentHex: i === 1 ? '#818cf8' : i === 2 ? '#2dd4bf' : '#c084fc',
    year: '2024',
    category: i === 1 ? 'WEB / ENTERPRISE' : i === 2 ? 'DESKTOP / NETWORKING' : 'DESKTOP / PERFORMANCE',
    metric: i === 1 ? 'ARCHITECTED PRODUCT SYSTEMS' : i === 2 ? 'REAL-TIME NETWORK TOOLS' : 'LOW-LATENCY DESKTOP UX',
  })), [t]);

  const handlePointerMove = useCallback((event) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointerX.set(event.clientX - rect.left - rect.width / 2);
    pointerY.set(event.clientY - rect.top - rect.height / 2);
  }, [pointerX, pointerY]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headerLines = headerRef.current?.querySelectorAll('[data-gsap-reveal]');
      if (headerLines?.length) {
        gsap.set(headerLines, { y: 90, opacity: 0, rotateX: 18, transformOrigin: '50% 100%' });
        gsap.to(headerLines, {
          y: 0, opacity: 1, rotateX: 0,
          duration: 1.2, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 82%', end: 'top 35%', scrub: 1 },
        });
      }

      gsap.utils.toArray('.work-index-row').forEach((row, index) => {
        gsap.fromTo(row,
          { opacity: 0.22, xPercent: index % 2 ? 6 : -6 },
          {
            opacity: 1, xPercent: 0, ease: 'none',
            scrollTrigger: { trigger: row, start: 'top 86%', end: 'bottom 45%', scrub: 0.8 },
          }
        );
      });

      const panels = sectionRef.current?.querySelectorAll('.at-panel');
      if (!panels?.length) return;

      panels.forEach((panel) => {
        const visual = panel.querySelector('.at-visual-inner');
        const textGroup = panel.querySelector('.at-text-group');
        const mediaLayers = panel.querySelectorAll('.at-media-layer');

        if (visual) {
          gsap.fromTo(visual,
            { scale: 1.08, rotateY: -8, filter: 'blur(0px)' },
            {
              scale: 0.82, rotateY: 8, y: -80, opacity: 0.42, filter: 'blur(2px)', ease: 'none',
              scrollTrigger: { trigger: panel, start: 'top top', end: 'bottom top', scrub: 0.35 },
            }
          );
        }

        if (mediaLayers.length) {
          gsap.to(mediaLayers, {
            yPercent: (i) => (i + 1) * -12,
            ease: 'none',
            scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
          });
        }

        if (textGroup) {
          gsap.fromTo(textGroup,
            { y: 160, opacity: 0 },
            { y: -90, opacity: 1, ease: 'none', scrollTrigger: { trigger: panel, start: 'top top', end: 'bottom top', scrub: 0.35 } }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const pad = (n) => String(n + 1).padStart(2, '0');
  const active = projects[activeProject] ?? projects[0];

  return (
    <section ref={sectionRef} id="projects" className="relative bg-[#030409] overflow-hidden" onPointerMove={handlePointerMove}>
      <div className="work-noise-field" aria-hidden="true" />
      <motion.div
        aria-hidden="true"
        className="work-hover-preview hidden lg:block"
        style={{ x: smoothX, y: smoothY, rotateX: previewRotateX, rotateY: previewRotateY }}
      >
        <div className={`work-hover-preview__media bg-gradient-to-br ${active?.iconColor || ''}`}>
          <span>{pad(activeProject)}</span>
        </div>
      </motion.div>

      <div className="min-h-screen flex items-end px-6 md:px-14 pb-10 md:pb-16 relative z-10">
        <div ref={headerRef} className="w-full">
          <div data-gsap-reveal className="flex items-center justify-between gap-6 border-b border-white/10 pb-5 mb-8">
            <span className="text-[11px] md:text-xs font-black uppercase tracking-[0.48em] text-white/45">{isAr ? 'أعمال مختارة' : 'Selected work'}</span>
            <span className="text-[11px] md:text-xs font-black uppercase tracking-[0.48em] text-cyan-300/70">{projects.length.toString().padStart(2, '0')} CASES</span>
          </div>
          <div data-gsap-reveal className="overflow-hidden">
            <h2 className="work-mega-title">{t('projects.title')}</h2>
          </div>
          <p data-gsap-reveal className="max-w-3xl mt-8 text-white/50 text-lg md:text-2xl leading-relaxed">
            {isAr ? 'قسم أعمال بتجربة قريبة من Active Theory: شاشة كاملة، حركة 3D، تغذية بصرية عند المرور، وانتقالات سينمائية أثناء التمرير.' : 'A full-screen work index with Active Theory-like rhythm: oversized typography, 3D hover feedback, cinematic scroll motion, and layered visual energy.'}
          </p>
        </div>
      </div>

      <div className="relative z-10 border-y border-white/10">
        {projects.map((project, i) => (
          <button
            key={project.title}
            type="button"
            className="work-index-row group"
            onMouseEnter={() => setActiveProject(i)}
            onFocus={() => setActiveProject(i)}
          >
            <span className="work-index-row__number">{pad(i)}</span>
            <span className="work-index-row__title">{project.title}</span>
            <span className="work-index-row__meta">{project.category}</span>
          </button>
        ))}
      </div>

      {projects.map((project, i) => (
        <div key={`${project.title}-panel`} className="at-panel relative" style={{ height: PANEL_HEIGHT }}>
          <div className="at-sticky sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden" style={{ zIndex: 10 + i }}>
            <div className="w-full max-w-[1500px] mx-auto px-6 md:px-14 grid lg:grid-cols-[1.25fr_0.75fr] items-center gap-10 lg:gap-20">
              <div className="at-visual-inner work-card-3d">
                <div className="work-cinematic-frame" style={{ boxShadow: `0 45px 140px -28px ${project.accentHex}66` }}>
                  <div className={`at-media-layer absolute inset-0 bg-gradient-to-br ${project.iconColor}`} />
                  <div className="at-media-layer work-cinematic-grid" />
                  <div className="at-media-layer work-cinematic-orb work-cinematic-orb-a" />
                  <div className="at-media-layer work-cinematic-orb work-cinematic-orb-b" />
                  <div className="work-cinematic-scan" />
                  <span className="work-cinematic-number">{pad(i)}</span>
                  <span className="work-cinematic-label">{project.metric}</span>
                </div>
              </div>

              <div className="at-text-group">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500">{project.year}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-700" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: project.accentHex }}>{project.category}</span>
                </div>
                <h3 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[0.9]" style={{ fontFamily: 'var(--font-display)' }}>{project.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium text-base md:text-lg mb-9 max-w-md">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-9">
                  {project.tags.map((tag) => <span key={tag} className="work-tag" style={{ color: project.accentHex, borderColor: `${project.accentHex}26` }}>{tag}</span>)}
                </div>
                <div className="flex items-center gap-8">
                  <span role="button" tabIndex={0} className="work-link"><Github size={14} />{t('projects.sourceCode')}</span>
                  <span role="button" tabIndex={0} className="work-link" style={{ color: project.accentHex }}><ExternalLink size={14} />{t('projects.liveDemo')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Projects;
