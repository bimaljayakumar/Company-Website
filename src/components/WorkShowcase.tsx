import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Code2 } from 'lucide-react';
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
                {project.image ? (
                  <div className="relative h-[200px] sm:h-[260px] w-full overflow-hidden bg-panel-light group">
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out filter brightness-90 group-hover:brightness-100"
                    />
                    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 font-mono text-xs text-primary">
                      {project.year || '2025'}
                    </div>
                  </div>
                ) : (
                  <div className="relative h-[200px] sm:h-[260px] w-full overflow-hidden bg-black/80 border-b border-white/10 p-6 flex flex-col justify-between group">
                    {/* Subtle Grid Lines & Ambient Glow */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/15 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-500 pointer-events-none" />

                    {/* Header Top Row */}
                    <div className="flex items-center justify-between relative z-10">
                      <span className="font-mono text-xs text-primary font-bold tracking-wider">
                        PROJECT // 0{idx + 1}
                      </span>
                      <div className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 font-mono text-xs text-primary">
                        {project.year || '2025'}
                      </div>
                    </div>

                    {/* Center Icon Graphic */}
                    <div className="flex items-center justify-center my-auto relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-panel border border-white/15 flex items-center justify-center group-hover:border-primary/60 group-hover:scale-110 transition-all duration-500 shadow-xl">
                        <Code2 className="w-8 h-8 text-primary" />
                      </div>
                    </div>

                    {/* Footer Tag */}
                    <div className="flex items-center justify-between relative z-10">
                      <span className="font-mono text-[10px] text-slate uppercase tracking-widest">
                        {project.category}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                  </div>
                )}

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
