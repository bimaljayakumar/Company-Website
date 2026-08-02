import React from 'react';
import { motion } from 'framer-motion';
import { useSiteData } from '../context/DataContext';

export const MentorsSection: React.FC = () => {
  const { data } = useSiteData();
  const { mentors } = data;

  return (
    <section id="mentors" className="py-24 sm:py-32 bg-black relative select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col items-start mb-16">
          <span className="font-mono text-xs text-primary font-bold tracking-widest uppercase mb-3">
            {mentors.eyebrow}
          </span>
          <h2 className="font-jakarta text-3xl sm:text-5xl font-black text-paper tracking-tight">
            {mentors.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {mentors.items.map((mentor, idx) => (
            <motion.div
              key={mentor.id || idx}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 rounded-3xl bg-panel border border-white/10 hover:border-primary/50 transition-all duration-300 group flex flex-col justify-between shadow-xl"
            >
              <div>
                {mentor.image ? (
                  <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-5 bg-panel-light group">
                    <img
                      src={mentor.image}
                      alt={mentor.name}
                      loading="lazy"
                      className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 font-mono text-[10px] text-primary">
                      {mentor.tag}
                    </div>
                  </div>
                ) : (
                  <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-5 bg-black/60 border border-white/10 p-6 flex flex-col items-center justify-center group-hover:border-primary/40 transition-all duration-300">
                    <div className="w-20 h-20 rounded-2xl bg-panel border-2 border-primary/40 flex items-center justify-center shadow-lg shadow-primary/10 group-hover:scale-105 transition-all duration-300">
                      <span className="font-jakarta font-black text-2xl text-primary tracking-widest">
                        {mentor.name ? mentor.name.split(' ').map(n => n[0]).join('') : 'DO'}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 font-mono text-[10px] text-primary">
                      {mentor.tag}
                    </div>
                  </div>
                )}

                <h3 className="font-jakarta font-black text-xl text-paper group-hover:text-primary transition-colors">
                  {mentor.name}
                </h3>
                <p className="font-mono text-xs text-primary/80 mt-1 mb-3">
                  {mentor.role}
                </p>
                <p className="text-slate text-xs leading-relaxed">
                  Specialty: <span className="text-paper font-semibold">{mentor.specialty}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
