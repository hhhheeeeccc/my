import React, { useMemo, useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import './CinematicWorkIndex.css';

const CinematicWorkIndex = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');
  const sectionRef = useRef(null);
  const [activeProject, setActiveProject] = useState(0);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 90, damping: 24, mass: 0.4 });
  const smoothY = useSpring(pointerY, { stiffness: 90, damping: 24, mass: 0.4 });
  const previewRotateY = useTransform(smoothX, [-220, 220], [-13, 13]);
  const previewRotateX = useTransform(smoothY, [-180, 180], [10, -10]);

  const projects = useMemo(() => [1, 2, 3].map((i) => ({
    title: t(`projects.project${i}.title`),
    description: t(`projects.project${i}.description`),
    category: i === 1 ? 'WEB / ENTERPRISE' : i === 2 ? 'DESKTOP / NETWORKING' : 'DESKTOP / PERFORMANCE',
    accent: i === 1 ? '#818cf8' : i === 2 ? '#2dd4bf' : '#c084fc',
    gradient:
      i === 1 ? 'linear-gradient(135deg, #2563eb, #4f46e5, #7c3aed)'
      : i === 2 ? 'linear-gradient(135deg, #06b6d4, #14b8a6, #10b981)'
      : 'linear-gradient(135deg, #7c3aed, #9333ea, #d946ef)',
  })), [t]);

  const handlePointerMove = useCallback((event) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointerX.set(event.clientX - rect.left - rect.width / 2);
    pointerY.set(event.clientY - rect.top - rect.height / 2);
  }, [pointerX, pointerY]);

  const pad = (value) => String(value + 1).padStart(2, '0');
  const active = projects[activeProject] ?? projects[0];

  return (
    <section
      ref={sectionRef}
      className="cinematic-work-index"
      aria-label={isAr ? 'تجربة أعمال سينمائية' : 'Cinematic work index'}
      onPointerMove={handlePointerMove}
    >
      <div className="cinematic-work-index__aura" aria-hidden="true" />
      <motion.div
        className="cinematic-work-index__preview"
        aria-hidden="true"
        style={{ x: smoothX, y: smoothY, rotateX: previewRotateX, rotateY: previewRotateY }}
      >
        <div className="cinematic-work-index__preview-media" style={{ background: active.gradient }}>
          <span>{pad(activeProject)}</span>
        </div>
      </motion.div>

      <div className="cinematic-work-index__hero">
        <div className="cinematic-work-index__meta-row">
          <span>{isAr ? 'أعمال مختارة' : 'Selected work'}</span>
          <span>{projects.length.toString().padStart(2, '0')} CASES</span>
        </div>
        <h2>{t('projects.title')}</h2>
        <p>
          {isAr
            ? 'تجربة أعمال أقرب لروح Active Theory: شاشة واسعة، حروف ضخمة، معاينة 3D تتبع المؤشر، وحركة سينمائية تمنح الموقع إحساسًا بصريًا حيًا.'
            : 'An Active Theory-style work landing: oversized type, a mouse-reactive 3D preview, layered visual feedback, and cinematic motion before the detailed project cases.'}
        </p>
      </div>

      <div className="cinematic-work-index__rows">
        {projects.map((project, index) => (
          <a
            key={project.title}
            href="#projects"
            className="cinematic-work-index__row"
            onMouseEnter={() => setActiveProject(index)}
            onFocus={() => setActiveProject(index)}
          >
            <span>{pad(index)}</span>
            <strong>{project.title}</strong>
            <em style={{ color: project.accent }}>{project.category}</em>
          </a>
        ))}
      </div>
    </section>
  );
};

export default CinematicWorkIndex;
