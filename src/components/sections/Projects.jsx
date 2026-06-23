import React, { useMemo, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import './Projects.css';

const Projects = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 70, damping: 22, mass: 0.5 });
  const smoothY = useSpring(pointerY, { stiffness: 70, damping: 22, mass: 0.5 });
  const rotateY = useTransform(smoothX, [-520, 520], [-18, 18]);
  const rotateX = useTransform(smoothY, [-360, 360], [12, -12]);
  const lightX = useTransform(smoothX, [-520, 520], ['18%', '82%']);
  const lightY = useTransform(smoothY, [-360, 360], ['22%', '78%']);

  const projects = useMemo(() => [1, 2, 3].map((i) => ({
    title: t(`projects.project${i}.title`),
    description: t(`projects.project${i}.description`),
    tags:
      i === 1
        ? [t('projects.tags.react'), t('projects.tags.ts'), t('projects.tags.go'), t('projects.tags.tailwind')]
        : i === 2
          ? [t('projects.tags.electron'), t('projects.tags.js'), t('projects.tags.node'), t('projects.tags.networking')]
          : [t('projects.tags.react'), t('projects.tags.electron'), t('projects.tags.node'), t('projects.tags.perf')],
    accent: i === 1 ? '#6ee7ff' : i === 2 ? '#5eead4' : '#e879f9',
    gradient:
      i === 1 ? 'linear-gradient(135deg, #1d4ed8 0%, #4338ca 45%, #7c3aed 100%)'
      : i === 2 ? 'linear-gradient(135deg, #0891b2 0%, #0d9488 48%, #047857 100%)'
      : 'linear-gradient(135deg, #6d28d9 0%, #9333ea 42%, #db2777 100%)',
    category: i === 1 ? 'WEB / ENTERPRISE' : i === 2 ? 'DESKTOP / NETWORKING' : 'DESKTOP / PERFORMANCE',
    year: '2024',
  })), [t]);

  const handlePointerMove = useCallback((event) => {
    const bounds = sectionRef.current?.getBoundingClientRect();
    if (!bounds) return;
    pointerX.set(event.clientX - bounds.left - bounds.width / 2);
    pointerY.set(event.clientY - bounds.top - bounds.height / 2);
  }, [pointerX, pointerY]);

  const pad = (index) => String(index + 1).padStart(2, '0');
  const activeProject = projects[activeIndex] ?? projects[0];

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="at-work"
      onPointerMove={handlePointerMove}
      aria-label={isAr ? 'الأعمال' : 'Work'}
    >
      <motion.div className="at-work__light" aria-hidden="true" style={{ left: lightX, top: lightY }} />
      <div className="at-work__noise" aria-hidden="true" />

      <div className="at-work__intro">
        <div className="at-work__bar">
          <span>{isAr ? 'أعمال مختارة' : 'Selected work'}</span>
          <span>{projects.length.toString().padStart(2, '0')} / CASE STUDIES</span>
        </div>
        <h2>{isAr ? 'الأعمال' : 'WORK'}</h2>
        <p>
          {isAr
            ? 'تجربة شبيهة بروح Active Theory: شاشة سوداء، عناوين ضخمة، تغذية بصرية مع حركة المؤشر، وبطاقات 3D تتحرك مع التمرير.'
            : 'A black cinematic work wall with oversized typography, mouse-reactive visual feedback, scroll-driven depth, and 3D motion inspired by high-end interactive studios.'}
        </p>
      </div>

      <div className="at-work__index" aria-label={isAr ? 'فهرس المشاريع' : 'Project index'}>
        {projects.map((project, index) => (
          <a
            key={project.title}
            href={`#case-${index + 1}`}
            className="at-work__index-row"
            onMouseEnter={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
          >
            <span>{pad(index)}</span>
            <strong>{project.title}</strong>
            <em style={{ color: project.accent }}>{project.category}</em>
          </a>
        ))}
      </div>

      <motion.div
        className="at-work__cursor-card"
        aria-hidden="true"
        style={{ x: smoothX, y: smoothY, rotateX, rotateY }}
      >
        <div className="at-work__cursor-media" style={{ background: activeProject.gradient }}>
          <span>{pad(activeIndex)}</span>
        </div>
      </motion.div>

      <div className="at-work__cases">
        {projects.map((project, index) => (
          <article
            key={`${project.title}-case`}
            id={`case-${index + 1}`}
            className="at-work__case"
            onMouseEnter={() => setActiveIndex(index)}
            style={{ '--case-accent': project.accent, '--case-gradient': project.gradient }}
          >
            <div className="at-work__case-sticky">
              <motion.div
                className="at-work__visual"
                initial={{ opacity: 0, y: 80, rotateX: 18 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: false, amount: 0.35 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="at-work__visual-bg" />
                <div className="at-work__grid" />
                <div className="at-work__orb at-work__orb--one" />
                <div className="at-work__orb at-work__orb--two" />
                <div className="at-work__scan" />
                <span className="at-work__visual-number">{pad(index)}</span>
                <span className="at-work__visual-caption">60 FPS / WEBGL FEEL / 3D MOTION</span>
              </motion.div>

              <div className="at-work__copy">
                <div className="at-work__eyebrow">
                  <span>{project.year}</span>
                  <span>{project.category}</span>
                </div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="at-work__tags">
                  {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                <div className="at-work__actions">
                  <span><Github size={15} />{t('projects.sourceCode')}</span>
                  <span><ExternalLink size={15} />{t('projects.liveDemo')}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Projects;
