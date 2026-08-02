import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  // Smooth springs for cursor movement
  const cursorX = useSpring(-100, { stiffness: 400, damping: 28 });
  const cursorY = useSpring(-100, { stiffness: 400, damping: 28 });

  const dotX = useSpring(-100, { stiffness: 1000, damping: 50 });
  const dotY = useSpring(-100, { stiffness: 1000, damping: 50 });

  useEffect(() => {
    // Check touch device or reduced motion
    const touchMedia = window.matchMedia('(pointer: coarse)');
    const reduceMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (touchMedia.matches || reduceMotionMedia.matches) {
      setIsTouch(true);
      return;
    }

    document.body.classList.add('custom-cursor-active');

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      dotX.set(e.clientX);
      dotY.set(e.clientY);

      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = !!target.closest('a, button, [role="button"], input, textarea, select, .cursor-pointer, [data-cursor]');
        setIsHovered(isClickable);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, dotX, dotY, isVisible]);

  if (isTouch) return null;

  return (
    <>
      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border border-primary/60 mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovered ? 48 : 24,
          height: isHovered ? 48 : 24,
          backgroundColor: isHovered ? 'rgba(94, 210, 156, 0.15)' : 'rgba(94, 210, 156, 0)',
          borderColor: isHovered ? 'rgba(94, 210, 156, 0.9)' : 'rgba(94, 210, 156, 0.5)',
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      />
      {/* Center Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-primary"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovered ? 8 : 4,
          height: isHovered ? 8 : 4,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.1 }}
      />
    </>
  );
};
