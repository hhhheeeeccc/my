import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle2 } from 'lucide-react';
import FadeIn from '../common/FadeIn';

const ContactSection = () => {
  const { t } = useTranslation();
  const [s, setS] = useState({ sub: false, sent: false });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setS({ sub: true, sent: false });
    setTimeout(() => {
      setS({ sub: false, sent: true });
      setTimeout(() => setS(p => ({ ...p, sent: false })), 3000);
    }, 1500);
  };

  return (
    <section id="contact" className="relative bg-[#0C0C0C] px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-32 flex flex-col items-center">
      <FadeIn y={40}>
        <h2 className="hero-heading mb-16 text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none tracking-tight sm:mb-20 md:mb-28">
          {t('contact.title')}
        </h2>
      </FadeIn>

      <div className="mx-auto w-full max-w-5xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid gap-8 sm:grid-cols-2">
            <FadeIn delay={0.1} y={20}>
              <label className="mb-3 block text-sm font-black uppercase tracking-widest text-[#D7E2EA]/60">
                {t('contact.nameLabel')}
              </label>
              <input
                required
                type="text"
                placeholder={t('contact.namePlaceholder')}
                className="w-full rounded-2xl border border-[#D7E2EA]/10 bg-[#D7E2EA]/5 px-8 py-5 font-medium text-[#D7E2EA] outline-none transition-all focus:border-[#D7E2EA]/30 focus:ring-1 focus:ring-[#D7E2EA]/30"
              />
            </FadeIn>
            <FadeIn delay={0.2} y={20}>
              <label className="mb-3 block text-sm font-black uppercase tracking-widest text-[#D7E2EA]/60">
                {t('contact.emailLabel')}
              </label>
              <input
                required
                type="email"
                placeholder={t('contact.emailPlaceholder')}
                className="w-full rounded-2xl border border-[#D7E2EA]/10 bg-[#D7E2EA]/5 px-8 py-5 font-medium text-[#D7E2EA] outline-none transition-all focus:border-[#D7E2EA]/30 focus:ring-1 focus:ring-[#D7E2EA]/30"
              />
            </FadeIn>
          </div>
          <FadeIn delay={0.3} y={20}>
            <label className="mb-3 block text-sm font-black uppercase tracking-widest text-[#D7E2EA]/60">
              {t('contact.messageLabel')}
            </label>
            <textarea
              required
              rows={6}
              placeholder={t('contact.messagePlaceholder')}
              className="w-full resize-none rounded-2xl border border-[#D7E2EA]/10 bg-[#D7E2EA]/5 px-8 py-5 font-medium text-[#D7E2EA] outline-none transition-all focus:border-[#D7E2EA]/30 focus:ring-1 focus:ring-[#D7E2EA]/30"
            />
          </FadeIn>

          <FadeIn delay={0.4} y={20} className="flex justify-center">
             <button
              disabled={s.sub || s.sent}
              type="submit"
              className={`relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full py-6 font-black uppercase tracking-widest text-white transition-all shadow-xl ${s.sent ? 'bg-emerald-500' : 'bg-blue-600'}`}
              style={!s.sent ? {
                background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
                boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
                outline: '2px solid white',
                outlineOffset: '-3px'
              } : {}}
            >
              {s.sub ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-6 w-6 rounded-full border-2 border-white/30 border-t-white" />
              ) : s.sent ? (
                <>
                  <CheckCircle2 size={24} />
                  <span>{t('contact.messageSent')}</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>{t('contact.sendButton')}</span>
                </>
              )}
            </button>
          </FadeIn>
        </form>

        <div className="mt-20 flex flex-col items-center gap-8 border-t border-[#D7E2EA]/10 pt-20">
          <FadeIn delay={0.5} y={20}>
            <h3 className="text-xl font-bold text-[#D7E2EA]">{t('contact.emailMe')}</h3>
            <a href={`mailto:${t('contact.emailAddress')}`} className="mt-2 block text-2xl font-black text-blue-400 hover:underline">
              {t('contact.emailAddress')}
            </a>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
