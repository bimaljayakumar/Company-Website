import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Smartphone, GraduationCap, Building2, Palette, FileText } from 'lucide-react';
import { useSiteData } from '../context/DataContext';

const ICONS = [Code2, Smartphone, GraduationCap, Building2, Palette, FileText];

export const ServicesSection: React.FC = () => {
  const { data } = useSiteData();
  const { services } = data;

  return (
    <section id="services" className="py-24 sm:py-32 bg-black relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          key={services.videoUrl || 'services-bg-video'}
          className="w-full h-full object-cover mix-blend-screen"
          style={{ opacity: `${(services.videoOpacity ?? 25) / 100}` }}
        >
          <source src={services.videoUrl || "/services-background.mp4"} type="video/mp4" />
        </video>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black pointer-events-none z-0" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-start mb-16">
          <span className="font-mono text-xs text-primary font-bold tracking-widest uppercase mb-3">
            {services.eyebrow}
          </span>
          <h2 className="font-jakarta text-3xl sm:text-5xl font-black text-paper tracking-tight max-w-2xl">
            {services.title}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.items.map((service, index) => {
            const IconComponent = ICONS[index % ICONS.length];
            const tools = service.tools || [];
            return (
              <motion.div
                key={service.id || index}
                whileHover={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ willChange: 'transform' }}
                className="relative rounded-2xl border border-white/15 hover:border-primary/50 transition-all duration-300 group overflow-hidden shadow-xl flex flex-col p-6 bg-panel/90 transform-gpu"
              >
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all pointer-events-none" />

                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-panel-light border border-white/15 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-ink transition-all duration-300">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-[10px] text-slate font-semibold tracking-wider">[ 0{index + 1} / SERVICE ]</span>
                </div>

                <h3 className="font-jakarta font-black text-lg text-paper group-hover:text-primary transition-colors mb-2">
                  {service.title}
                </h3>
                <p className="text-slate text-xs leading-relaxed flex-1">
                  {service.description || service.details}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-white/10">
                  {tools.map((feat, idx) => (
                    <span key={idx} className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-black/60 border border-white/15 text-slate group-hover:border-primary/30 group-hover:text-paper transition-all">
                      {feat}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
