import React from 'react';

const PARTNERS = [
  { name: 'WEB DEVELOPMENT', tag: 'Websites' },
  { name: 'APP DEVELOPMENT', tag: 'Mobile & Web Apps' },
  { name: 'EDUCATION PLATFORMS', tag: 'E-Learning' },
  { name: 'UI / UX DESIGN', tag: 'Design Systems' },
  { name: 'STARTUP SOLUTIONS', tag: 'MVP & Launch' },
  { name: 'DIGITAL PRODUCTS', tag: 'End-to-End' },
  { name: 'WEBSITE BUILDER', tag: 'No-Code Tools' },
  { name: 'PRODUCT STRATEGY', tag: 'Consulting' },
];

export const TrustMarquee: React.FC = () => {
  return (
    <section className="py-12 bg-black border-y border-white/10 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 mb-5 text-center">
        <p className="font-mono text-[11px] text-slate uppercase tracking-widest">
          Less Talk. More Shipped.
        </p>
      </div>

      <div className="relative w-full flex overflow-x-hidden group">
        {/* Gradient Fade Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        {/* Marquee Track */}
        <div className="flex animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap gap-12 sm:gap-20 items-center">
          {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-panel border border-white/10 hover:border-primary/50 transition-colors cursor-pointer shadow-lg"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-slate/40 group-hover:bg-primary transition-colors" />
              <span className="font-jakarta font-extrabold text-base tracking-wider text-slate group-hover:text-paper transition-colors">
                {partner.name}
              </span>
              <span className="font-mono text-[10px] text-primary bg-primary/15 px-2.5 py-0.5 rounded border border-primary/40 font-bold tracking-wide">
                {partner.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
