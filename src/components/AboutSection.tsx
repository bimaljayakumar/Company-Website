import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSiteData } from '../context/DataContext';

gsap.registerPlugin(ScrollTrigger);

export const AboutSection: React.FC = () => {
  const { data } = useSiteData();
  const { about } = data;
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const statementText = about.description || "We turn specs into shipped software. From early concept wireframes to production infrastructure, DO Company engineers high-velocity digital products built for scale, speed, and real business impact.";

  useEffect(() => {
    if (!headingRef.current || !sectionRef.current) return;

    const words = headingRef.current.querySelectorAll('.scrub-word');

    // ScrollTrigger Scrub Word Reveal Animation
    gsap.fromTo(
      words,
      { opacity: 0.15, color: '#94a3b8' },
      {
        opacity: 1,
        color: '#ffffff',
        stagger: 0.1,
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 80%',
          end: 'bottom 40%',
          scrub: 0.5,
        },
      }
    );

    // Number Count Up Animation for Stats
    if (statsRef.current) {
      const statNumbers = statsRef.current.querySelectorAll('.stat-number');
      statNumbers.forEach((el) => {
        const targetValue = parseInt(el.getAttribute('data-target') || '0', 10);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';

        gsap.fromTo(
          el,
          { textContent: '0' },
          {
            textContent: targetValue,
            duration: 2,
            ease: 'power2.out',
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
            onUpdate: function () {
              const val = Math.round(this.targets()[0].textContent);
              this.targets()[0].innerHTML = `${prefix}${val}${suffix}`;
            },
          }
        );
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [statementText]);

  const wordsArray = statementText.split(' ');

  return (
    <section id="about" ref={sectionRef} className="py-24 sm:py-32 bg-black relative overflow-hidden">
      {/* Background Subtle Accent */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-8">
          <span className="font-mono text-xs text-primary font-bold tracking-widest uppercase">
            {about.eyebrow}
          </span>
          <div className="h-px w-12 bg-primary/40" />
        </div>

        {/* Scroll-Scrubbed Text Reveal */}
        <h2
          ref={headingRef}
          className="font-jakarta text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.2] max-w-5xl tracking-tight mb-16"
        >
          {wordsArray.map((word, i) => (
            <span key={i} className="scrub-word inline-block mr-3 transition-colors">
              {word.toLowerCase().includes('software') ? (
                <span className="font-serif italic font-normal text-primary">{word}</span>
              ) : (
                word
              )}
            </span>
          ))}
        </h2>

        {/* Stats Grid */}
        <div
          ref={statsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-white/10"
        >
          {(about.stats || [
            { id: "s1", tag: "// TOTAL DELIVERED", value: "40+", targetNum: 40, suffix: "+", description: "High-impact web apps, platforms & site-builder engines shipped worldwide." },
            { id: "s2", tag: "// CLIENT SATISFACTION", value: "98%", targetNum: 98, suffix: "%", description: "Long-term partners who rely on DO Company for enterprise engineering." },
            { id: "s3", tag: "// SPEED TO MARKET", value: "6 Wk", targetNum: 6, suffix: " Wk", description: "Average timeframe from specs sign-off to live production deployment." }
          ]).map((stat, idx) => (
            <div key={stat.id || idx} className="p-8 rounded-3xl bg-panel border border-white/10 hover:border-primary/40 transition-all duration-300 group shadow-xl">
              <div className="font-mono text-xs text-slate mb-2 uppercase">{stat.tag}</div>
              <div className={`font-jakarta font-black text-5xl flex items-baseline ${idx === 1 ? 'text-primary group-hover:text-paper' : 'text-paper group-hover:text-primary'} transition-colors`}>
                <span
                  className="stat-number"
                  data-target={stat.targetNum || parseInt(stat.value, 10) || 0}
                  data-prefix=""
                  data-suffix={
                    stat.value && stat.value.trim().endsWith('%')
                      ? '%'
                      : stat.value && stat.value.trim().endsWith('+')
                      ? '+'
                      : stat.suffix !== undefined && stat.suffix !== null
                      ? stat.suffix
                      : ''
                  }
                >
                  {stat.value}
                </span>
              </div>
              <p className="text-slate text-sm mt-3 leading-relaxed">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
