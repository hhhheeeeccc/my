import React, { useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/*
  ═══════════════════════════════════════════════════════════════
  ActiveTheory /work clone — Cinematic fullscreen scroll
  ═══════════════════════════════════════════════════════════════
  Each project:
  - Fullscreen image that zooms in from 1.2x and settles to 1.0
  - Text (category + title) reveals during hold phase
  - Exits with zoom out + fade
  - Black gap between projects
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

  const projects = useMemo(() =>
    [
      { title: t('projects.project1.title'), category: 'WEB / ENTERPRISE', image: PROJECT_IMAGES[0] },
      { title: t('projects.project2.title'), category: 'DESKTOP / NETWORKING', image: PROJECT_IMAGES[1] },
      { title: t('projects.project3.title'), category: 'DESKTOP / PERFORMANCE', image: PROJECT_IMAGES[2] },
    ],
    [t]
  );

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const panels = sectionRef.current.querySelectorAll('.proj-panel');

      panels.forEach((panel) => {
        const img = panel.querySelector('.proj-img');
        const textBlock = panel.querySelector('.proj-text');
        const cat = panel.querySelector('.proj-cat');
        const title = panel.querySelector('.proj-title');
        const num = panel.querySelector('.proj-num');
        const line = panel.querySelector('.proj-line');

        // Pin each panel
        ScrollTrigger.create({
          trigger: panel,
          start: 'top top',
          end: '+=200%',
          pin: true,
          pinSpacing: true,
        });

        // Timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: 'top top',
            end: '+=200%',
            scrub: 0.5,
          },
        });

        // ENTER (0-25%)
        tl.fromTo(img,
          { scale: 1.25, opacity: 0 },
          { scale: 1.0, opacity: 1, duration: 0.25, ease: 'power2.out' },
          0
        );

        // TEXT REVEAL (22-45%)
        tl.fromTo(textBlock,
          { opacity: 0 },
          { opacity: 1, duration: 0.06, ease: 'none' },
          0.22
        );
        tl.fromTo(num,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 0.08, duration: 0.06, ease: 'power2.out' },
          0.24
        );
        tl.fromTo(cat,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 0.45, duration: 0.05, ease: 'power2.out' },
          0.26
        );
        tl.fromTo(line,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.05, ease: 'power2.out' },
          0.29
        );
        tl.fromTo(title,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.10, ease: 'power2.out' },
          0.30
        );

        // EXIT (60-100%)
        tl.to(textBlock, { opacity: 0, duration: 0.10, ease: 'power1.in' }, 0.60);
        tl.to(num, { opacity: 0, duration: 0.08, ease: 'power1.in' }, 0.62);
        tl.to(img,
          { scale: 1.15, opacity: 0, duration: 0.40, ease: 'power3.in' },
          0.60
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="relative bg-black">
      {projects.map((project, i) => (
        <div key={i} className="proj-panel relative w-full h-screen overflow-hidden bg-black">

          {/* Fullscreen image */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              className="proj-img absolute inset-0 w-full h-full object-cover will-change-transform opacity-0"
              src={project.image}
              alt=""
              loading={i === 0 ? 'eager' : 'lazy'}
              draggable={false}
              style={{ transformOrigin: 'center center' }}
            />
          </div>

          {/* Text overlay — bottom left */}
          <div
            className="proj-text absolute inset-0 z-[3] pointer-events-none opacity-0"
          >
            <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-10 md:px-16 lg:px-24 pb-12 sm:pb-16 md:pb-24">

              {/* Large faded number */}
              <span
                className="proj-num block text-[10rem] sm:text-[13rem] md:text-[16rem] font-black text-white/[0.04] leading-none tracking-tighter font-body absolute -top-16 sm:-top-24 md:-top-32 left-0 opacity-0 will-change-transform select-none"
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Category */}
              <p className="proj-cat text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.35em] text-white/40 mb-3 font-body opacity-0 will-change-transform">
                {project.category}
              </p>

              {/* Line */}
              <div className="proj-line h-px w-10 sm:w-12 bg-white/20 mb-4 origin-left will-change-transform" />

              {/* Title */}
              <h3 className="proj-title text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[0.92] tracking-tight font-body opacity-0 will-change-transform max-w-[85vw] md:max-w-[55vw]">
                {project.title}
              </h3>

            </div>
          </div>

        </div>
      ))}
    </section>
  );
};

export default Projects;