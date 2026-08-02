export const config = {
    developer: {
        name: "DO Company",
        fullName: "DO Company",
        title: "Software & Web Development Company",
        description: "We design and ship websites, web apps, and mobile apps for businesses and startups worldwide."
    },
    social: {
        github: "do-company",
        email: "hello@docompany.dev",
        location: "Worldwide"
    },
    about: {
        title: "About the Company",
        description: "DO Company is a software development studio that builds websites, web applications, and mobile apps for clients across industries. We partner with startups and established businesses to turn ideas into polished, production-ready digital products — fast, reliable, and built to scale."
    },
    experiences: [
        {
            position: "Website Builder Tools",
            company: "DO Company",
            period: "2025 - Present",
            location: "Worldwide",
            description: "Developing no-code and low-code website builder platforms that empower clients to launch and manage their own sites without technical overhead.",
            responsibilities: [
                "Building drag-and-drop website builder interfaces",
                "Creating reusable component libraries for rapid deployment",
                "Integrating CMS and hosting solutions",
                "Providing white-label builder tools for agencies"
            ],
            technologies: ["React", "Next.js", "Node.js", "CMS", "Low-Code", "White-Label"]
        },
        {
            position: "Mobile App Development",
            company: "DO Company",
            period: "2024",
            location: "Worldwide",
            description: "Delivering cross-platform mobile applications for iOS and Android. From MVP to full product, we handle design, development, and deployment.",
            responsibilities: [
                "Building cross-platform apps with React Native",
                "Integrating REST APIs and real-time backends",
                "Handling App Store and Play Store submissions",
                "Providing post-launch maintenance and updates"
            ],
            technologies: ["React Native", "Expo", "Firebase", "TypeScript", "REST APIs", "Push Notifications"]
        },
        {
            position: "Web App Development",
            company: "DO Company",
            period: "2023",
            location: "Worldwide",
            description: "Building full-stack web applications from frontend to backend. Scalable architectures, clean UIs, and robust APIs for SaaS products and client platforms.",
            responsibilities: [
                "Developing full-stack applications with React and Node.js",
                "Designing and building RESTful and GraphQL APIs",
                "Setting up CI/CD pipelines and cloud deployments",
                "Optimizing performance and security"
            ],
            technologies: ["React", "Node.js", "MongoDB", "PostgreSQL", "Docker", "AWS"]
        },
        {
            position: "Web Design & Development",
            company: "DO Company",
            period: "2022",
            location: "Worldwide",
            description: "Crafting high-quality marketing websites and landing pages for businesses. Pixel-perfect design implementation with a focus on performance and conversion.",
            responsibilities: [
                "Building responsive marketing sites and landing pages",
                "Implementing animations and interactive UI elements",
                "Optimizing for SEO and Core Web Vitals",
                "Collaborating with designers on Figma-to-code workflows"
            ],
            technologies: ["HTML", "CSS", "JavaScript", "TypeScript", "Next.js", "Figma"]
        },
        {
            position: "Product Strategy",
            company: "DO Company",
            period: "2021",
            location: "Worldwide",
            description: "Helping clients define their product roadmap, technical architecture, and go-to-market strategy before a single line of code is written.",
            responsibilities: [
                "Conducting discovery workshops with clients",
                "Defining MVP scope and feature prioritization",
                "Creating technical architecture documents",
                "Advising on technology stack selection"
            ],
            technologies: ["Discovery", "Roadmapping", "Architecture", "MVP Planning", "Consulting"]
        }
    ],
    projects: [
        {
            id: 1,
            title: "SaaS Dashboard",
            category: "Web App",
            technologies: "React, Node.js, PostgreSQL, TypeScript, Docker, AWS",
            description: "A full-featured SaaS analytics dashboard with real-time data visualization, role-based access control, and a multi-tenant architecture built for scale."
        },
        {
            id: 2,
            title: "E-Commerce Platform",
            category: "Full Stack",
            technologies: "Next.js, Node.js, MongoDB, Stripe, TailwindCSS",
            description: "A performant e-commerce storefront with product catalog, cart, secure checkout, order management, and an admin dashboard for inventory control."
        },
        {
            id: 3,
            title: "Mobile Banking App",
            category: "Mobile App",
            technologies: "React Native, Expo, Firebase, TypeScript, REST APIs",
            description: "A cross-platform mobile banking application with biometric authentication, real-time transaction tracking, and push notification support for iOS and Android."
        },
        {
            id: 4,
            title: "Website Builder",
            category: "Builder Tool",
            technologies: "React, Next.js, Node.js, MongoDB, TailwindCSS",
            description: "A drag-and-drop website builder platform enabling non-technical users to create, customize, and publish professional websites without writing code."
        },
        {
            id: 5,
            title: "Corporate Marketing Site",
            category: "Web Design",
            technologies: "Next.js, TypeScript, GSAP, TailwindCSS, Vercel",
            description: "A high-performance corporate marketing website with scroll-driven animations, optimized Core Web Vitals, and a headless CMS integration for easy content updates."
        },
        {
            id: 6,
            title: "Project Management Tool",
            category: "Web App",
            technologies: "React, Node.js, Socket.io, PostgreSQL, Docker",
            description: "A real-time project management platform with kanban boards, team collaboration features, file attachments, and live activity feeds powered by WebSockets."
        },
        {
            id: 7,
            title: "Healthcare Portal",
            category: "Full Stack",
            technologies: "Next.js, Node.js, PostgreSQL, TypeScript, AWS",
            description: "A secure patient and provider portal with appointment scheduling, medical record management, and HIPAA-compliant data handling built on AWS infrastructure."
        },
        {
            id: 8,
            title: "Startup Landing Page",
            category: "Web Design",
            technologies: "Next.js, GSAP, TailwindCSS, Figma, Vercel",
            description: "A conversion-focused startup landing page with animated hero sections, feature showcases, pricing tables, and integrated lead capture forms."
        }
    ],
    contact: {
        email: "hello@docompany.dev",
        github: "https://github.com/do-company",
        linkedin: "https://linkedin.com/company/do-company",
        twitter: "https://x.com/docompany",
        facebook: "https://www.facebook.com/docompany",
        instagram: "https://www.instagram.com/docompany"
    },
    skills: {
        develop: {
            title: "WEB & APP DEV",
            description: "Full-stack web and mobile application development",
            details: "We build scalable web applications and cross-platform mobile apps using modern frameworks. From SaaS platforms to consumer apps, we deliver end-to-end solutions with clean architecture and production-grade quality.",
            tools: ["React", "Next.js", "Node.js", "TypeScript", "React Native", "PostgreSQL", "MongoDB", "Docker", "AWS", "REST APIs"]
        },
        design: {
            title: "WEBSITE BUILDER",
            description: "Custom websites & no-code builder tools",
            details: "We design and develop high-performance marketing websites and build white-label website builder platforms. Our sites are optimized for speed, SEO, and conversions — and our builder tools let clients manage their own content without technical help.",
            tools: ["HTML", "CSS", "JavaScript", "Figma", "GSAP", "TailwindCSS", "Next.js", "CMS", "SEO", "Vercel"]
        }
    }
};


