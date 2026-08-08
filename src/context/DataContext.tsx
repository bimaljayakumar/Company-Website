import React, { createContext, useContext, useState } from 'react';
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
  videoOpacity?: number;
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
  eyebrow?: string;
  headline?: string;
  name?: string;
  role?: string;
  tagline?: string;
  quote?: string;
  bio?: string;
  image?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  contributionNote?: string;
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
  companyName?: string;
  companyLogo?: string;
  description?: string;
  addressLine1?: string;
  addressLine2?: string;
  email?: string;
  copyrightText?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  navLinks?: FooterNavLink[];
  capabilities?: FooterCapability[];
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

export interface NavbarNavLink {
  id: string;
  name: string;
  href: string;
}

export interface NavbarData {
  ctaText?: string;
  ctaLink?: string;
  navLinks?: NavbarNavLink[];
}

export interface SiteData {
  version?: number | string;
  navbar?: NavbarData;
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

const DEFAULT_SITE_DATA: SiteData = initialSiteData as unknown as SiteData;

const STORAGE_KEY = "docompany_portfolio_site_data_v1";
const PERMANENT_DEFAULT_KEY = "docompany_permanent_default_data_v1";
const VERSION_KEY = "docompany_site_data_version_v1";

const getBaselineDefaults = (): SiteData => {
  try {
    const savedVersion = localStorage.getItem(VERSION_KEY);
    const builtInVersion = String(DEFAULT_SITE_DATA.version || '');

    if (builtInVersion && savedVersion !== builtInVersion) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(VERSION_KEY, builtInVersion);
    }

    const customDefault = localStorage.getItem(PERMANENT_DEFAULT_KEY);
    if (customDefault) {
      return { ...DEFAULT_SITE_DATA, ...JSON.parse(customDefault) };
    }
  } catch (e) {
    console.error("Failed to load permanent defaults:", e);
  }
  return DEFAULT_SITE_DATA;
};

// Helper for UTF-8 Base64 encoding in browser
const utf8ToBase64 = (str: string): string => {
  return btoa(unescape(encodeURIComponent(str)));
};

// Local storage save for fast preview (triggered by individual section Save buttons)
const saveDataLocally = async (nextState: SiteData): Promise<boolean> => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    localStorage.setItem(PERMANENT_DEFAULT_KEY, JSON.stringify(nextState));

    // Vite local dev server middleware backup (if running locally via npm run dev)
    try {
      await fetch("/api/save-site-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextState)
      }).catch(() => {});
    } catch (e) {
      // Ignore on Vercel static hosting
    }
  } catch (e) {
    console.error("Failed to save site data locally:", e);
  }
  return true;
};

// Dedicated GitHub API Commit function (triggered ONLY by "Deploy to Live" button)
const commitToGitHubLive = async (nextState: SiteData): Promise<boolean> => {
  try {
    const ghToken = import.meta.env.VITE_GITHUB_TOKEN;
    const ghOwner = import.meta.env.VITE_GITHUB_OWNER || "bimaljayakumar";
    const ghRepo = import.meta.env.VITE_GITHUB_REPO || "Company-Website";
    const ghBranch = import.meta.env.VITE_GITHUB_BRANCH || "main";

    if (!ghToken) {
      console.warn("VITE_GITHUB_TOKEN not found in environment variables.");
      return false;
    }

    const filePath = "src/data/siteData.json";
    const getUrl = `https://api.github.com/repos/${ghOwner}/${ghRepo}/contents/${filePath}?ref=${ghBranch}`;

    const getRes = await fetch(getUrl, {
      headers: {
        "Authorization": `token ${ghToken}`,
        "Accept": "application/vnd.github.v3+json"
      }
    });

    let sha = "";
    if (getRes.ok) {
      const fileData = await getRes.json();
      sha = fileData.sha || "";
    }

    const jsonContent = JSON.stringify(nextState, null, 2);
    const contentBase64 = utf8ToBase64(jsonContent);

    const putUrl = `https://api.github.com/repos/${ghOwner}/${ghRepo}/contents/${filePath}`;
    const putRes = await fetch(putUrl, {
      method: "PUT",
      headers: {
        "Authorization": `token ${ghToken}`,
        "Content-Type": "application/json",
        "Accept": "application/vnd.github.v3+json"
      },
      body: JSON.stringify({
        message: "chore(admin): deploy siteData.json to live site via Admin Panel",
        content: contentBase64,
        sha: sha || undefined,
        branch: ghBranch
      })
    });

    return putRes.ok;
  } catch (e) {
    console.error("GitHub live deployment failed:", e);
    return false;
  }
};

