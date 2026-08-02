import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { useSiteData } from '../context/DataContext';

export const TestimonialsCarousel: React.FC = () => {
  const { data } = useSiteData();
  const { testimonials } = data;
  const items = testimonials.items && testimonials.items.length > 0 ? testimonials.items : [];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (items.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (items.length === 0) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const current = items[currentIndex % items.length];

  return (
    <section className="py-24 sm:py-32 bg-black border-t border-white/10 relative select-none">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col items-center text-center mb-12">
          <span className="font-mono text-xs text-primary font-bold tracking-widest uppercase mb-3">
            {testimonials.eyebrow}
          </span>
          <h2 className="font-jakarta text-3xl sm:text-4xl font-black text-paper tracking-tight">
            {testimonials.title}
          </h2>
        </div>

        <div className="relative p-8 sm:p-14 rounded-3xl bg-panel border border-white/10 shadow-2xl overflow-hidden">
          
          <Quote className="absolute top-6 left-6 w-24 h-24 text-white/[0.02] pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center text-center relative z-10"
            >
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>

              <p className="font-sans text-lg sm:text-2xl text-paper leading-relaxed max-w-3xl mb-8 font-medium">
                "{current.quote}"
              </p>

              <div className="flex items-center gap-4">
                {current.image ? (
                  <img
                    src={current.image}
                    alt={current.author}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center font-mono font-bold text-primary text-base shadow-lg shrink-0">
                    {current.author ? current.author.charAt(0) : 'U'}
                  </div>
                )}
                <div className="text-left">
                  <h4 className="font-jakarta font-black text-base text-paper">
                    {current.author}
                  </h4>
                  <p className="font-mono text-xs text-slate">{current.role} {current.company ? `@ ${current.company}` : ''}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/10 relative z-10">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-full bg-panel-light border border-white/10 text-paper hover:text-primary hover:border-primary/40 transition-colors focus:outline-none"
                aria-label="Previous quote"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-2.5 rounded-full bg-panel-light border border-white/10 text-paper hover:text-primary hover:border-primary/40 transition-colors focus:outline-none"
                aria-label="Next quote"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-white/20'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
