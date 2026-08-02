import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Preloader } from './components/Preloader';
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
import './App.css';

const MainPortfolio: React.FC = () => {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <main className="min-h-screen bg-ink text-paper selection:bg-primary selection:text-ink relative">
      {/* Branded Preloader */}
      <Preloader onComplete={() => {}} />

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
