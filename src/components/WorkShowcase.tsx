import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink } from 'lucide-react';
import { useSiteData } from '../context/DataContext';

gsap.registerPlugin(ScrollTrigger);

export const WorkShowcase: React.FC = () => {
  const { data } = useSiteData();
  const { projects } = data;
  const targetRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    let ctx: gsap.Context | null = null;

    if (mediaQuery.matches && containerRef.current && targetRef.current) {
      ctx = gsap.context(() => {
        const totalWidth = targetRef.current!.scrollWidth - window.innerWidth + 120;

        gsap.to(targetRef.current, {
          x: -totalWidth,
          ease: 'none',
          force3D: true,
          scrollTrigger: {
            trigger: containerRef.current,
            pin: true,
            scrub: 0.2,
            end: () => `+=${totalWidth}`,
            invalidateOnRefresh: true,
          },
        });
      }, containerRef);
    }

    return () => {
      if (ctx) ctx.revert();
    };
  }, [projects.items]);

  return (
    <section
      id="work"
      data-no-reveal="true"
      ref={containerRef}
      className="py-24 sm:py-32 bg-black relative overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <span className="font-mono text-xs text-primary font-bold tracking-widest uppercase mb-3 block">
          {projects.eyebrow}
        </span>
        <h2 className="font-jakarta text-3xl sm:text-5xl font-black text-paper tracking-tight">
          {projects.title}
        </h2>
      </div>

      <div className="w-full overflow-x-auto md:overflow-hidden scrollbar-none">
        <div
          ref={targetRef}
          style={{ willChange: 'transform' }}
          className="flex gap-8 px-4 sm:px-6 lg:px-8 w-max pb-6 md:pb-0 transform-gpu"
        >
          {projects.items.map((project, idx) => {
            const tags = typeof project.technologies === 'string'
              ? project.technologies.split(',').map(t => t.trim()).filter(Boolean)
              : [];

            return (
              <div
                key={project.id || idx}
                className="w-[320px] sm:w-[480px] lg:w-[560px] flex-shrink-0 group rounded-3xl bg-panel border border-white/10 overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-2xl flex flex-col justify-between transform-gpu"
              >
                <div className="relative h-[240px] sm:h-[320px] w-full overflow-hidden bg-panel-light">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out filter brightness-90 group-hover:brightness-100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop';
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 font-mono text-xs text-primary">
                    {project.year || '2025'}
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow">
                  <div>
                    <span className="font-mono text-xs text-primary font-medium block mb-2">
                      {project.category}
                    </span>
                    <h3 className="font-jakarta font-black text-xl sm:text-2xl text-paper group-hover:text-primary transition-colors mb-3">
                      {project.title}
                    </h3>
                    <p className="text-slate text-xs sm:text-sm leading-relaxed mb-6">
                      {project.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                      {tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="font-mono text-[10px] sm:text-[11px] px-2.5 py-1 rounded-md bg-black border border-white/10 text-slate"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <a
                        href={project.link || '#contact'}
                        className="inline-flex items-center gap-1.5 font-jakarta text-xs font-bold text-paper hover:text-primary transition-colors"
                      >
                        <span>Case Study</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
