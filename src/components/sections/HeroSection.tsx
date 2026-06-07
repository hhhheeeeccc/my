import React from 'react';
import { useTranslation } from 'react-i18next';
import FadeIn from '../common/FadeIn';
import Magnet from '../common/Magnet';
import { ContactButton } from '../common/Buttons';

const Navbar = () => {
  const { t } = useTranslation();
  return (
    <nav className="flex w-full items-center justify-between px-6 pt-6 md:px-10 md:pt-8">
      <FadeIn delay={0} y={-20}>
        <div className="flex w-full justify-between gap-4 md:gap-10">
          {[
            { name: t('nav.about'), href: '#about' },
            { name: t('nav.skills'), href: '#skills' },
            { name: t('nav.projects'), href: '#projects' },
            { name: t('nav.contact'), href: '#contact' }
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium uppercase tracking-wider text-[#D7E2EA] transition-opacity duration-200 hover:opacity-70 md:text-lg lg:text-[1.4rem]"
            >
              {item.name}
            </a>
          ))}
        </div>
      </FadeIn>
    </nav>
  );
};

const HeroSection = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');
  const name = t('hero.name');

  return (
    <section className="relative flex h-screen w-full flex-col overflow-x-clip bg-[#0C0C0C]">
      <Navbar />

      <div className="relative z-20 flex flex-1 flex-col justify-between px-6 pb-7 sm:px-10 sm:pb-8 md:pb-10">
        <div className="mt-6 overflow-hidden sm:mt-4 md:-mt-5">
          <FadeIn delay={0.15} y={40}>
            <h1 className="hero-heading w-full whitespace-nowrap text-[8vw] font-black uppercase leading-none tracking-tight sm:text-[9vw] md:text-[10vw] lg:text-[12vw]">
              {isAr ? 'مرحباً، أنا ' : "Hi, i'm "}{name.split(' ')[0]}
            </h1>
          </FadeIn>
        </div>

        <div className="flex items-end justify-between">
          <FadeIn delay={0.35} y={20}>
            <p className="max-w-[160px] text-[clamp(0.75rem,1.4vw,1.5rem)] font-light uppercase leading-snug tracking-wide text-[#D7E2EA] sm:max-w-[220px] md:max-w-[340px]">
              {t('hero.title')}
            </p>
          </FadeIn>

          <FadeIn delay={0.5} y={20}>
            <ContactButton />
          </FadeIn>
        </div>
      </div>

      <div className="absolute left-1/2 top-1/2 z-10 w-[280px] -translate-x-1/2 -translate-y-1/2 sm:bottom-0 sm:top-auto sm:w-[360px] sm:translate-y-0 md:w-[440px] lg:w-[520px]">
        <FadeIn delay={0.6} y={30}>
          <Magnet padding={150} strength={3}>
            <img
              src="https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png"
              alt="Portrait"
              className="h-auto w-full object-contain"
            />
          </Magnet>
        </FadeIn>
      </div>
    </section>
  );
};

export default HeroSection;