interface DataContextType {
  data: SiteData;
  updateSection: <K extends keyof SiteData>(section: K, newData: Partial<SiteData[K]>) => Promise<boolean>;
  addArrayItem: <K extends keyof SiteData>(section: K, arrayKey: string, item: any) => Promise<boolean>;
  updateArrayItem: <K extends keyof SiteData>(section: K, arrayKey: string, id: string, updatedItem: any) => Promise<boolean>;
  deleteArrayItem: <K extends keyof SiteData>(section: K, arrayKey: string, id: string) => Promise<boolean>;
  moveArrayItem: <K extends keyof SiteData>(section: K, arrayKey: string, index: number, direction: 'up' | 'down') => Promise<boolean>;
  addMessage: (msg: { name: string; email: string; subject?: string; message: string }) => Promise<boolean>;
  deleteMessage: (id: string) => Promise<boolean>;
  resetToDefaults: () => Promise<boolean>;
  setAsPermanentDefaults: () => Promise<boolean>;
  resetToFactoryDefaults: () => Promise<boolean>;
  hasPermanentDefaults: boolean;
  importDataJSON: (jsonString: string) => Promise<boolean>;
  exportDataJSON: () => string;
  deployToLive: () => Promise<boolean>;
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

  const updateSection = async <K extends keyof SiteData>(section: K, newData: Partial<SiteData[K]>): Promise<boolean> => {
    return new Promise((resolve) => {
      setData((prev) => {
        const existingSection = prev[section];
        const mergedSection =
          typeof existingSection === 'object' && existingSection !== null && typeof newData === 'object' && newData !== null
            ? { ...existingSection, ...newData }
            : (newData as SiteData[K]);

        const nextState: SiteData = {
          ...prev,
          [section]: mergedSection
        };
        saveDataLocally(nextState).then((res) => resolve(res));
        return nextState;
      });
    });
  };

  const addArrayItem = async <K extends keyof SiteData>(section: K, arrayKey: string, item: any): Promise<boolean> => {
    return new Promise((resolve) => {
      setData((prev) => {
        const sectionObj = prev[section] as any;
        const currentArray = Array.isArray(sectionObj[arrayKey]) ? sectionObj[arrayKey] : [];
        const newItem = { id: `item-${Date.now()}`, ...item };
        const nextState: SiteData = {
          ...prev,
          [section]: {
            ...sectionObj,
            [arrayKey]: [...currentArray, newItem]
          }
        };
        saveDataLocally(nextState).then((res) => resolve(res));
        return nextState;
      });
    });
  };

  const updateArrayItem = async <K extends keyof SiteData>(section: K, arrayKey: string, id: string, updatedItem: any): Promise<boolean> => {
    return new Promise((resolve) => {
      setData((prev) => {
        const sectionObj = prev[section] as any;
        const currentArray = Array.isArray(sectionObj[arrayKey]) ? sectionObj[arrayKey] : [];
        const nextState: SiteData = {
          ...prev,
          [section]: {
            ...sectionObj,
            [arrayKey]: currentArray.map((item: any) => (item.id === id ? { ...item, ...updatedItem } : item))
          }
        };
        saveDataLocally(nextState).then((res) => resolve(res));
        return nextState;
      });
    });
  };

