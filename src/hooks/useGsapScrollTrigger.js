import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Syncs Lenis smooth scroll with GSAP ScrollTrigger
export const useLenisGsapSync = (lenisRef) => {
  useEffect(() => {
    if (!lenisRef?.current) return;

    const onScroll = ScrollTrigger.update;
    lenisRef.current.on('scroll', onScroll);

    return () => {
      if (lenisRef?.current) {
        lenisRef.current.off('scroll', onScroll);
      }
    };
  }, [lenisRef]);
};

// Hook to create scroll-pinned sections with GSAP
export const useScrollPin = (ref, options = {}) => {
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: options.start || 'top top',
      end: options.end || '+=2000',
      pin: options.pin !== false,
      scrub: options.scrub !== false ? 1 : false,
      anticipatePin: 1,
      onUpdate: options.onUpdate,
      onEnter: options.onEnter,
      onLeave: options.onLeave,
      onEnterBack: options.onEnterBack,
      onLeaveBack: options.onLeaveBack,
    });

    triggerRef.current = trigger;

    return () => {
      trigger.kill();
    };
  }, [ref, options.start, options.end, options.pin, options.scrub]);

  return triggerRef;
};

// Hook for scroll-driven text reveal (line by line)
export const useTextReveal = (ref, options = {}) => {
  useEffect(() => {
    if (!ref.current) return;

    const lines = ref.current.querySelectorAll('[data-reveal-line]');
    if (!lines.length) return;

    gsap.set(lines, { y: '110%', opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ref.current,
        start: options.start || 'top 80%',
        end: options.end || 'top 20%',
        scrub: options.scrub !== false ? 1 : false,
      }
    });

    lines.forEach((line, i) => {
      tl.to(line, {
        y: '0%',
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
      }, i * 0.15);
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === ref.current) t.kill();
      });
    };
  }, [ref, options.start, options.end, options.scrub]);
};

// Hook for staggered element reveal on scroll
export const useStaggerReveal = (ref, options = {}) => {
  useEffect(() => {
    if (!ref.current) return;

    const items = ref.current.querySelectorAll('[data-stagger-item]');
    if (!items.length) return;

    gsap.set(items, {
      y: options.y || 60,
      opacity: 0,
      rotateX: options.rotateX || 0,
      scale: options.scale || 1,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ref.current,
        start: options.start || 'top 85%',
        end: options.end || 'top 40%',
        scrub: options.scrub || false,
      }
    });

    tl.to(items, {
      y: 0,
      opacity: 1,
      rotateX: 0,
      scale: 1,
      duration: 1,
      stagger: options.stagger || 0.1,
      ease: options.ease || 'power3.out',
    });

    return () => {
      tl.kill();
    };
  }, [ref, options]);
};

// Hook for parallax effect on scroll
export const useParallax = (ref, speed = 0.5, options = {}) => {
  useEffect(() => {
    if (!ref.current) return;

    gsap.to(ref.current, {
      y: () => -100 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === ref.current) t.kill();
      });
    };
  }, [ref, speed]);
};

// Hook for horizontal scroll section
export const useHorizontalScroll = (containerRef, panelSelector, options = {}) => {
  useEffect(() => {
    if (!containerRef.current) return;

    const panels = containerRef.current.querySelectorAll(panelSelector);
    if (!panels.length) return;

    const totalWidth = Array.from(panels).reduce((acc, panel) => acc + panel.offsetWidth, 0);
    const scrollWidth = totalWidth - window.innerWidth;

    gsap.to(panels, {
      xPercent: -100 * (panels.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        snap: 1 / (panels.length - 1),
        end: () => `+=${scrollWidth}`,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === containerRef.current) t.kill();
      });
    };
  }, [containerRef, panelSelector]);
};

// Clip-path reveal animation
export const useClipReveal = (ref, options = {}) => {
  useEffect(() => {
    if (!ref.current) return;

    gsap.fromTo(ref.current, 
      { clipPath: options.from || 'inset(100% 0 0 0)' },
      {
        clipPath: options.to || 'inset(0% 0 0 0)',
        ease: options.ease || 'power4.inOut',
        duration: options.duration || 1.2,
        scrollTrigger: {
          trigger: ref.current,
          start: options.start || 'top 80%',
          end: options.end || 'top 30%',
          scrub: options.scrub || 1,
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === ref.current) t.kill();
      });
    };
  }, [ref, options.from, options.to, options.ease, options.duration, options.start, options.end, options.scrub]);
};

// Refresh all ScrollTriggers (call after layout changes)
export const refreshScrollTriggers = () => {
  ScrollTrigger.refresh();
};

export { gsap, ScrollTrigger };