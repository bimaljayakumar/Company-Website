import React, { createContext, useContext, useState, useEffect } from 'react';
import initialSiteData from '../data/siteData.json';

export interface HeroData {
  eyebrow: string;
  headlineWord1: string;
  headlineWord2: string;
  headlineWord3: string;
  headlineWord4: string;
  glowingTarget?: 'NEXT' | 'BUILD' | 'WHATS' | 'ALL' | 'NONE';
  glowingWords?: {
    word1?: boolean;
    word2?: boolean;
    word3?: boolean;
    word4?: boolean;
    build?: boolean;
    whats?: boolean;
    next?: boolean;
  };
  videoUrl?: string;
  videoOpacity?: number;
  description: string;
  pillars: string[];
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  note: string;
  metrics: { label: string; value: string }[];
}

export interface AboutExperience {
  id: string;
  position: string;
  company: string;
  period: string;
  location: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
}

export interface AboutStat {
  id: string;
  tag: string;
  value: string;
  targetNum: number;
  suffix: string;
  description: string;
}

export interface AboutData {
  eyebrow: string;
  title: string;
  description: string;
  stats: AboutStat[];
  experiences: AboutExperience[];
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  details: string;
  tools: string[];
}

export interface ServicesData {
  eyebrow: string;
  title: string;
  videoUrl?: string;
  items: ServiceItem[];
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  technologies: string;
  image: string;
  description: string;
  year?: string;
  link?: string;
}

export interface ProjectsData {
  eyebrow: string;
  title: string;
  items: ProjectItem[];
}

export interface ProcessStep {
  id: string;
  number: string;
  title: string;
  description: string;
}

export interface ProcessData {
  eyebrow: string;
  title: string;
  steps: ProcessStep[];
}

export interface FounderData {
  eyebrow: string;
  headline: string;
  name: string;
  role: string;
  tagline: string;
  quote: string;
  bio: string;
  image: string;
  github: string;
  linkedin: string;
  twitter: string;
  contributionNote: string;
}

export interface MentorItem {
  id: string;
  name: string;
  role: string;
  specialty: string;
  image: string;
  tag: string;
}

export interface MentorsData {
  eyebrow: string;
  title: string;
  items: MentorItem[];
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  image: string;
}

export interface TestimonialsData {
  eyebrow: string;
  title: string;
  items: TestimonialItem[];
}

export interface CtaBannerData {
  eyebrow: string;
  title: string;
  subtitle: string;
  email: string;
  phone: string;
  buttonText: string;
}

export interface FooterNavLink {
  id: string;
  label: string;
  href: string;
}

export interface FooterCapability {
  id: string;
  label: string;
}

export interface FooterData {
  companyName: string;
  description: string;
  addressLine1: string;
  addressLine2: string;
  email: string;
  copyrightText: string;
  github: string;
  linkedin: string;
  twitter: string;
  navLinks: FooterNavLink[];
  capabilities: FooterCapability[];
}

export interface MessageItem {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  date: string;
  read: boolean;
}

export interface ToolkitData {
  eyebrow: string;
  title: string;
}

export interface CloudinaryConfigData {
  cloudName: string;
  uploadPreset: string;
}

export interface SiteData {
  hero: HeroData;
  about: AboutData;
  services: ServicesData;
  projects: ProjectsData;
  process: ProcessData;
  founder: FounderData;
  mentors: MentorsData;
  testimonials: TestimonialsData;
  toolkit: ToolkitData;
  cta: CtaBannerData;
  footer: FooterData;
  messages: MessageItem[];
  cloudinary?: CloudinaryConfigData;
}

const DEFAULT_SITE_DATA: SiteData = initialSiteData as SiteData;

const STORAGE_KEY = "docompany_portfolio_site_data_v1";
const PERMANENT_DEFAULT_KEY = "docompany_permanent_default_data_v1";

const getBaselineDefaults = (): SiteData => {
  try {
    const customDefault = localStorage.getItem(PERMANENT_DEFAULT_KEY);
    if (customDefault) {
      return { ...DEFAULT_SITE_DATA, ...JSON.parse(customDefault) };
    }
  } catch (e) {
    console.error("Failed to load permanent defaults:", e);
  }
  return DEFAULT_SITE_DATA;
};

// Global Persistence Syncer
const saveDataGlobally = async (nextState: SiteData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    localStorage.setItem(PERMANENT_DEFAULT_KEY, JSON.stringify(nextState));
    
    // Send to Vite / API server to save directly to disk at src/data/siteData.json
    await fetch("/api/save-site-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextState)
    }).catch(() => {});
  } catch (e) {
    console.error("Failed to sync site data globally:", e);
  }
};