  const deleteArrayItem = async <K extends keyof SiteData>(section: K, arrayKey: string, id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setData((prev) => {
        const sectionObj = prev[section] as any;
        const currentArray = Array.isArray(sectionObj[arrayKey]) ? sectionObj[arrayKey] : [];
        const nextState: SiteData = {
          ...prev,
          [section]: {
            ...sectionObj,
            [arrayKey]: currentArray.filter((item: any) => item.id !== id)
          }
        };
        saveDataLocally(nextState).then((res) => resolve(res));
        return nextState;
      });
    });
  };

  const moveArrayItem = async <K extends keyof SiteData>(
    section: K,
    arrayKey: string,
    index: number,
    direction: 'up' | 'down'
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setData((prev) => {
        const sectionObj = prev[section] as any;
        const currentArray = Array.isArray(sectionObj[arrayKey]) ? [...sectionObj[arrayKey]] : [];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= currentArray.length) {
          resolve(false);
          return prev;
        }
        const temp = currentArray[index];
        currentArray[index] = currentArray[targetIndex];
        currentArray[targetIndex] = temp;

        const nextState: SiteData = {
          ...prev,
          [section]: {
            ...sectionObj,
            [arrayKey]: currentArray
          }
        };
        saveDataLocally(nextState).then((res) => resolve(res));
        return nextState;
      });
    });
  };

  const addMessage = async (msg: { name: string; email: string; subject?: string; message: string }): Promise<boolean> => {
    const newMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      name: msg.name,
      email: msg.email,
      subject: msg.subject || "Website Form Inquiry",
      message: msg.message,
      date: new Date().toLocaleString(),
      read: false
    };
    return new Promise((resolve) => {
      setData((prev) => {
        const nextState: SiteData = {
          ...prev,
          messages: [newMsg, ...prev.messages]
        };
        saveDataLocally(nextState).then((res) => resolve(res));
        return nextState;
      });
    });
  };

  const deleteMessage = async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setData((prev) => {
        const nextState: SiteData = {
          ...prev,
          messages: prev.messages.filter((m) => m.id !== id)
        };
        saveDataLocally(nextState).then((res) => resolve(res));
        return nextState;
      });
    });
  };

  const resetToDefaults = async (): Promise<boolean> => {
    const baseline = getBaselineDefaults();
    setData(baseline);
    return await saveDataLocally(baseline);
  };

  const setAsPermanentDefaults = async (): Promise<boolean> => {
    setHasPermanentDefaults(true);
    try {
      localStorage.setItem(PERMANENT_DEFAULT_KEY, JSON.stringify(data));
    } catch (e) {}
    return await saveDataLocally(data);
  };

  const resetToFactoryDefaults = async (): Promise<boolean> => {
    setData(DEFAULT_SITE_DATA);
    localStorage.removeItem(PERMANENT_DEFAULT_KEY);
    localStorage.removeItem(STORAGE_KEY);
    setHasPermanentDefaults(false);
    return await saveDataLocally(DEFAULT_SITE_DATA);
  };

  const importDataJSON = async (jsonString: string): Promise<boolean> => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object') {
        const baseline = getBaselineDefaults();
        const nextState = { ...baseline, ...parsed };
        setData(nextState);
        return await saveDataLocally(nextState);
      }
    } catch (e) {
      console.error("Invalid JSON format", e);
    }
    return false;
  };

  const exportDataJSON = (): string => {
    return JSON.stringify(data, null, 2);
  };

  const deployToLive = async (): Promise<boolean> => {
    const nextVersion = Date.now();
    const updatedState = { ...data, version: nextVersion };
    setData(updatedState);
    try {
      localStorage.setItem(PERMANENT_DEFAULT_KEY, JSON.stringify(updatedState));
      localStorage.setItem(VERSION_KEY, String(nextVersion));
    } catch (e) {}
    await saveDataLocally(updatedState);
    return await commitToGitHubLive(updatedState);
  };

  return (
    <DataContext.Provider
      value={{
        data,
        updateSection,
        addArrayItem,
        updateArrayItem,
        deleteArrayItem,
        moveArrayItem,
        addMessage,
        deleteMessage,
        resetToDefaults,
        setAsPermanentDefaults,
        resetToFactoryDefaults,
        hasPermanentDefaults,
        importDataJSON,
        exportDataJSON,
        deployToLive
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
