import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { useSiteData } from '../context/DataContext';

const NAV_LINKS = [
  { name: 'SERVICES', href: '#services' },
  { name: 'WORK', href: '#work' },
  { name: 'PROCESS', href: '#process' },
  { name: 'FOUNDER', href: '#founder' },
  { name: 'MENTORS', href: '#mentors' },
  { name: 'CONTACT', href: '#contact' },
];

export const Navbar: React.FC = () => {
  const { data } = useSiteData();
  const { footer } = data;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.replace('#', '');
      if (!targetId) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const targetElem = document.getElementById(targetId);
      if (targetElem) {
        const yOffset = -70;
        const y = targetElem.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* Fixed Wrapper centered at top */}
      <div className="fixed top-4 sm:top-6 left-0 right-0 z-50 px-4 pointer-events-none">
        <header
          className={`max-w-6xl mx-auto pointer-events-auto rounded-full transition-all duration-500 border ${
            isScrolled
              ? 'bg-panel/85 backdrop-blur-2xl border-white/15 py-2.5 px-4 sm:px-6 shadow-[0_16px_50px_rgba(0,0,0,0.9)] shadow-black'
              : 'bg-panel/60 backdrop-blur-xl border-white/10 py-3 px-5 sm:px-7 shadow-2xl'
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            
            {/* Left: Brand Logo */}
            <a
              href="#"
              onClick={(e) => handleNavClick(e, '#')}
              className="flex items-center gap-2.5 group focus:outline-none flex-shrink-0 max-w-[180px] sm:max-w-[280px] md:max-w-none"
            >
              {footer?.companyLogo && (
                <img
                  src={footer.companyLogo}
                  alt={footer?.companyName || "Logo"}
                  className="h-6 sm:h-7 w-auto object-contain shrink-0 rounded-md"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              )}
              <span className="font-jakarta text-xs sm:text-sm font-black tracking-wider text-paper uppercase truncate max-w-[90px] sm:max-w-[180px] md:max-w-[220px]">
                {footer?.companyName || "DO Company"}
              </span>
            </a>

            {/* Center: Desktop Nav Links inside the single glass bar */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  onMouseEnter={() => setHoveredLink(link.name)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="relative font-jakarta text-[11px] font-bold tracking-widest text-slate hover:text-paper transition-colors py-1 focus:outline-none cursor-pointer"
                >
                  {link.name}
                  {hoveredLink === link.name && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full shadow-[0_0_8px_#00ff9d]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              ))}
            </nav>

            {/* Right: Status Pill & CTA Button */}
            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
              <MagneticButton href="#contact" strength={15} onClick={() => {
                const elem = document.getElementById('contact');
                if (elem) {
                  const y = elem.getBoundingClientRect().top + window.pageYOffset - 70;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}>
                <div className="px-4 sm:px-5 py-2 rounded-full bg-primary text-ink font-jakarta text-xs font-extrabold tracking-wide hover:bg-white hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 flex items-center gap-1.5 cursor-pointer">
                  <span>Start a Project</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </MagneticButton>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-full bg-black/80 border border-white/15 text-paper hover:text-primary transition-colors focus:outline-none cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/98 backdrop-blur-3xl flex flex-col justify-center px-8 lg:hidden"
          >
            <div className="flex flex-col gap-6 max-w-md mx-auto w-full">
              {NAV_LINKS.map((link, idx) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleNavClick(e, link.href);
                  }}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.07, duration: 0.3 }}
                  className="font-jakarta text-2xl font-extrabold text-paper hover:text-primary transition-colors flex items-center justify-between border-b border-white/10 pb-4 cursor-pointer"
                >
                  <span>{link.name}</span>
                  <ArrowUpRight className="w-5 h-5 text-slate" />
                </motion.a>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.07 }}
                className="mt-4"
              >
                <a
                  href="#contact"
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleNavClick(e, '#contact');
                  }}
                  className="w-full py-4 rounded-full bg-primary text-ink text-center font-jakarta font-extrabold text-sm block shadow-lg shadow-primary/20 cursor-pointer"
                >
                  Start a Project
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
