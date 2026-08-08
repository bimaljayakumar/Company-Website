import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustMarquee } from './components/TrustMarquee';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { WorkShowcase } from './components/WorkShowcase';
import { ProcessSection } from './components/ProcessSection';
import { FounderSection } from './components/FounderSection';
import { MentorsSection } from './components/MentorsSection';
import { TestimonialsCarousel } from './components/TestimonialsCarousel';
import { TechStackStrip } from './components/TechStackStrip';
import { CTABanner } from './components/CTABanner';
import { Footer } from './components/Footer';
import { ScrollRevealWrapper } from './components/ScrollRevealWrapper';
import { ContactModal } from './components/ContactModal';
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { AdminPanel } from './components/admin/AdminPanel';
import { EmergencyRecoveryPage } from './components/admin/EmergencyRecoveryPage';
import { useSiteData } from './context/DataContext';
import './App.css';

const MainPortfolio: React.FC = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const { data } = useSiteData();

  React.useEffect(() => {
    const compName = data.footer?.companyName || "DO Company";
    document.title = `${compName} | Software & Web Development Studio`;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', `${compName} - ${data.footer?.description || "High-performance software engineering agency specializing in custom web applications, cross-platform mobile apps, and enterprise site-builder tools."}`);
  }, [data.footer?.companyName, data.footer?.description]);

  return (
    <main className="min-h-screen bg-ink text-paper selection:bg-primary selection:text-ink relative">
      {/* Main Website Content */}
      <Navbar />

      <ScrollRevealWrapper>
        <Hero onOpenContact={() => setContactOpen(true)} />
        <TrustMarquee />
        <AboutSection />
        <ServicesSection />
        <WorkShowcase />
        <ProcessSection />
        <FounderSection />
        <MentorsSection />
        <TestimonialsCarousel />
        <TechStackStrip />
        <CTABanner />
        <Footer />
      </ScrollRevealWrapper>

      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </main>
  );
};

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPortfolio />} />
      <Route path="/admin" element={<AdminLoginPage />} />
      <Route path="/admin/dashboard" element={<AdminPanel />} />
      <Route path="/admin/emergency-recovery" element={<EmergencyRecoveryPage />} />
      <Route path="*" element={<MainPortfolio />} />
    </Routes>
  );
};

export default App;
