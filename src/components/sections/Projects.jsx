import { useRef, useEffect, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── Data ─── */
const PROJECT_IMAGES = [
  'https://sfile.chatglm.cn/images-ppt/368fa9fefa27.png',
  'https://sfile.chatglm.cn/images-ppt/ffc85a6f9d93.png',
  'https://sfile.chatglm.cn/images-ppt/8f0d57436abd.png',
];
const PROJECT_TAGS = [
  ['react', 'ts', 'go', 'tailwind', 'arch'],
  ['electron', 'js', 'networking', 'proxy'],
  ['electron', 'js', 'perf', 'uiohook'],
];
const PROJECT_LINKS = [
  { github: 'https://github.com/hhhheeeeccc/jira' },
  { github: null, demo: null },
  { github: null, demo: null },
];
const PROJECT_ACCENTS = [
  { from: '#06b6d4', via: '#3b82f6', to: '#8b5cf6', glow: 'rgba(6,182,212,0.15)' },
  { from: '#8b5cf6', via: '#a855f7', to: '#d946ef', glow: 'rgba(139,92,246,0.15)' },
  { from: '#f59e0b', via: '#f97316', to: '#ef4444', glow: 'rgba(245,158,11,0.15)' },
];
const PROJECT_SHAPES = ['icosahedron', 'torus', 'octahedron'];

/* ─── 3D Tilt Card Hook ─── */
function useTilt3D(intensity = 12) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [intensity, -intensity]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-intensity, intensity]);

  const handleMove = useCallback((e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  }, [x, y]);

  const handleLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return { ref, rotateX, rotateY, handleMove, handleLeave, x, y };
}

/* ─── Cursor Spotlight ─── */
function CursorSpotlight({ x, y, color }) {
  return (
    <motion.div
      className="absolute inset-0 z-10 pointer-events-none rounded-2xl overflow-hidden"
      style={{ opacity: 0.6 }}
    >
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          x: useTransform(x, [-0.5, 0.5], [-250, 250]),
          y: useTransform(y, [-0.5, 0.5], [-250, 250]),
        }}
      />
    </motion.div>
  );
}

/* ─── 3D Rotating Shape (CSS) ─── */
function RotatingShape({ type, color, delay = 0 }) {
  const meshClass = "absolute w-16 h-16 md:w-24 md:h-24 opacity-[0.12]";

  const inner = (() => {
    switch (type) {
      case 'icosahedron':
        return (
          <div className={meshClass} style={{ animation: `floatSpin 12s ease-in-out infinite ${delay}s, floatBob 6s ease-in-out infinite ${delay}s`, top: '15%', right: '10%' }}>
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polygon points="50,5 95,30 95,70 50,95 5,70 5,30" fill="none" stroke={color} strokeWidth="0.5" />
              <polygon points="50,15 80,35 80,65 50,85 20,65 20,35" fill="none" stroke={color} strokeWidth="0.3" opacity="0.5" />
              <line x1="50" y1="5" x2="50" y2="95" stroke={color} strokeWidth="0.2" opacity="0.3" />
              <line x1="5" y1="30" x2="95" y2="70" stroke={color} strokeWidth="0.2" opacity="0.3" />
              <line x1="95" y1="30" x2="5" y2="70" stroke={color} strokeWidth="0.2" opacity="0.3" />
            </svg>
          </div>
        );
      case 'torus':
        return (
          <div className={meshClass} style={{ animation: `floatSpin 15s ease-in-out infinite ${delay}s, floatBob 7s ease-in-out infinite ${delay}s`, top: '20%', right: '8%' }}>
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <ellipse cx="50" cy="50" rx="40" ry="18" fill="none" stroke={color} strokeWidth="0.5" transform="rotate(-25 50 50)" />
              <ellipse cx="50" cy="50" rx="40" ry="18" fill="none" stroke={color} strokeWidth="0.3" opacity="0.4" transform="rotate(25 50 50)" />
              <ellipse cx="50" cy="50" rx="15" ry="35" fill="none" stroke={color} strokeWidth="0.3" opacity="0.3" />
            </svg>
          </div>
        );
      case 'octahedron':
        return (
          <div className={meshClass} style={{ animation: `floatSpin 10s ease-in-out infinite ${delay}s, floatBob 5s ease-in-out infinite ${delay}s`, top: '12%', right: '12%' }}>
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polygon points="50,5 90,50 50,95 10,50" fill="none" stroke={color} strokeWidth="0.5" />
              <line x1="50" y1="5" x2="50" y2="95" stroke={color} strokeWidth="0.2" opacity="0.4" />
              <line x1="10" y1="50" x2="90" y2="50" stroke={color} strokeWidth="0.2" opacity="0.4" />
              <line x1="50" y1="5" x2="10" y2="50" stroke={color} strokeWidth="0.15" opacity="0.3" />
              <line x1="50" y1="5" x2="90" y2="50" stroke={color} strokeWidth="0.15" opacity="0.3" />
              <line x1="10" y1="50" x2="50" y2="95" stroke={color} strokeWidth="0.15" opacity="0.3" />
              <line x1="90" y1="50" x2="50" y2="95" stroke={color} strokeWidth="0.15" opacity="0.3" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  })();

  return (
    <div className="absolute inset-0 pointer-events-none z-[2] overflow-hidden" style={{ perspective: '800px' }}>
      {inner}
    </div>
  );
}

/* ─── Animated Counter ─── */
function AnimatedCounter({ target, suffix = '' }) {
  const numRef = useRef(null);

  useEffect(() => {
    if (!numRef.current) return;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 2.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: numRef.current,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
      onUpdate: () => {
        if (numRef.current) {
          numRef.current.textContent = String(Math.round(obj.val)).padStart(2, '0') + suffix;
        }
      }
    });
  }, [target, suffix]);

  return <span ref={numRef}>00{suffix}</span>;
}

