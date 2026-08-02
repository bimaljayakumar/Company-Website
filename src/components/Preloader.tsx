import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 12) + 8;
      if (current >= 100) {
        current = 100;
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setIsDone(true);
          setTimeout(onComplete, 600); // Allow clip-path wipe animation to complete
        }, 300);
      } else {
        setProgress(current);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
          exit={{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-ink select-none"
        >
          {/* Logo & Counter Container */}
          <div className="flex flex-col items-center gap-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2"
            >
              <div className="w-12 h-12 rounded-xl bg-panel border border-white/10 flex items-center justify-center shadow-lg shadow-primary/10">
                <span className="font-jakarta font-extrabold text-2xl tracking-tighter text-paper">
                  DO
                </span>
                <span className="w-2 h-2 rounded-full bg-primary mb-3 ml-0.5 animate-pulse" />
              </div>
            </motion.div>

            {/* Percentage count in mono font */}
            <div className="font-mono text-sm tracking-widest text-slate flex items-center gap-2">
              <span className="text-primary">{String(progress).padStart(3, '0')}</span>
              <span>%</span>
            </div>

            {/* Subtle Progress Bar */}
            <div className="w-48 h-1 bg-panel rounded-full overflow-hidden border border-white/5">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-secondary"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
