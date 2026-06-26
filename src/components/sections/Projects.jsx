import React, { useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/*
  ═══════════════════════════════════════════════════════════════
  ActiveTheory /work — Cinematic scroll-through clone
  ═══════════════════════════════════════════════════════════════
  How AT work section actually works:
  - Each project is a FULLSCREEN image/video
  - As you scroll, the current project zooms out slightly & fades
  - The next project zooms in from slightly zoomed state & fades in
  - Text (category + title) appears at bottom-left during "hold" phase
  - Project counter visible (01, 02, 03...)
  - Pure black #000 background
  - No section headers, no cards, no grids
  - Smooth, cinematic, camera-like movement
  ═══════════════════════════════════════════════════════════════
*/

const PROJECT_IMAGES = [
  'https://sfile.chatglm.cn/images-ppt/368fa9fefa27.png',
  'https://sfile.chatglm.cn/images-ppt/ffc85a6f9d93.png',
  'https://sfile.chatglm.cn/images-ppt/8f0d57436abd.png',
];

const Projects = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const counterRef = useRef(null);

  const projects = useMemo(() =>
    [
      {
        title: t('projects.project1.title'),
        category: 'WEB / ENTERPRISE',
        image: PROJECT_IMAGES[0],
        year: '2024',
      },
      {
        title: t('projects.project2.title'),
        category: 'DESKTOP / NETWORKING',
        image: PROJECT_IMAGES[1],
        year: '2024',
      },
      {
        title: t('projects.project3.title'),
        category: 'DESKTOP / PERFORMANCE',
        image: PROJECT_IMAGES[2],
        year: '2024',
      },
    ],
    [t]
  );

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const items = sectionRef.current.querySelectorAll('.project-panel');

      items.forEach((panel, index) => {
        const image = panel.querySelector('.project-image');
        const overlay = panel.querySelector('.project-overlay');
        const catEl = panel.querySelector('.project-cat');
        const titleEl = panel.querySelector('.project-title');
        const yearEl = panel.querySelector('.project-year');
        const numEl = panel.querySelector('.project-num');
        const lineEl = panel.querySelector('.project-line');

        // ─── Pin each panel for the duration of its scroll animation ───
        ScrollTrigger.create({
          trigger: panel,
          start: 'top top',
          end: '+=200%',
          pin: true,
          pinSpacing: true,
        });

        // ─── Master Timeline ───
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: 'top top',
            end: '+=200%',
            scrub: 0.6,
          },
        });

        // ── ENTER PHASE (0% → 25%): Image zooms in from 1.15, fades in ──
        tl.fromTo(image,
          { scale: 1.2, opacity: 0, filter: 'brightness(1.3)' },
          { scale: 1.0, opacity: 1, filter: 'brightness(1)', duration: 0.25, ease: 'power2.out' },
          0
        );

        // ── HOLD PHASE (20% → 65%): Text reveals ──
        tl.fromTo(overlay,
          { opacity: 0 },
          { opacity: 1, duration: 0.08, ease: 'power1.out' },
          0.20
        );

        tl.fromTo(numEl,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 0.15, duration: 0.05, ease: 'power2.out' },
          0.22
        );

        tl.fromTo(catEl,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 0.5, duration: 0.06, ease: 'power2.out' },
          0.24
        );

        tl.fromTo(lineEl,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 0.3, duration: 0.06, ease: 'power2.out' },
          0.27
        );

        tl.fromTo(titleEl,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.10, ease: 'power2.out' },
          0.28
        );

        tl.fromTo(yearEl,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 0.4, duration: 0.05, ease: 'power2.out' },
          0.33
        );

        // ── EXIT PHASE (65% → 100%): Everything fades out, image zooms ──
        tl.to(overlay, { opacity: 0, duration: 0.15, ease: 'power2.in' }, 0.65);
        tl.to(numEl, { opacity: 0, y: -15, duration: 0.10, ease: 'power2.in' }, 0.65);
        tl.to(catEl, { opacity: 0, y: -15, duration: 0.08, ease: 'power2.in' }, 0.68);
        tl.to(lineEl, { scaleX: 0, opacity: 0, duration: 0.08, ease: 'power2.in' }, 0.70);
        tl.to(titleEl, { opacity: 0, y: -30, duration: 0.12, ease: 'power2.in' }, 0.68);
        tl.to(yearEl, { opacity: 0, y: -15, duration: 0.08, ease: 'power2.in' }, 0.72);

        tl.to(image,
          { scale: 1.15, opacity: 0, filter: 'brightness(1.5)', duration: 0.35, ease: 'power3.in' },
          0.65
        );

      });

      // ─── Project counter (fixed position) ───
      if (counterRef.current) {
        const numEls = counterRef.current.querySelectorAll('.counter-num');
        numEls.forEach((num, i) => {
          gsap.fromTo(num,
            { opacity: 0 },
            {
              opacity: 1,
              scrollTrigger: {
                trigger: items[i],
                start: 'top 60%',
                end: 'top 20%',
                scrub: 0.3,
              },
            }
          );
          if (i < numEls.length - 1) {
            gsap.to(num, {
              opacity: 0,
              scrollTrigger: {
                trigger: items[i + 1],
                start: 'top bottom',
                end: 'top 60%',
                scrub: 0.3,
              },
            });
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="relative bg-black">

      {/* Fixed project counter — top right */}
      <div ref={counterRef} className="fixed top-8 right-8 z-50 pointer-events-none" style={{ mixBlendMode: 'difference' }}>
        <div className="relative h-8 overflow-hidden">
          {projects.map((p, i) => (
            <span
              key={i}
              className="counter-num absolute top-0 left-0 text-[11px] font-normal tracking-[0.3em] text-white/80 font-body opacity-0"
            >
              {String(i + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
            </span>
          ))}
        </div>
      </div>

      {projects.map((project, i) => (
        <div
          key={i}
          className="project-panel relative w-full h-screen overflow-hidden bg-black"
        >
          {/* Fullscreen project image */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              className="project-image absolute inset-0 w-full h-full object-cover will-change-transform opacity-0"
              src={project.image}
              alt=""
              loading={i === 0 ? 'eager' : 'lazy'}
              draggable={false}
              style={{
                transformOrigin: 'center center',
              }}
            />
          </div>

          {/* Text overlay — bottom left, AT terminal style */}
          <div
            className="project-overlay absolute inset-0 z-[3] pointer-events-none opacity-0"
          >
            <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-10 md:px-16 lg:px-24 pb-10 sm:pb-14 md:pb-20">

              {/* Project number — large faded */}
              <span
                className="project-num block text-[10rem] sm:text-[14rem] md:text-[18rem] font-black text-white/[0.03] leading-none tracking-tighter font-body absolute -top-20 sm:-top-28 md:-top-36 left-0 opacity-0 will-change-transform"
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Category label */}
              <p
                className="project-cat text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.35em] text-white/50 mb-3 sm:mb-4 font-body opacity-0 will-change-transform"
              >
                {project.category}
              </p>

              {/* Decorative line */}
              <div
                className="project-line h-px w-10 sm:w-12 bg-white/30 mb-4 sm:mb-5 origin-left opacity-0 will-change-transform"
              />

              {/* Title */}
              <h3
                className="project-title text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[0.92] tracking-tight font-body opacity-0 will-change-transform max-w-[80vw] md:max-w-[60vw]"
              >
                {project.title}
              </h3>

              {/* Year */}
              <span
                className="project-year inline-block mt-3 sm:mt-4 text-[10px] sm:text-[11px] font-normal tracking-[0.3em] text-white/40 font-body opacity-0 will-change-transform"
              >
                {project.year}
              </span>

            </div>
          </div>

        </div>
      ))}
    </section>
  );
};

export default Projects;