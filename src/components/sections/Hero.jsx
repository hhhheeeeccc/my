import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Magnetic from '../common/Magnetic';

const Hero = () => {
  const { t } = useTranslation();
  const containerRef = useRef(null);

  // Mouse tracking for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  const rotateX = useTransform(springY, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-10deg", "10deg"]);

  // Parallax elements transforms
  const p1X = useTransform(springX, [-0.5, 0.5], ["-40px", "40px"]);
  const p1Y = useTransform(springY, [-0.5, 0.5], ["-40px", "40px"]);

  const p2X = useTransform(springX, [-0.5, 0.5], ["60px", "-60px"]);
  const p2Y = useTransform(springY, [-0.5, 0.5], ["60px", "-60px"]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, translateZ: -100 },
    visible: {
      opacity: 1,
      y: 0,
      translateZ: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const name = t('hero.name') || "Developer";

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-500 perspective-[2000px]"
    >
      {/* Parallax Background Elements */}
      <motion.div
        style={{ x: p1X, y: p1Y }}
        className="absolute top-[20%] left-[15%] w-64 h-64 rounded-full bg-blue-500/10 blur-[80px] pointer-events-none"
      />
      <motion.div
        style={{ x: p2X, y: p2Y }}
        className="absolute bottom-[20%] right-[15%] w-96 h-96 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none"
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative z-10 max-w-7xl mx-auto px-4 text-center"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.div
            variants={itemVariants}
            style={{ translateZ: "50px" }}
            className="inline-block mb-8 px-6 py-2 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50 backdrop-blur-md"
          >
            <span className="text-xs md:text-sm font-black text-blue-600 dark:text-blue-400 tracking-[0.3em] uppercase">
              {t('hero.welcome', 'Welcome to my world')}
            </span>
          </motion.div>

          <motion.h1
            style={{ translateZ: "100px", transformStyle: "preserve-3d" }}
            className="text-6xl md:text-[10rem] font-black tracking-[-0.04em] mb-10 flex flex-wrap justify-center leading-[0.9]"
          >
            <span className="sr-only">{name}</span>
            <span className="flex flex-wrap justify-center bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent" aria-hidden="true">
              {name.split("").map((letter, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 50, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.5 + index * 0.05,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="inline-block origin-bottom"
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </span>
          </motion.h1>

          <motion.h2
            variants={itemVariants}
            style={{ translateZ: "70px" }}
            className="text-3xl md:text-6xl font-extrabold text-slate-900 dark:text-slate-100 mb-12 max-w-5xl mx-auto leading-tight"
          >
            {t('hero.title')}
          </motion.h2>

          <motion.p
            variants={itemVariants}
            style={{ translateZ: "40px" }}
            className="text-xl md:text-3xl text-slate-600 dark:text-slate-400 mb-16 max-w-4xl mx-auto leading-relaxed font-medium opacity-80"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            variants={itemVariants}
            style={{ translateZ: "60px" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            <Magnetic>
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.05, y: -5, translateZ: 20 }}
                whileTap={{ scale: 0.98 }}
                className="group relative w-full sm:w-auto px-14 py-6 bg-blue-600 text-white font-black rounded-[2rem] transition-all overflow-hidden shadow-2xl shadow-blue-500/30"
              >
                <div className="absolute inset-0 w-full h-full bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-20deg]" />
                <span className="relative z-10 text-lg">{t('hero.ctaWork')}</span>
              </motion.a>
            </Magnetic>
            <Magnetic>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05, y: -5, translateZ: 20 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-14 py-6 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-black rounded-[2rem] hover:bg-slate-50 dark:hover:bg-slate-900 transition-all hover:border-blue-600/50 dark:hover:border-blue-500/50 text-lg"
              >
                {t('hero.ctaContact')}
              </motion.a>
            </Magnetic>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* 3D Floating Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ perspective: "1000px" }}>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              z: Math.random() * -500 - 100,
              opacity: 0
            }}
            animate={{
              y: ["-10%", "110%"],
              opacity: [0, 1, 1, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
            className="absolute w-4 h-4 md:w-8 md:h-8 border-2 border-blue-500/20 rounded-lg"
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-[32px] h-[54px] rounded-full border-2 border-slate-300 dark:border-slate-700 p-1.5">
          <motion.div
            animate={{
              y: [0, 22, 0],
              opacity: [1, 0.5, 1]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-2.5 h-2.5 rounded-full bg-blue-600 mx-auto shadow-[0_0_12px_rgba(59,130,246,0.9)]"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
