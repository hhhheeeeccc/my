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

  const springX = useSpring(mouseX, { stiffness: 80, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 25 });

  const rotateX = useTransform(springY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-15deg", "15deg"]);

  // Parallax elements transforms
  const p1X = useTransform(springX, [-0.5, 0.5], ["-60px", "60px"]);
  const p1Y = useTransform(springY, [-0.5, 0.5], ["-60px", "60px"]);

  const p2X = useTransform(springX, [-0.5, 0.5], ["80px", "-80px"]);
  const p2Y = useTransform(springY, [-0.5, 0.5], ["80px", "-80px"]);

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
    hidden: { opacity: 0, y: 50, translateZ: -200, rotateX: 30 },
    visible: {
      opacity: 1,
      y: 0,
      translateZ: 0,
      rotateX: 0,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const name = t('hero.name') || "Developer";

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-700 perspective-[3000px]"
    >
      {/* Parallax Background Elements */}
      <motion.div
        style={{ x: p1X, y: p1Y, translateZ: "-200px" }}
        className="absolute top-[15%] left-[10%] w-80 h-80 rounded-full bg-blue-500/15 blur-[100px] pointer-events-none"
      />
      <motion.div
        style={{ x: p2X, y: p2Y, translateZ: "-300px" }}
        className="absolute bottom-[10%] right-[10%] w-[30rem] h-[30rem] rounded-full bg-indigo-500/15 blur-[120px] pointer-events-none"
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
            style={{ translateZ: "80px" }}
            className="inline-block mb-10 px-8 py-3 rounded-2xl bg-blue-50/60 dark:bg-blue-900/15 border border-blue-100/50 dark:border-blue-800/30 backdrop-blur-xl shadow-lg"
          >
            <span className="text-xs md:text-sm font-black text-blue-600 dark:text-blue-400 tracking-[0.4em] uppercase">
              {t('hero.welcome', 'Welcome to my world')}
            </span>
          </motion.div>

          <motion.h1
            style={{ translateZ: "180px", transformStyle: "preserve-3d" }}
            className="text-7xl md:text-[12rem] font-black tracking-[-0.05em] mb-12 flex flex-wrap justify-center leading-[0.85] drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
          >
            <span className="sr-only">{name}</span>
            <span className="flex flex-wrap justify-center bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent pb-4" aria-hidden="true">
              {name.split("").map((letter, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 100, rotateX: -90, translateZ: -200 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0, translateZ: 0 }}
                  transition={{
                    duration: 1,
                    delay: 0.6 + index * 0.04,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="inline-block origin-bottom transition-all duration-500 hover:text-blue-500 hover:scale-110 cursor-default"
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </span>
          </motion.h1>

          <motion.h2
            variants={itemVariants}
            style={{ translateZ: "120px" }}
            className="text-4xl md:text-7xl font-black text-slate-900 dark:text-slate-100 mb-14 max-w-5xl mx-auto leading-[1.1] tracking-tight"
          >
            {t('hero.title')}
          </motion.h2>

          <motion.p
            variants={itemVariants}
            style={{ translateZ: "70px" }}
            className="text-xl md:text-3xl text-slate-600 dark:text-slate-400 mb-20 max-w-4xl mx-auto leading-relaxed font-semibold opacity-90"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            variants={itemVariants}
            style={{ translateZ: "100px" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-10"
          >
            <Magnetic>
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.08, y: -8, translateZ: 40 }}
                whileTap={{ scale: 0.98 }}
                className="group relative w-full sm:w-auto px-16 py-7 glow-effect bg-blue-600 text-white font-black rounded-[2.5rem] transition-all overflow-hidden shadow-[0_20px_50px_-10px_rgba(37,99,235,0.4)]"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 skew-x-[-25deg]" />
                <span className="relative z-10 text-xl">{t('hero.ctaWork')}</span>
              </motion.a>
            </Magnetic>
            <Magnetic>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.08, y: -8, translateZ: 40 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-16 py-7 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-black rounded-[2.5rem] hover:bg-slate-50 dark:hover:bg-slate-900 transition-all hover:border-blue-600/50 dark:hover:border-blue-500/50 text-xl backdrop-blur-md shadow-xl"
              >
                {t('hero.ctaContact')}
              </motion.a>
            </Magnetic>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* 3D Floating Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ perspective: "1500px" }}>
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              z: Math.random() * -800 - 200,
              opacity: 0
            }}
            animate={{
              y: ["-20%", "120%"],
              opacity: [0, 0.8, 0.8, 0],
              rotate: [0, 720],
              scale: [0.5, 1.2, 0.5]
            }}
            transition={{
              duration: 20 + Math.random() * 15,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear"
            }}
            className="absolute w-6 h-6 md:w-12 md:h-12 border border-blue-500/10 rounded-xl"
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3, duration: 1.5 }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <div className="w-[36px] h-[64px] rounded-full border-2 border-slate-200 dark:border-slate-800 p-2 backdrop-blur-sm shadow-inner">
          <motion.div
            animate={{
              y: [0, 28, 0],
              opacity: [1, 0.4, 1],
              scale: [1, 0.8, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-3 h-3 rounded-full bg-blue-600 mx-auto shadow-[0_0_20px_rgba(59,130,246,1)]"
          />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 dark:text-slate-600">{t('hero.scroll', 'Scroll')}</span>
      </motion.div>
    </section>
  );
};

export default Hero;
