import React from 'react';
import { motion } from 'framer-motion';
import { useSiteData } from '../context/DataContext';

const STACK_ITEMS = [
  { name: 'React', icon: '⚛️', category: 'Frontend' },
  { name: 'Next.js', icon: '▲', category: 'Fullstack' },
  { name: 'TypeScript', icon: 'TS', category: 'Core Language' },
  { name: 'Node.js', icon: '🟢', category: 'Backend' },
  { name: 'Python', icon: '🐍', category: 'AI & Data' },
  { name: 'Three.js', icon: '🧊', category: '3D Graphics' },
  { name: 'Tailwind CSS', icon: '🎨', category: 'Styling' },
  { name: 'GraphQL', icon: '🕸️', category: 'API Engine' },
  { name: 'AWS Cloud', icon: '☁️', category: 'Infrastructure' },
  { name: 'Docker', icon: '🐳', category: 'Containers' },
];

export const TechStackStrip: React.FC = () => {
  const { data } = useSiteData();
  const toolkit = data.toolkit || {
    eyebrow: "// OUR TOOLKIT",
    title: "Engineered with modern, battle-tested technologies."
  };

  return (
    <section className="py-20 bg-black border-y border-white/10 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col items-center text-center mb-12">
          <span className="font-mono text-xs text-primary font-bold tracking-widest uppercase mb-2">
            {toolkit.eyebrow}
          </span>
          <h2 className="font-jakarta text-2xl sm:text-3xl font-black text-paper">
            {toolkit.title}
          </h2>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {STACK_ITEMS.map((item, idx) => (
            <motion.div
              key={idx}
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
                delay: idx * 0.25,
              }}
              className="px-5 py-3 rounded-2xl bg-panel border border-white/10 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 group cursor-pointer flex items-center gap-3"
            >
              <span className="text-xl group-hover:scale-125 transition-transform duration-300">
                {item.icon}
              </span>
              <div className="text-left">
                <span className="font-jakarta font-black text-sm text-paper group-hover:text-primary transition-colors block">
                  {item.name}
                </span>
                <span className="font-mono text-[10px] text-slate block">
                  {item.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
