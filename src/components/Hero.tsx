import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown, CheckCircle2 } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { useSiteData } from '../context/DataContext';
import gsap from 'gsap';

interface HeroProps {
  onOpenContact?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenContact: _onOpenContact }) => {
  const { data } = useSiteData();
  const { hero } = data;
  const headlineRef = useRef<HTMLHeadingElement>(null);

  const renderWordWithGlyph = (word?: string, wordSlot: 1 | 2 | 3 | 4 = 1) => {
    if (!word) return null;
    const upperWord = word.toUpperCase();
    const isBuild = upperWord.includes('BUILD');
    const isWhats = upperWord.includes('WHAT');
    const isNext = upperWord.includes('NEXT');

    // Check glowingWords checkboxes config first (word1, word2, word3, word4 or build, whats, next)
    const glow = hero.glowingWords;
    let shouldLightUp = false;

    if (glow && typeof glow === 'object') {
      if (wordSlot === 1 && (Boolean(glow.word1) || (Boolean(glow.build) && isBuild))) shouldLightUp = true;
      if (wordSlot === 2 && Boolean(glow.word2)) shouldLightUp = true;
      if (wordSlot === 3 && (Boolean(glow.word3) || (Boolean(glow.whats) && isWhats))) shouldLightUp = true;
      if (wordSlot === 4 && (Boolean(glow.word4) || (Boolean(glow.next) && isNext))) shouldLightUp = true;
    } else {
      // Fallback for target selector
      const target = hero.glowingTarget || 'NEXT';
      shouldLightUp =
        target === 'ALL' ||
        (target === 'NEXT' && (isNext || wordSlot === 4)) ||
        (target === 'BUILD' && (isBuild || wordSlot === 1)) ||
        (target === 'WHATS' && (isWhats || wordSlot === 3));
    }

    const subWords = word.trim().split(/\s+/);

    return (
      <span className="inline-flex flex-wrap items-center gap-x-4 sm:gap-x-6">
        {subWords.map((subWord, wIdx) => {
          if (shouldLightUp) {
            return (
              <span key={wIdx} className="led-word-container">
                {subWord.split('').map((char, index) => (
                  <span
                    key={index}
                    className={`led-dot led-dot-${(index % 4) + 1}`}
                    style={{ animationDelay: `${index * 0.18}s` }}
                  >
                    {char}
                  </span>
                ))}
              </span>
            );
          }
          return <span key={wIdx}>{subWord}</span>;
        })}
      </span>
    );
  };

  useEffect(() => {
    if (!headlineRef.current) return;

    const words = headlineRef.current.querySelectorAll('.hero-word');
    gsap.fromTo(
      words,
      { y: 60, opacity: 0, scale: 0.94 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.08,
        duration: 1,
        ease: 'power3.out',
        delay: 0.1,
      }
    );
  }, [hero.headlineWord1, hero.headlineWord2, hero.headlineWord3, hero.headlineWord4]);

  return (
    <section
      className="relative min-h-screen pt-36 pb-20 lg:pt-40 lg:pb-28 flex flex-col justify-between overflow-hidden bg-black select-none"
    >
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        key={hero.videoUrl || 'hero-bg-video'}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 mix-blend-screen transition-opacity duration-300"
        style={{ opacity: (hero.videoOpacity ?? 20) / 100 }}
        ref={(el) => { if (el) el.playbackRate = 0.8; }}
      >
        <source src={hero.videoUrl || '/hero-background.mp4'} type="video/mp4" />
      </video>

      {/* Lightened Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/90 pointer-events-none z-0" />

      {/* Subtle Radial Glow */}
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] sm:w-[950px] sm:h-[600px] pointer-events-none z-0 opacity-20">
        <svg viewBox="0 0 950 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter blur-[90px]">
          <ellipse cx="475" cy="300" rx="360" ry="200" fill="url(#hero-glow-v50)" />
          <defs>
            <radialGradient id="hero-glow-v50" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(475 300) scale(360 200)">
              <stop stopColor="#00ff9d" stopOpacity="0.8" />
              <stop offset="0.65" stopColor="#00d2ff" stopOpacity="0.25" />
              <stop offset="1" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full my-auto text-left">
        <div className="flex flex-col items-start gap-8 max-w-4xl">
          
          {/* Status Eyebrow Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-panel/80 border border-white/15 shadow-inner backdrop-blur-md">
            <span className="font-mono text-[11px] font-bold text-primary tracking-widest uppercase">
              {hero.eyebrow}
            </span>
          </div>

          {/* Clean Headline */}
          <h1
            ref={headlineRef}
            className="font-matrix text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-paper uppercase leading-[1.06]"
          >
            <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6">
              <span className="inline-block">
                <span className="inline-block hero-word">{renderWordWithGlyph(hero.headlineWord1 || "BUILD", 1)}</span>
              </span>
              {hero.headlineWord2 && (
                <span className="inline-block">
                  <span className="inline-block hero-word">{renderWordWithGlyph(hero.headlineWord2, 2)}</span>
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6">
              <span className="inline-block">
                <span className="inline-block hero-word">{renderWordWithGlyph(hero.headlineWord3 || "WHAT'S", 3)}</span>
              </span>
              <span className="inline-block">
                <span className="inline-block hero-word">{renderWordWithGlyph(hero.headlineWord4 || "NEXT.", 4)}</span>
              </span>
            </div>
          </h1>

          {/* Sub-description */}
          <p className="text-slate text-lg sm:text-xl max-w-2xl leading-relaxed font-normal">
            {hero.description}
          </p>

          {/* Pillars */}
          <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-slate/90 pt-1">
            {hero.pillars.map((pillar, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>{pillar}</span>
              </div>
            ))}
          </div>

          {/* Magnetic CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            <a href="#contact">
              <MagneticButton href="#contact" strength={25}>
                <div className="px-8 py-4 rounded-full bg-primary text-ink font-jakarta font-extrabold text-sm tracking-wide hover:bg-white hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 flex items-center gap-2">
                  <span>{hero.primaryCtaText}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </MagneticButton>
            </a>

            <MagneticButton href={hero.secondaryCtaLink} strength={20}>
              <div className="px-8 py-4 rounded-full bg-panel/80 border border-white/15 text-paper font-jakarta font-bold text-sm tracking-wide hover:border-primary/50 hover:bg-panel transition-all duration-300 flex items-center gap-2 backdrop-blur-md">
                <span>{hero.secondaryCtaText}</span>
              </div>
            </MagneticButton>
          </div>

          <p className="font-mono text-[11px] text-slate/60 tracking-wide">
            {hero.note}
          </p>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-8 pt-8 w-full max-w-xl mt-3">
            {hero.metrics.map((metric, idx) => (
              <div key={idx}>
                <span className={`block font-jakarta font-black text-2xl sm:text-4xl ${idx === 1 ? 'text-primary' : 'text-paper'}`}>
                  {metric.value}
                </span>
                <span className="font-mono text-xs text-slate">{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Down Cue */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="relative z-10 mx-auto mt-8 flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity"
      >
        <a href="#about" className="flex flex-col items-center gap-1 text-slate hover:text-primary transition-colors">
          <span className="font-mono text-[10px] uppercase tracking-widest">Scroll Down</span>
          <ChevronDown className="w-4 h-4" />
        </a>
      </motion.div>
    </section>
  );
};
