import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

const Projects = () => {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef(null);

  const projects = [
    {
      title: t('projects.project1.title'),
      description: t('projects.project1.description'),
      category: 'WEB / ENTERPRISE',
      image: PROJECT_IMAGES[0],
      tags: PROJECT_TAGS[0],
      links: PROJECT_LINKS[0],
      accent: 'from-cyan-500/20 via-blue-500/10 to-violet-500/20',
      tagBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
      lineColor: 'from-cyan-500 to-violet-500',
    },
    {
      title: t('projects.project2.title'),
      description: t('projects.project2.description'),
      category: 'DESKTOP / NETWORKING',
      image: PROJECT_IMAGES[1],
      tags: PROJECT_TAGS[1],
      links: PROJECT_LINKS[1],
      accent: 'from-violet-500/20 via-purple-500/10 to-fuchsia-500/20',
      tagBg: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
      lineColor: 'from-violet-500 to-fuchsia-500',
    },
    {
      title: t('projects.project3.title'),
      description: t('projects.project3.description'),
      category: 'DESKTOP / PERFORMANCE',
      image: PROJECT_IMAGES[2],
      tags: PROJECT_TAGS[2],
      links: PROJECT_LINKS[2],
      accent: 'from-amber-500/20 via-orange-500/10 to-rose-500/20',
      tagBg: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
      lineColor: 'from-amber-500 to-rose-500',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header reveal
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

      // Project cards
      const cards = cardsRef.current?.querySelectorAll('[data-project-card]');
      if (cards?.length) {
        cards.forEach((card, i) => {
          const img = card.querySelector('[data-proj-img]');
          const content = card.querySelector('[data-proj-content]');
          const imgOverlay = card.querySelector('[data-proj-overlay]');

          // Card entrance
          const entranceTl = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              end: 'top 35%',
              scrub: 1,
            }
          });

          entranceTl.fromTo(card,
            { y: 120, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
            0
          );

          if (i % 2 === 0) {
            // Even: image slides from left
            entranceTl.fromTo(img,
              { x: -80, opacity: 0, scale: 0.95 },
              { x: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out' },
              0.1
            );
            entranceTl.fromTo(content,
              { x: 60, opacity: 0 },
              { x: 0, opacity: 1, duration: 1, ease: 'power3.out' },
              0.2
            );
          } else {
            // Odd: image slides from right
            entranceTl.fromTo(img,
              { x: 80, opacity: 0, scale: 0.95 },
              { x: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out' },
              0.1
            );
            entranceTl.fromTo(content,
              { x: -60, opacity: 0 },
              { x: 0, opacity: 1, duration: 1, ease: 'power3.out' },
              0.2
            );
          }

          // Parallax on image during scroll
          if (img) {
            gsap.to(img, {
              y: -30,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
              }
            });
          }

          // Overlay light effect on scroll
          if (imgOverlay) {
            gsap.fromTo(imgOverlay,
              { opacity: 0.3 },
              {
                opacity: 0.6,
                ease: 'none',
                scrollTrigger: {
                  trigger: card,
                  start: 'top 60%',
                  end: 'bottom 40%',
                  scrub: 1,
                }
              }
            );
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [i18n.language]);

  return (
    <section ref={sectionRef} id="projects" className="relative py-48 bg-transparent overflow-hidden">
      {/* Background number */}
      <div className="absolute top-16 right-8 md:right-16 text-[10rem] md:text-[14rem] font-black text-white/[0.015] leading-none select-none pointer-events-none" style={{ fontFamily: 'var(--font-display)' }}>
        03
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="mb-36 flex flex-col items-center text-center">
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

        {/* Project cards */}
        <div ref={cardsRef} className="flex flex-col gap-32 md:gap-40">
          {projects.map((project, i) => {
            const isEven = i % 2 === 0;
            return (
              <div
                key={i}
                data-project-card
                className="opacity-0"
              >
                <div className="group relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  {/* Image */}
                  <div
                    data-proj-img
                    className={`relative overflow-hidden rounded-2xl lg:col-span-7 ${isEven ? '' : 'lg:order-2'}`}
                    style={{ aspectRatio: '16/10' }}
                  >
                    {/* Image */}
                    <img
                      src={project.image}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                      loading={i === 0 ? 'eager' : 'lazy'}
                      draggable={false}
                    />

                    {/* Gradient overlay */}
                    <div
                      data-proj-overlay
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                    />

                    {/* Shiny border on hover */}
                    <div className="absolute inset-0 rounded-2xl border border-white/[0.06] group-hover:border-white/[0.15] transition-all duration-700 pointer-events-none" />

                    {/* Project number overlay */}
                    <div className={`absolute top-6 ${isEven ? 'left-6' : 'right-6'}`}>
                      <span className="text-[5rem] md:text-[7rem] font-black text-white/[0.06] leading-none select-none" style={{ fontFamily: 'var(--font-display)' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Category badge on image */}
                    <div className={`absolute bottom-6 ${isEven ? 'left-6' : 'right-6'}`}>
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/[0.1]">
                        <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${project.lineColor}`} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                          {project.category}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div
                    data-proj-content
                    className={`lg:col-span-5 ${isEven ? '' : 'lg:order-1'}`}
                  >
                    {/* Category text for mobile */}
                    <div className="flex items-center gap-3 mb-4 lg:hidden">
                      <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${project.lineColor}`} />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                        {project.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[1.05] tracking-tight mb-6 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/60 transition-all duration-700" style={{ fontFamily: 'var(--font-display)' }}>
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-base md:text-lg text-slate-400 font-medium leading-relaxed mb-8 group-hover:text-slate-300 transition-colors duration-500">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-10">
                      {project.tags.map((tag, j) => (
                        <span
                          key={j}
                          className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider border ${project.tagBg} transition-all duration-300 group-hover:scale-105`}
                        >
                          {t(`projects.tags.${tag}`)}
                        </span>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-4">
                      {project.links.github && (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/btn inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-sm font-semibold text-white/70 hover:bg-white/[0.1] hover:text-white hover:border-white/[0.2] transition-all duration-300"
                        >
                          <Github className="w-4 h-4" />
                          <span>{t('projects.sourceCode')}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300" />
                        </a>
                      )}
                      {project.links.demo && (
                        <a
                          href={project.links.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/btn inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-sm font-semibold text-white/70 hover:bg-white/[0.1] hover:text-white hover:border-white/[0.2] transition-all duration-300"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>{t('projects.liveDemo')}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300" />
                        </a>
                      )}
                      {!project.links.github && !project.links.demo && (
                        <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white/30 border border-white/[0.05]">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" />
                          Private Project
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Divider line (except last) */}
                {i < projects.length - 1 && (
                  <div className="mt-32 md:mt-40">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;