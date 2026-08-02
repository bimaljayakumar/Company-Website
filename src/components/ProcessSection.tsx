import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Code, ShieldCheck } from 'lucide-react';
import { useSiteData } from '../context/DataContext';

gsap.registerPlugin(ScrollTrigger);

const ICONS = [Search, Code, ShieldCheck];

export const ProcessSection: React.FC = () => {
  const { data } = useSiteData();
  const { process } = data;
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !progressBarRef.current) return;

    gsap.fromTo(
      progressBarRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'bottom 50%',
          scrub: 0.5,
        },
      }
    );
  }, []);

  return (
    <section id="process" ref={sectionRef} className="py-24 sm:py-32 bg-black relative select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col items-start mb-16">
          <span className="font-mono text-xs text-primary font-bold tracking-widest uppercase mb-3">
            {process.eyebrow}
          </span>
          <h2 className="font-jakarta text-3xl sm:text-5xl font-black text-paper tracking-tight">
            {process.title}
          </h2>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 z-0">
            <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-primary to-secondary origin-left"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {process.steps.map((stage, idx) => {
              const IconComp = ICONS[idx % ICONS.length];
              return (
                <div
                  key={stage.id || idx}
                  className="p-8 rounded-3xl bg-panel border border-white/10 hover:border-primary/50 transition-all duration-300 group shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <span className="font-mono text-4xl font-black text-primary/40 group-hover:text-primary transition-colors">
                        {stage.number || `0${idx + 1}`}
                      </span>
                      <div className="w-12 h-12 rounded-2xl bg-panel-light border border-white/10 flex items-center justify-center text-paper group-hover:bg-primary group-hover:text-ink transition-all duration-300">
                        <IconComp className="w-6 h-6" />
                      </div>
                    </div>

                    <span className="font-mono text-xs text-primary font-semibold tracking-wider block mb-1">
                      STAGE 0{idx + 1}
                    </span>
                    <h3 className="font-jakarta font-black text-2xl text-paper mb-4">
                      {stage.title}
                    </h3>
                    <p className="text-slate text-sm leading-relaxed mb-6">
                      {stage.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
