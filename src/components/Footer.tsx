import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { GithubIcon, TwitterIcon, LinkedinIcon } from './SocialIcons';
import { useSiteData } from '../context/DataContext';
import { useAdminAuth } from '../context/AdminAuthContext';

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { data } = useSiteData();
  const { triggerSecretAccess, triggerEmergencyRecovery } = useAdminAuth();
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const pendingLoginTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyrightClick = () => {
    const now = Date.now();

    // If more than 2 seconds (2000ms) pass between clicks, reset counter and pending timer
    if (now - lastClickTime > 2000) {
      if (pendingLoginTimer.current) {
        clearTimeout(pendingLoginTimer.current);
        pendingLoginTimer.current = null;
      }
      setClickCount(1);
    } else {
      const newCount = clickCount + 1;
      setClickCount(newCount);

      // If user continues clicking past 5 clicks (6, 7, 8...), cancel normal login timer because it's an emergency trigger!
      if (newCount > 5 && pendingLoginTimer.current) {
        clearTimeout(pendingLoginTimer.current);
        pendingLoginTimer.current = null;
      }

      if (newCount === 5) {
        // 5 Clicks: Set a 3-second delay. If user stops clicking, proceed to normal admin login!
        pendingLoginTimer.current = setTimeout(() => {
          triggerSecretAccess();
          setClickCount(0);
          navigate('/admin');
        }, 3000);
      } else if (newCount === 20) {
        // 20 Clicks: Immediately trigger Emergency Recovery Gateway!
        if (pendingLoginTimer.current) {
          clearTimeout(pendingLoginTimer.current);
          pendingLoginTimer.current = null;
        }
        triggerEmergencyRecovery();
        setClickCount(0);
        navigate('/admin/emergency-recovery');
      }
    }
    setLastClickTime(now);
  };

  const { footer } = data;

  const handleFooterNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
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
    <footer className="bg-black text-slate border-t border-white/10 pt-16 pb-12 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-white/10">
          
          <div className="lg:col-span-2 space-y-4">
            <a
              href="#"
              onClick={(e) => handleFooterNavClick(e, '#')}
              className="flex items-center gap-2 group"
            >
              <div className="w-9 h-9 rounded-xl bg-panel border border-white/15 flex items-center justify-center group-hover:border-primary/50 transition-colors shadow-lg">
                <span className="font-jakarta text-lg font-black tracking-tighter text-paper group-hover:text-primary transition-colors">
                  DO
                </span>
              </div>
              <span className="w-2 h-2 rounded-full bg-primary" />
            </a>
            <p className="font-sans text-sm text-slate leading-relaxed max-w-sm">
              {footer.description}
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={footer.github}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-panel border border-white/10 text-slate hover:text-primary hover:border-primary/50 transition-colors"
                aria-label="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href={footer.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-panel border border-white/10 text-slate hover:text-primary hover:border-primary/50 transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href={footer.twitter}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-panel border border-white/10 text-slate hover:text-primary hover:border-primary/50 transition-colors"
                aria-label="Twitter"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs font-bold text-paper uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 font-sans text-sm">
              {(footer.navLinks || [
                { id: "nav-1", label: "Services", href: "#services" },
                { id: "nav-2", label: "Selected Work", href: "#work" },
                { id: "nav-3", label: "Engineering Process", href: "#process" },
                { id: "nav-4", label: "Leadership", href: "#founder" },
                { id: "nav-5", label: "Advisors", href: "#mentors" }
              ]).map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={(e) => handleFooterNavClick(e, item.href)}
                    className="hover:text-primary transition-colors cursor-pointer"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-bold text-paper uppercase tracking-wider mb-4">
              Capabilities
            </h4>
            <ul className="space-y-2.5 font-sans text-sm">
              {(footer.capabilities || [
                { id: "cap-1", label: "Full-Stack Web Dev" },
                { id: "cap-2", label: "React Native Apps" },
                { id: "cap-3", label: "No-Code Builder Tools" },
                { id: "cap-4", label: "Microservice Architecture" },
                { id: "cap-5", label: "Performance Auditing" }
              ]).map((item) => (
                <li key={item.id}>
                  <span className="text-slate">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-bold text-paper uppercase tracking-wider mb-4">
              Office
            </h4>
            <address className="not-italic font-sans text-sm space-y-2 text-slate">
              <p>{footer.addressLine1}</p>
              <p>{footer.addressLine2}</p>
              <p className="pt-2 text-primary font-mono text-xs font-bold">{footer.email}</p>
            </address>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-slate">
          
          {/* Secret Trigger Copyright Text */}
          <div
            onClick={handleCopyrightClick}
            className="cursor-default select-none"
          >
            <span>{footer.copyrightText}</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-paper hover:text-primary transition-colors focus:outline-none"
          >
            <span>Back to top</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