/* ─── Animated Line Divider ─── */
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
      scrollTrigger: {
        trigger: lineRef.current,
        start: 'top 90%',
        toggleActions: 'play none none none',
      }
    });
  }, []);

  return (
    <svg ref={lineRef} className="w-full h-8 my-8" viewBox="0 0 1200 30" preserveAspectRatio="none" fill="none">
      <defs>
        <linearGradient id={`lineGrad${index}`} x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="20%" stopColor={color} stopOpacity="0.4" />
          <stop offset="50%" stopColor={color} stopOpacity="0.6" />
          <stop offset="80%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="0" y1="15" x2="1200" y2="15" stroke={`url(#lineGrad${index})`} strokeWidth="1" />
    </svg>
  );
}

/* ─── Single Project Card ─── */
function ProjectCard({ project, index, totalProjects }) {
  const { t } = useTranslation();
  const isEven = index % 2 === 0;
  const cardRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const tagsRef = useRef(null);
  const numberRef = useRef(null);
  const imgContainerRef = useRef(null);

  const tilt = useTilt3D(6);
  const [isHovered, setIsHovered] = useState(false);
  const accent = PROJECT_ACCENTS[index];

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      // Main card reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 85%',
          end: 'top 25%',
          scrub: 1,
        }
      });

      tl.fromTo(cardRef.current,
        { y: 150, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' },
        0
      );

      // Image cinematic reveal (horizontal wipe)
      if (imgContainerRef.current) {
        const imgWrap = imgContainerRef.current;
        const wipeMask = imgWrap.querySelector('[data-wipe]');
        const img = imgWrap.querySelector('img');

        // Create wipe overlay
        tl.fromTo(wipeMask,
          { xPercent: isEven ? -100 : 100 },
          { xPercent: isEven ? 100 : -100, duration: 0.8, ease: 'power3.inOut' },
          0.15
        );

        tl.fromTo(img,
          { clipPath: isEven ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)', scale: 1.15 },
          { clipPath: 'inset(0 0% 0 0)', scale: 1, duration: 1, ease: 'power3.out' },
          0.2
        );
      }

      // Title characters animation
      if (titleRef.current) {
        const titleEl = titleRef.current;
        const text = titleEl.textContent;
        titleEl.innerHTML = text.split('').map((char, i) =>
          char === ' ' ? ' ' : `<span class="inline-block" style="display:inline-block">${char}</span>`
        ).join('');

        const chars = titleEl.querySelectorAll('span');
        gsap.set(chars, { y: 80, opacity: 0, rotateX: -90, transformOrigin: 'center bottom' });

        gsap.to(chars, {
          y: 0, opacity: 1, rotateX: 0,
          duration: 0.6,
          stagger: { each: 0.03, from: 'start' },
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: titleEl,
            start: 'top 90%',
            toggleActions: 'play none none none',
          }
        });
      }

      // Description lines reveal
      if (descRef.current) {
        const lines = descRef.current.querySelectorAll('[data-desc-line]');
        gsap.set(lines, { y: 30, opacity: 0 });
        gsap.to(lines, {
          y: 0, opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: descRef.current,
            start: 'top 88%',
            toggleActions: 'play none none none',
          }
        });
      }

      // Tags cascade
      if (tagsRef.current) {
        const tags = tagsRef.current.querySelectorAll('[data-tag]');
        gsap.set(tags, { y: 20, opacity: 0, scale: 0.8 });
        gsap.to(tags, {
          y: 0, opacity: 1, scale: 1,
          duration: 0.5,
          stagger: { each: 0.08, from: 'random' },
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: tagsRef.current,
            start: 'top 92%',
            toggleActions: 'play none none none',
          }
        });
      }

      // Number reveal
      if (numberRef.current) {
        gsap.fromTo(numberRef.current,
          { y: 50, opacity: 0, scale: 0.5 },
          { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: numberRef.current, start: 'top 90%', toggleActions: 'play none none none' }
          }
        );
      }

      // Parallax on image
      if (imgContainerRef.current) {
        gsap.to(imgContainerRef.current.querySelector('img'), {
          y: -25, scale: 1.03,
          ease: 'none',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          }
        });
      }

    }, cardRef);

    return () => ctx.revert();
  }, [index, isEven]);

  return (
    <motion.div
      ref={(node) => { cardRef.current = node; tilt.ref.current = node; }}
      data-project-card
      className="relative opacity-0"
      onMouseMove={tilt.handleMove}
      onMouseLeave={() => { tilt.handleLeave(); setIsHovered(false); }}
      onMouseEnter={() => setIsHovered(true)}
      style={{
        perspective: '1200px',
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Glow effect behind card */}
      <motion.div
        className="absolute -inset-4 rounded-3xl blur-3xl pointer-events-none z-0"
        animate={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(ellipse at ${isEven ? '30%' : '70%'} 50%, ${accent.glow} 0%, transparent 70%)`,
        }}
        transition={{ duration: 0.6 }}
      />

      <div className="relative z-10 bg-slate-950/60 backdrop-blur-sm rounded-2xl border border-white/[0.06] overflow-hidden transition-all duration-500"
        style={{
          boxShadow: isHovered
            ? `0 0 60px -15px ${accent.glow}, inset 0 1px 0 rgba(255,255,255,0.05)`
            : '0 0 0px transparent',
          borderColor: isHovered ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
        }}
      >
        {/* Cursor spotlight */}
        <CursorSpotlight x={tilt.x} y={tilt.y} color={accent.glow} />

        {/* 3D rotating shape */}
        <RotatingShape type={PROJECT_SHAPES[index]} color={accent.from} delay={index * 2} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Image Section */}
          <div
            ref={imgContainerRef}
            className={`relative overflow-hidden lg:col-span-7 ${isEven ? '' : 'lg:order-2'}`}
            style={{ minHeight: '320px' }}
          >
            <img
              src={project.image}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
              draggable={false}
              style={{ willChange: 'transform, clip-path' }}
            />

            {/* Cinematic wipe overlay */}
            <div
              data-wipe
              className="absolute inset-0 z-[5]"
              style={{ background: '#0a0a0f' }}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 z-[3] bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
            <div className={`absolute inset-0 z-[3] bg-gradient-to-r ${isEven ? 'from-transparent to-slate-950/40' : 'from-slate-950/40 to-transparent'} lg:block hidden`} />

            {/* Project number on image */}
            <div ref={numberRef} className={`absolute bottom-6 z-[6] ${isEven ? 'right-6' : 'left-6'}`}>
              <span
                className="text-[6rem] md:text-[8rem] font-black leading-none select-none"
                style={{
                  fontFamily: 'var(--font-display)',
                  background: `linear-gradient(135deg, ${accent.from}40, ${accent.to}40)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                <AnimatedCounter target={index + 1} />
              </span>
            </div>

            {/* Category badge */}
            <div className={`absolute top-6 z-[6] ${isEven ? 'left-6' : 'right-6'}`}>
              <motion.div
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border"
                style={{
                  background: 'rgba(10,10,15,0.6)',
                  backdropFilter: 'blur(12px)',
                  borderColor: `${accent.from}30`,
                }}
                whileHover={{ scale: 1.05, borderColor: `${accent.from}60` }}
                transition={{ duration: 0.3 }}
              >
                <motion.span
                  className="w-2 h-2 rounded-full"
                  style={{ background: `linear-gradient(135deg, ${accent.from}, ${accent.to})` }}
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50">
                  {project.category}
                </span>
              </motion.div>
            </div>

            {/* Shine effect on hover */}
            <motion.div
              className="absolute inset-0 z-[4] pointer-events-none"
              animate={{
                background: isHovered
                  ? `linear-gradient(${isEven ? '105deg' : '255deg'}, transparent 30%, ${accent.from}08 45%, ${accent.via}10 50%, ${accent.to}08 55%, transparent 70%)`
                  : 'transparent',
              }}
              transition={{ duration: 0.5 }}
              style={{ transform: 'translateX(-100%)' }}
            />
          </div>

          {/* Content Section */}
          <div className={`lg:col-span-5 p-8 md:p-12 lg:p-14 flex flex-col justify-center ${isEven ? '' : 'lg:order-1'}`}>
            {/* Project number (mobile) */}
            <div className="lg:hidden mb-4">
              <span
                className="text-4xl font-black"
                style={{
                  fontFamily: 'var(--font-display)',
                  background: `linear-gradient(135deg, ${accent.from}60, ${accent.to}60)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                <AnimatedCounter target={index + 1} />
              </span>
            </div>

            {/* Title */}
            <h3
              ref={titleRef}
              className="text-3xl sm:text-4xl md:text-[2.8rem] lg:text-[3.2rem] font-black text-white leading-[1.05] tracking-tight mb-6"
              style={{ fontFamily: 'var(--font-display)', perspective: '600px' }}
            >
              {project.title}
            </h3>

            {/* Description */}
            <div ref={descRef} className="mb-8">
              <p data-desc-line className="text-base md:text-[1.05rem] text-slate-400 font-medium leading-[1.75]">
                {project.description}
              </p>
            </div>

            {/* Tags */}
            <div ref={tagsRef} className="flex flex-wrap gap-2.5 mb-10">
              {project.tags.map((tag, j) => (
                <motion.span
                  key={j}
                  data-tag
                  className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider border cursor-default"
                  style={{
                    background: `${accent.from}08`,
                    borderColor: `${accent.from}20`,
                    color: `${accent.from}cc`,
                  }}
                  whileHover={{
                    background: `${accent.from}18`,
                    borderColor: `${accent.from}40`,
                    y: -2,
                    transition: { duration: 0.2 },
                  }}
                >
                  {t(`projects.tags.${tag}`)}
                </motion.span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              {project.links.github && (
                <motion.a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn inline-flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
                  style={{
                    background: `${accent.from}10`,
                    border: `1px solid ${accent.from}20`,
                    color: `${accent.from}dd`,
                  }}
                  whileHover={{
                    background: `${accent.from}20`,
                    borderColor: `${accent.from}40`,
                    y: -2,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Github className="w-4 h-4" />
                  <span>{t('projects.sourceCode')}</span>
                  <motion.span
                    className="inline-block"
                    initial={{ x: -4, opacity: 0 }}
                    whileHover={{ x: 0, opacity: 1 }}
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </motion.span>
                </motion.a>
              )}
              {project.links.demo && (
                <motion.a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold text-white/60 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white/90 transition-all duration-300"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{t('projects.liveDemo')}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </motion.a>
              )}
              {!project.links.github && !project.links.demo && (
                <motion.span
                  className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium text-white/25 border border-white/[0.04]"
                  animate={{ opacity: [0.25, 0.4, 0.25] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full bg-white/20"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  Private Project
                </motion.span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      {index < totalProjects - 1 && (
        <LineDivider color={accent.from} index={index} />
      )}
    </motion.div>
  );
}

/* ─── Main Projects Section ─── */
const Projects = () => {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const marqueeRef = useRef(null);

  const projects = [
    { title: t('projects.project1.title'), description: t('projects.project1.description'), category: 'WEB / ENTERPRISE', image: PROJECT_IMAGES[0], tags: PROJECT_TAGS[0], links: PROJECT_LINKS[0] },
    { title: t('projects.project2.title'), description: t('projects.project2.description'), category: 'DESKTOP / NETWORKING', image: PROJECT_IMAGES[1], tags: PROJECT_TAGS[1], links: PROJECT_LINKS[1] },
    { title: t('projects.project3.title'), description: t('projects.project3.description'), category: 'DESKTOP / PERFORMANCE', image: PROJECT_IMAGES[2], tags: PROJECT_TAGS[2], links: PROJECT_LINKS[2] },
  ];

  // Marquee text
  const marqueeText = '  FEATURED WORK  \u00A0\u00A0  SELECTED PROJECTS  \u00A0\u00A0  ENGINEERING EXCELLENCE  \u00A0\u00A0  ';

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header reveal
      const headerLines = headerRef.current?.querySelectorAll('[data-gsap-reveal]');
      if (headerLines?.length) {
        gsap.set(headerLines, { y: 60, opacity: 0 });
        gsap.to(headerLines, {
          y: 0, opacity: 1,
          duration: 1, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 80%', end: 'top 40%', scrub: 1 }
        });
      }

      // Infinite marquee
      if (marqueeRef.current) {
        const marqueeInner = marqueeRef.current.querySelector('[data-marquee-track]');
        if (marqueeInner) {
          gsap.to(marqueeInner, {
            xPercent: -50,
            ease: 'none',
            duration: 25,
            repeat: -1,
          });
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [i18n.language]);

  return (
    <section ref={sectionRef} id="projects" className="relative py-32 md:py-48 bg-transparent overflow-hidden">
      {/* Background number */}
      <div className="absolute top-16 right-8 md:right-16 text-[10rem] md:text-[14rem] font-black text-white/[0.015] leading-none select-none pointer-events-none" style={{ fontFamily: 'var(--font-display)' }}>
        03
      </div>

      {/* Marquee Banner */}
      <div ref={marqueeRef} className="relative mb-24 md:mb-36 overflow-hidden py-4 border-y border-white/[0.04] select-none">
        <div data-marquee-track className="flex whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-[4rem] md:text-[6rem] lg:text-[8rem] font-black text-white/[0.03] leading-none tracking-tight mx-2" style={{ fontFamily: 'var(--font-display)' }}>
              {marqueeText}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="mb-24 md:mb-36 flex flex-col items-center text-center">
          <div data-gsap-reveal className="flex items-center gap-4 mb-8">
            <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-cyan-500/60" />
            <span className="text-xs font-black uppercase tracking-[0.4em] text-cyan-400/70">{t('projects.subtitle')}</span>
            <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-cyan-500/60" />
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

        {/* Project Cards */}
        <div className="flex flex-col gap-6 md:gap-8">
          {projects.map((project, i) => (
            <ProjectCard
              key={i}
              project={project}
              index={i}
              totalProjects={projects.length}
            />
          ))}
        </div>
      </div>

      {/* Keyframe styles for 3D shapes */}
      <style>{`
        @keyframes floatSpin {
          0% { transform: rotateY(0deg) rotateX(0deg); }
          25% { transform: rotateY(90deg) rotateX(15deg); }
          50% { transform: rotateY(180deg) rotateX(0deg); }
          75% { transform: rotateY(270deg) rotateX(-15deg); }
          100% { transform: rotateY(360deg) rotateX(0deg); }
        }
        @keyframes floatBob {
          0%, 100% { transform: translateY(0px) rotateY(var(--ry, 0deg)); }
          50% { transform: translateY(-12px) rotateY(var(--ry, 0deg)); }
        }
      `}</style>
    </section>
  );
};

export default Projects;