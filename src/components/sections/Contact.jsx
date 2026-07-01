import { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle2 } from 'lucide-react';
import Magnetic from '../common/Magnetic';
import { SOCIALS } from '../../utils/constants.jsx';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Contact = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);
  const [s, setS] = useState({ sub: false, sent: false });

  const handleSubmit = (e) => {
    e.preventDefault();
    setS({ sub: true, sent: false });
    setTimeout(() => {
      setS({ sub: false, sent: true });
      setTimeout(() => setS(p => ({ ...p, sent: false })), 3000);
    }, 1500);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header
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

      // Left column items
      const leftItems = leftColRef.current?.querySelectorAll('[data-contact-item]');
      if (leftItems?.length) {
        gsap.set(leftItems, { y: 60, opacity: 0 });
        gsap.to(leftItems, {
          y: 0, opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: leftColRef.current,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 1,
          }
        });
      }

      // Form fields
      const fields = rightColRef.current?.querySelectorAll('[data-form-field]');
      if (fields?.length) {
        gsap.set(fields, { y: 40, opacity: 0 });
        gsap.to(fields, {
          y: 0, opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: rightColRef.current,
            start: 'top 80%',
            end: 'top 35%',
            scrub: 1,
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="relative py-48 bg-transparent overflow-hidden">
      {/* Background number */}
      <div className="absolute top-16 right-8 md:right-16 text-[10rem] md:text-[14rem] font-black text-white/[0.015] leading-none select-none pointer-events-none" style={{ fontFamily: 'var(--font-display)' }}>
        04
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div ref={headerRef} className="mb-36 flex flex-col items-center text-center">
          <div data-gsap-reveal className="flex items-center gap-4 mb-8">
            <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-emerald-500/60" />
            <span className="text-xs font-black uppercase tracking-[0.4em] text-emerald-400/70">{t('contact.label')}</span>
            <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-emerald-500/60" />
          </div>
          <div data-gsap-reveal className="overflow-hidden">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[0.9]" style={{ fontFamily: 'var(--font-display)' }}>
              {t('contact.title')}
            </h2>
          </div>
          <div data-gsap-reveal className="mt-10 max-w-3xl">
            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed">
              {t('contact.intro')}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-20">
          {/* Left column */}
          <div ref={leftColRef} className="md:col-span-2 space-y-10">
            <div data-contact-item className="p-10 rounded-[2rem] bg-slate-900/30 border border-white/[0.06] backdrop-blur-sm hover:border-white/[0.1] transition-all duration-700">
              <h3 className="text-xl font-black text-white mb-6 flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-cyan-500/15 to-blue-500/15 rounded-xl text-cyan-400 border border-cyan-500/15">
                  <Mail size={20} />
                </div>
                <span>{t('contact.emailMe')}</span>
              </h3>
              <a
                href={`mailto:${t('contact.emailAddress')}`}
                className="text-lg text-cyan-400 font-bold break-all hover:text-cyan-300 transition-colors underline underline-offset-4 decoration-cyan-500/30 hover:decoration-cyan-400/50"
              >
                {t('contact.emailAddress')}
              </a>
            </div>

            <div data-contact-item className="flex justify-center md:justify-start gap-4">
              {SOCIALS.map((soc, i) => (
                <Magnetic key={i}>
                  <motion.a
                    href={soc.link}
                    whileHover={{ scale: 1.15, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-4 rounded-xl bg-slate-900/30 text-slate-500 border border-white/[0.06] backdrop-blur-sm transition-all duration-500 hover:border-white/[0.12] hover:text-white ${soc.color}`}
                  >
                    {soc.icon}
                  </motion.a>
                </Magnetic>
              ))}
            </div>
          </div>

          {/* Right column - form */}
          <div ref={rightColRef} className="md:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-7">
              <div className="grid sm:grid-cols-2 gap-7">
                {['name', 'email'].map(f => (
                  <div key={f} data-form-field>
                    <label className="block text-[11px] font-black text-slate-400 mb-3 uppercase tracking-[0.25em]">
                      {t(`contact.${f}Label`)}
                    </label>
                    <input
                      required
                      type={f === 'email' ? 'email' : 'text'}
                      className="w-full px-7 py-4 rounded-xl bg-slate-900/30 border border-white/[0.06] text-white placeholder-slate-600 focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/30 outline-none transition-all duration-500 font-medium text-sm backdrop-blur-sm"
                      placeholder={t(`contact.${f}Placeholder`)}
                    />
                  </div>
                ))}
              </div>
              <div data-form-field>
                <label className="block text-[11px] font-black text-slate-400 mb-3 uppercase tracking-[0.25em]">
                  {t('contact.messageLabel')}
                </label>
                <textarea
                  required
                  rows="5"
                  className="w-full px-7 py-4 rounded-xl bg-slate-900/30 border border-white/[0.06] text-white placeholder-slate-600 focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/30 outline-none transition-all duration-500 font-medium text-sm resize-none backdrop-blur-sm"
                  placeholder={t('contact.messagePlaceholder')}
                />
              </div>
              <div data-form-field>
                <Magnetic>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={s.sub || s.sent}
                    type="submit"
                    className={`w-full py-5 ${s.sent ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-white/[0.04] border-white/[0.08] text-white hover:bg-cyan-500/10 hover:border-cyan-500/30'} font-black rounded-xl transition-all duration-700 flex items-center justify-center gap-3 border text-[13px] tracking-[0.1em] uppercase`}
                  >
                    {s.sub ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full" />
                    ) : s.sent ? (
                      <><CheckCircle2 size={18} /><span>{t('contact.messageSent')}</span></>
                    ) : (
                      <><Send size={16} /><span>{t('contact.sendButton')}</span></>
                    )}
                  </motion.button>
                </Magnetic>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Contact;