interface DataContextType {
  data: SiteData;
  updateSection: <K extends keyof SiteData>(section: K, newData: Partial<SiteData[K]>) => void;
  addArrayItem: <K extends keyof SiteData>(section: K, arrayKey: string, item: any) => void;
  updateArrayItem: <K extends keyof SiteData>(section: K, arrayKey: string, id: string, updatedItem: any) => void;
  deleteArrayItem: <K extends keyof SiteData>(section: K, arrayKey: string, id: string) => void;
  addMessage: (msg: { name: string; email: string; subject?: string; message: string }) => void;
  deleteMessage: (id: string) => void;
  resetToDefaults: () => void;
  setAsPermanentDefaults: () => void;
  resetToFactoryDefaults: () => void;
  hasPermanentDefaults: boolean;
  importDataJSON: (jsonString: string) => boolean;
  exportDataJSON: () => string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasPermanentDefaults, setHasPermanentDefaults] = useState<boolean>(() => {
    return Boolean(localStorage.getItem(PERMANENT_DEFAULT_KEY));
  });

  const [data, setData] = useState<SiteData>(() => {
    const baseline = getBaselineDefaults();
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...baseline, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error("Failed to load local site data:", e);
    }
    return baseline;
  });

  useEffect(() => {
    saveDataGlobally(data);
  }, [data]);

  const updateSection = <K extends keyof SiteData>(section: K, newData: Partial<SiteData[K]>) => {
    setData((prev) => {
      const nextState = {
        ...prev,
        [section]: {
          ...prev[section],
          ...newData
        }
      };
      saveDataGlobally(nextState);
      return nextState;
    });
  };

  const addArrayItem = <K extends keyof SiteData>(section: K, arrayKey: string, item: any) => {
    setData((prev) => {
      const sectionObj = prev[section] as any;
      const currentArray = Array.isArray(sectionObj[arrayKey]) ? sectionObj[arrayKey] : [];
      const newItem = { id: `item-${Date.now()}`, ...item };
      const nextState = {
        ...prev,
        [section]: {
          ...sectionObj,
          [arrayKey]: [...currentArray, newItem]
        }
      };
      saveDataGlobally(nextState);
      return nextState;
    });
  };

  const updateArrayItem = <K extends keyof SiteData>(section: K, arrayKey: string, id: string, updatedItem: any) => {
    setData((prev) => {
      const sectionObj = prev[section] as any;
      const currentArray = Array.isArray(sectionObj[arrayKey]) ? sectionObj[arrayKey] : [];
      const nextState = {
        ...prev,
        [section]: {
          ...sectionObj,
          [arrayKey]: currentArray.map((item: any) => (item.id === id ? { ...item, ...updatedItem } : item))
        }
      };
      saveDataGlobally(nextState);
      return nextState;
    });
  };

  const deleteArrayItem = <K extends keyof SiteData>(section: K, arrayKey: string, id: string) => {
    setData((prev) => {
      const sectionObj = prev[section] as any;
      const currentArray = Array.isArray(sectionObj[arrayKey]) ? sectionObj[arrayKey] : [];
      const nextState = {
        ...prev,
        [section]: {
          ...sectionObj,
          [arrayKey]: currentArray.filter((item: any) => item.id !== id)
        }
      };
      saveDataGlobally(nextState);
      return nextState;
    });
  };

  const addMessage = (msg: { name: string; email: string; subject?: string; message: string }) => {
    const newMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      name: msg.name,
      email: msg.email,
      subject: msg.subject || "Website Form Inquiry",
      message: msg.message,
      date: new Date().toLocaleString(),
      read: false
    };
    setData((prev) => {
      const nextState = {
        ...prev,
        messages: [newMsg, ...prev.messages]
      };
      saveDataGlobally(nextState);
      return nextState;
    });
  };

  const deleteMessage = (id: string) => {
    setData((prev) => {
      const nextState = {
        ...prev,
        messages: prev.messages.filter((m) => m.id !== id)
      };
      saveDataGlobally(nextState);
      return nextState;
    });
  };

  const resetToDefaults = () => {
    const baseline = getBaselineDefaults();
    setData(baseline);
    saveDataGlobally(baseline);
  };

  const setAsPermanentDefaults = () => {
    saveDataGlobally(data);
    setHasPermanentDefaults(true);
  };

  const resetToFactoryDefaults = () => {
    setData(DEFAULT_SITE_DATA);
    localStorage.removeItem(PERMANENT_DEFAULT_KEY);
    localStorage.removeItem(STORAGE_KEY);
    setHasPermanentDefaults(false);
    saveDataGlobally(DEFAULT_SITE_DATA);
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object') {
        const baseline = getBaselineDefaults();
        const nextState = { ...baseline, ...parsed };
        setData(nextState);
        saveDataGlobally(nextState);
        return true;
      }
    } catch (e) {
      console.error("Invalid JSON format", e);
    }
    return false;
  };

  const exportDataJSON = (): string => {
    return JSON.stringify(data, null, 2);
  };

  return (
    <DataContext.Provider
      value={{
        data,
        updateSection,
        addArrayItem,
        updateArrayItem,
        deleteArrayItem,
        addMessage,
        deleteMessage,
        resetToDefaults,
        setAsPermanentDefaults,
        resetToFactoryDefaults,
        hasPermanentDefaults,
        importDataJSON,
        exportDataJSON
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useSiteData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useSiteData must be used within a DataProvider");
  }
  return context;
};
