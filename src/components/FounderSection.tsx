import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (!imageRef.current || !sectionRef.current) return;

    gsap.fromTo(
      imageRef.current,
      { y: -30 },
      {
        y: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  }, []);

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

          <div className="lg:col-span-5 relative overflow-hidden rounded-2xl border border-white/10 h-[380px] sm:h-[420px] bg-panel-light">
            <img
              ref={imageRef}
              src={founder.image}
              alt={founder.name}
              loading="lazy"
              className="w-full h-[120%] object-cover object-center filter grayscale contrast-110 hover:grayscale-0 transition-all duration-500"
            />
            <div className="absolute bottom-4 left-4 bg-black/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-primary" />
              <span className="font-mono text-xs font-bold text-paper">{founder.role}</span>
            </div>
          </div>

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
