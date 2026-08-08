import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteData } from '../context/DataContext';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const { data } = useSiteData();
  const companyLogo = data?.footer?.companyLogo;
  const companyName = data?.footer?.companyName || 'DO COMPANY';

  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 8) + 4;
      if (current >= 100) {
        current = 100;
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setIsDone(true);
          setTimeout(onComplete, 700);
        }, 400);
      } else {
        setProgress(current);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [onComplete]);

  const getStatusText = (p: number) => {
    if (p < 30) return '// INITIALIZING CORE SYSTEMS';
    if (p < 65) return '// LOADING HIGH-PERFORMANCE ASSETS';
    if (p < 95) return '// FINALIZING ARCHITECTURE';
    return '// READY TO SHIP';
  };

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
          exit={{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black select-none overflow-hidden"
        >
          {/* Subtle Ambient Radial Glow & Grid Background */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(0,255,157,0.12),transparent_60%)]" />
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />

          {/* Main Preloader Content Card */}
          <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6 text-center">
            
            {/* Logo Container */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="mb-8 flex flex-col items-center gap-3"
            >
              {companyLogo && !imageError ? (
                <div className="relative group p-3.5 rounded-2xl bg-panel/80 border border-white/15 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,255,157,0.2)]">
                  <img
                    src={companyLogo}
                    alt={companyName}
                    onError={() => setImageError(true)}
                    className="h-14 sm:h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(0,255,157,0.4)]"
                  />
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/30 to-emerald-500/30 blur-md -z-10 animate-pulse" />
                </div>
              ) : (
                <div className="relative p-4 rounded-2xl bg-panel/80 border border-primary/40 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,255,157,0.25)] flex items-center justify-center gap-2">
                  <span className="font-jakarta font-black text-3xl tracking-widest text-paper uppercase">
                    {companyName}
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                </div>
              )}

              {/* Company Title */}
              {companyLogo && !imageError && (
                <h1 className="font-jakarta font-black text-sm tracking-widest text-paper uppercase opacity-90">
                  {companyName}
                </h1>
              )}
            </motion.div>

            {/* Large Tech Percentage Counter */}
            <div className="flex items-baseline gap-1 font-mono text-5xl sm:text-6xl font-black text-paper tracking-tighter mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-paper via-white to-primary">
                {String(progress).padStart(3, '0')}
              </span>
              <span className="text-primary text-2xl font-bold">%</span>
            </div>

            {/* Glowing Neon Progress Bar */}
            <div className="relative w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-5 border border-white/10 p-[1px]">
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-emerald-400 to-primary rounded-full shadow-[0_0_12px_#00ff9d]"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
            </div>

            {/* Status Indicator Label */}
            <div className="font-mono text-[10px] sm:text-xs text-primary/80 tracking-widest uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
              <span>{getStatusText(progress)}</span>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
