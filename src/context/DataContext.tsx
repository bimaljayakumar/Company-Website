import React, { createContext, useContext, useState, useEffect } from 'react';
import { config } from '../config';

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
  eyebrow?: string;
  title: string;
  subtitle: string;
  email: string;
  phone?: string;
  buttonText: string;
}

export interface FooterNavItem {
  id: string;
  label: string;
  href: string;
}

export interface FooterCapabilityItem {
  id: string;
  label: string;
}

export interface FooterData {
  companyName: string;
  description: string;
  addressLine1: string;
  addressLine2: string;
  email: string;
  phone?: string;
  copyrightText: string;
  github: string;
  linkedin: string;
  twitter: string;
  navLinks?: FooterNavItem[];
  capabilities?: FooterCapabilityItem[];
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
}

const DEFAULT_SITE_DATA: SiteData = {
  hero: {
    eyebrow: "We Build. We Launch. We Educate.",
    headlineWord1: "BUILD",
    headlineWord2: "",
    headlineWord3: "WHAT'S",
    headlineWord4: "NEXT.",
    glowingTarget: "NEXT",
    glowingWords: {
      word1: false,
      word2: false,
      word3: false,
      word4: true,
      build: false,
      whats: false,
      next: true
    },
    videoUrl: "/hero-background.mp4",
    videoOpacity: 20,
    description: "We design, engineer, and deploy high-performance web applications, cross-platform mobile apps, and custom site-builder infrastructure for forward-thinking enterprises.",
    pillars: ["Transparent Pricing", "Agile & Adaptive", "Products That Last"],
    primaryCtaText: "Get Started",
    primaryCtaLink: "#contact",
    secondaryCtaText: "See Our Work",
    secondaryCtaLink: "#work",
    note: "No commitment needed — just a conversation.",
    metrics: [
      { label: "Shipped Products", value: "40+" },
      { label: "Retention Rate", value: "98%" },
      { label: "Avg. Launch", value: "6 Wk" }
    ]
  },
  about: {
    eyebrow: "// CAPABILITIES & EXPERIENCE",
    title: config.about.title,
    description: config.about.description,
    stats: [
      {
        id: "stat-1",
        tag: "// TOTAL DELIVERED",
        value: "40+",
        targetNum: 40,
        suffix: "+",
        description: "High-impact web apps, platforms & site-builder engines shipped worldwide."
      },
      {
        id: "stat-2",
        tag: "// CLIENT SATISFACTION",
        value: "98%",
        targetNum: 98,
        suffix: "%",
        description: "Long-term partners who rely on DO Company for enterprise engineering."
      },
      {
        id: "stat-3",
        tag: "// SPEED TO MARKET",
        value: "6 Wk",
        targetNum: 6,
        suffix: " Wk",
        description: "Average timeframe from specs sign-off to live production deployment."
      }
    ],
    experiences: config.experiences.map((exp, idx) => ({
      id: `exp-${idx + 1}`,
      position: exp.position,
      company: exp.company,
      period: exp.period,
      location: exp.location,
      description: exp.description,
      responsibilities: exp.responsibilities,
      technologies: exp.technologies
    }))
  },
  services: {
    eyebrow: "// SERVICES",
    title: "Engineering services built for speed, scale, and longevity.",
    items: [
      {
        id: "srv-1",
        title: "Website Development",
        description: "Custom websites and web apps",
        details: "High-performance, responsive web applications built with modern frontend & backend frameworks.",
        tools: ["React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS"]
      },
      {
        id: "srv-2",
        title: "Mobile App Development",
        description: "iOS & Android apps with React Native",
        details: "Cross-platform mobile application development for iOS and Android with native performance.",
        tools: ["React Native", "Expo", "iOS", "Android", "Mobile Architecture"]
      },
      {
        id: "srv-3",
        title: "College & Academic Projects",
        description: "Final year projects, documentation, academic software",
        details: "End-to-end academic project engineering, complete code implementations, and project reports.",
        tools: ["Python", "Java", "MERN Stack", "Academic Docs", "SRS & SDD"]
      },
      {
        id: "srv-4",
        title: "Industry-Level Projects",
        description: "Dashboards, portals, SaaS tools for businesses",
        details: "Scalable enterprise dashboards, business automation portals, and full-stack SaaS tools.",
        tools: ["Enterprise SaaS", "Dashboards", "REST APIs", "Cloud & DB", "Security"]
      },
      {
        id: "srv-5",
        title: "UI/UX Design",
        description: "Figma design, wireframing, prototyping",
        details: "Modern UI/UX design systems, interactive prototypes, user flows, and Figma design kits.",
        tools: ["Figma", "Wireframing", "Prototyping", "Design Systems", "User Research"]
      },
      {
        id: "srv-6",
        title: "Documentation & Reports",
        description: "Technical reports, SRS & SDD docs, college submissions",
        details: "Comprehensive technical documentation, architecture blueprints, SRS/SDD reports, and presentation slides.",
        tools: ["SRS & SDD", "Technical Writing", "Architecture Specs", "Project Reports"]
      }
    ]
  },
  projects: {
    eyebrow: "// SELECTED WORK",
    title: "Recent projects we've designed, engineered, and shipped.",
    items: config.projects.map((proj) => ({
      id: `proj-${proj.id}`,
      title: proj.title,
      category: proj.category,
      technologies: proj.technologies,
      image: "",
      description: proj.description,
      link: "#"
    }))
  },
  process: {
    eyebrow: "// PROCESS",
    title: "How we turn ideas into production-ready software.",
    steps: [
      {
        id: "proc-1",
        number: "01",
        title: "Discovery & Architecture",
        description: "We map out scope, technology stack, and high-level system architecture before writing a line of code."
      },
      {
        id: "proc-2",
        number: "02",
        title: "Design & Component Systems",
        description: "Pixel-perfect UI design, accessible component libraries, and rapid interactive prototypes."
      },
      {
        id: "proc-3",
        number: "03",
        title: "Agile Development",
        description: "Sprint-based delivery with weekly demos, test-driven development, and clean TypeScript/React code."
      },
      {
        id: "proc-4",
        number: "04",
        title: "Deployment & Optimization",
        description: "CI/CD setup, performance tuning, Core Web Vitals optimization, and production deployment."
      }
    ]
  },
  founder: {
    eyebrow: "// FOUNDER",
    headline: "Led by someone who still writes code.",
    name: "Jayadev",
    role: "CEO & Lead Architect",
    tagline: "Building Scalable Digital Products",
    quote: "We don't just build software — we build solutions that scale, perform, and last. Every line of code at DO Company is written with purpose and precision.",
    bio: "Jayadev founded DO Company with a clear mission: deliver high-quality, production-ready software to businesses and startups worldwide — fast, reliable, and built to scale.",
    image: "",
    github: "https://github.com/bimaljayakumar",
    linkedin: "https://linkedin.com/in/bimaljayakumar",
    twitter: "https://twitter.com",
    contributionNote: "Active Code Contributions: Daily"
  },
  mentors: {
    eyebrow: "// TEAM",
    title: "The people behind DO Company.",
    items: [
      {
        id: "men-1",
        name: "Bimal Jayakumar",
        role: "Lead Developer @ DO Company",
        specialty: "Full-Stack Web & Mobile Development",
        image: "",
        tag: "Full-Stack Dev"
      }
    ]
  },
  testimonials: {
    eyebrow: "// TESTIMONIALS",
    title: "What founders and technical leaders say.",
    items: [
      {
        id: "test-1",
        quote: "DO Company delivered our SaaS platform ahead of schedule with flawless architecture. Their attention to performance and code quality is unmatched.",
        author: "Sarah Jenkins",
        role: "CTO",
        company: "FlowState Technologies",
        image: ""
      },
      {
        id: "test-2",
        quote: "Working with Marcus and team felt like having a senior engineering lead in-house. They guided our tech stack decisions and launched our MVP seamlessly.",
        author: "Michael Chang",
        role: "Founder",
        company: "Apex Analytics",
        image: ""
      }
    ]
  },
  toolkit: {
    eyebrow: "// OUR TOOLKIT",
    title: "Engineered with modern, battle-tested technologies."
  },
  cta: {
    eyebrow: "// WHAT'S NEXT",
    title: "WHAT'S NEXT?",
    subtitle: "Let's discuss your product roadmap, technical architecture, or build requirements.",
    email: "hello@docompany.dev",
    phone: "+1 (800) 450-BUILD",
    buttonText: "Schedule Consultation"
  },
  footer: {
    companyName: config.developer.name,
    description: "High-performance software engineering agency specializing in custom web applications, cross-platform mobile apps, and enterprise site-builder tools.",
    addressLine1: "548 Market Street, Suite 900",
    addressLine2: "San Francisco, CA 94104",
    email: "build@docompany.dev",
    copyrightText: `© ${new Date().getFullYear()} DO Company Inc. All rights reserved.`,
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    navLinks: [
      { id: "nav-1", label: "Services", href: "#services" },
      { id: "nav-2", label: "Selected Work", href: "#work" },
      { id: "nav-3", label: "Engineering Process", href: "#process" },
      { id: "nav-4", label: "Leadership", href: "#founder" },
      { id: "nav-5", label: "Advisors", href: "#mentors" }
    ],
    capabilities: [
      { id: "cap-1", label: "Full-Stack Web Dev" },
      { id: "cap-2", label: "React Native Apps" },
      { id: "cap-3", label: "No-Code Builder Tools" },
      { id: "cap-4", label: "Microservice Architecture" },
      { id: "cap-5", label: "Performance Auditing" }
    ]
  },
  messages: [
    {
      id: "msg-1",
      name: "Alex Rivera",
      email: "alex@fintechstartup.com",
      subject: "Web App Architecture Inquiry",
      message: "Hi team, we're looking to build a multi-tenant financial dashboard using React and Node.js. Would love to schedule a discovery call.",
      date: "2026-07-28 10:15 AM",
      read: false
    }
  ]
};

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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to persist site data:", e);
    }
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
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      } catch (e) {
        console.error(e);
      }
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
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      } catch (e) {
        console.error(e);
      }
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
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      } catch (e) {
        console.error(e);
      }
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
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      } catch (e) {
        console.error(e);
      }
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
    setData((prev) => ({
      ...prev,
      messages: [newMsg, ...prev.messages]
    }));
  };

  const deleteMessage = (id: string) => {
    setData((prev) => ({
      ...prev,
      messages: prev.messages.filter((m) => m.id !== id)
    }));
  };

  const resetToDefaults = () => {
    const baseline = getBaselineDefaults();
    setData(baseline);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(baseline));
    } catch (e) {
      console.error(e);
    }
  };

  const setAsPermanentDefaults = () => {
    try {
      localStorage.setItem(PERMANENT_DEFAULT_KEY, JSON.stringify(data));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setHasPermanentDefaults(true);
    } catch (e) {
      console.error("Failed to set permanent defaults:", e);
    }
  };

  const resetToFactoryDefaults = () => {
    setData(DEFAULT_SITE_DATA);
    localStorage.removeItem(PERMANENT_DEFAULT_KEY);
    localStorage.removeItem(STORAGE_KEY);
    setHasPermanentDefaults(false);
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object') {
        const baseline = getBaselineDefaults();
        setData({ ...baseline, ...parsed });
        return true;
      }
    } catch (e) {
      console.error("Invalid JSON format", e);
    }
    return false;
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
        importDataJSON
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
