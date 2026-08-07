import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Terminal, Sparkles } from 'lucide-react';
import { GithubIcon, TwitterIcon, LinkedinIcon } from './SocialIcons';
import { useSiteData } from '../context/DataContext';

gsap.registerPlugin(ScrollTrigger);

export const FounderSection: React.FC = () => {
  const { data } = useSiteData();
  const { founder } = data;
  const imageRef = useRef<HTMLImageElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!imageRef.current || !sectionRef.current) return;
    if (window.innerWidth < 768) return; // Skip parallax on small mobile screens to prevent clipping & WebKit render bugs

    const tween = gsap.fromTo(
      imageRef.current,
      { y: -20 },
      {
        y: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );

    return () => {
      tween.kill();
    };
  }, [founder.image]);

  return (
    <section id="founder" ref={sectionRef} className="py-24 sm:py-32 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col items-start mb-16">
          <span className="font-mono text-xs text-primary font-bold tracking-widest uppercase mb-3">
            {founder.eyebrow}
          </span>
          <h2 className="font-jakarta text-3xl sm:text-5xl font-black text-paper tracking-tight">
            {founder.headline}
          </h2>
        </div>

        <div className="p-8 sm:p-12 rounded-3xl bg-panel border border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          {founder.image && !imageError ? (
            <div className="lg:col-span-5 relative overflow-hidden rounded-2xl border border-white/10 h-[380px] sm:h-[420px] bg-panel-light group">
              <img
                ref={imageRef}
                src={founder.image}
                alt={founder.name}
                loading="eager"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover object-center filter grayscale contrast-110 hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute bottom-4 left-4 bg-black/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-primary" />
                <span className="font-mono text-xs font-bold text-paper">{founder.role}</span>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-5 relative overflow-hidden rounded-2xl border border-white/10 h-[380px] sm:h-[420px] bg-black/60 p-6 flex flex-col justify-between shadow-inner group">
              {/* Ambient Glow */}
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-primary/20 rounded-full blur-2xl pointer-events-none group-hover:bg-primary/30 transition-all duration-700" />
              
              {/* Terminal Window Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className="font-mono text-[11px] text-slate/80">founder_architecture.ts</span>
              </div>

              {/* Founder Avatar Badge / Matrix Centerpiece */}
              <div className="flex-grow flex flex-col items-center justify-center my-4 relative z-10">
                <div className="w-24 h-24 rounded-2xl bg-panel border-2 border-primary/40 flex items-center justify-center shadow-lg shadow-primary/10 group-hover:border-primary transition-all duration-500 relative">
                  <span className="font-jakarta font-black text-3xl text-primary tracking-widest">
                    {founder.name ? founder.name.split(' ').map(n => n[0]).join('') : 'DO'}
                  </span>
                  <span className="absolute -bottom-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-black" />
                </div>

                <h4 className="font-jakarta font-extrabold text-lg text-paper mt-4">
                  {founder.name}
                </h4>
                <p className="font-mono text-xs text-primary/90 mt-0.5">
                  {founder.role}
                </p>
              </div>

              {/* Terminal Footer Status */}
              <div className="bg-panel-light/80 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-primary" />
                  <span className="font-mono text-xs font-bold text-paper">System Active</span>
                </div>
                <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  100% Production Ready
                </span>
              </div>
            </div>
          )}

          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-xs mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{founder.tagline}</span>
              </div>

              <h3 className="font-jakarta font-black text-3xl text-paper mb-2">
                {founder.name}
              </h3>
              <p className="font-mono text-xs text-primary mb-6">
                {founder.role}
              </p>

              <blockquote className="text-slate text-base sm:text-lg leading-relaxed font-sans mb-6 border-l-2 border-primary pl-4 italic">
                "{founder.quote}"
              </blockquote>

              <p className="text-slate text-sm leading-relaxed">
                {founder.bio}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3">
                <a
                  href={founder.github}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center text-slate hover:text-primary hover:border-primary/50 transition-colors"
                  aria-label="GitHub"
                >
                  <GithubIcon className="w-5 h-5" />
                </a>
                <a
                  href={founder.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center text-slate hover:text-primary hover:border-primary/50 transition-colors"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon className="w-5 h-5" />
                </a>
                <a
                  href={founder.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center text-slate hover:text-primary hover:border-primary/50 transition-colors"
                  aria-label="Twitter"
                >
                  <TwitterIcon className="w-5 h-5" />
                </a>
              </div>

              <div className="font-mono text-xs text-slate">
                {founder.contributionNote}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
