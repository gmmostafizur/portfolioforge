import { Portfolio, PortfolioSectionConfig, User } from '../types/portfolio';
import { THEME_PRESETS } from './themes';

export const DEFAULT_SECTIONS: PortfolioSectionConfig[] = [
  { id: 'sec-hero', sectionId: 'hero', title: 'Introduction', subtitle: 'Crafting intelligent digital products with precision', isEnabled: true, order: 1 },
  { id: 'sec-profile', sectionId: 'profile', title: 'Profile Summary', subtitle: 'About my background & focus', isEnabled: true, order: 2 },
  { id: 'sec-about', sectionId: 'about', title: 'About Me', subtitle: 'Philosophy, story and technical philosophy', isEnabled: true, order: 3 },
  { id: 'sec-skills', sectionId: 'skills', title: 'Core Competencies', subtitle: 'Technologies, tools and methodologies', isEnabled: true, order: 4 },
  { id: 'sec-services', sectionId: 'services', title: 'Services & Offerings', subtitle: 'How I help founders and teams scale', isEnabled: true, order: 5 },
  { id: 'sec-projects', sectionId: 'projects', title: 'Featured Projects', subtitle: 'Production software and digital craft', isEnabled: true, order: 6 },
  { id: 'sec-experience', sectionId: 'experience', title: 'Work Experience', subtitle: 'Career timeline and leadership milestones', isEnabled: true, order: 7 },
  { id: 'sec-education', sectionId: 'education', title: 'Education & Academics', subtitle: 'Degrees and institutional studies', isEnabled: true, order: 8 },
  { id: 'sec-certifications', sectionId: 'certifications', title: 'Certifications', subtitle: 'Verified technical credentials', isEnabled: true, order: 9 },
  { id: 'sec-achievements', sectionId: 'achievements', title: 'Key Achievements & Awards', subtitle: 'Recognitions, hackathons and metrics', isEnabled: true, order: 10 },
  { id: 'sec-testimonials', sectionId: 'testimonials', title: 'Client & Peer Endorsements', subtitle: 'What leaders and collaborators say', isEnabled: true, order: 11 },
  { id: 'sec-resume', sectionId: 'resume', title: 'Curriculum Vitae', subtitle: 'Downloadable PDF and interactive CV', isEnabled: true, order: 12 },
  { id: 'sec-blog', sectionId: 'blog', title: 'Engineering & Design Insights', subtitle: 'Essays on architecture, code and systems', isEnabled: true, order: 13 },
  { id: 'sec-social', sectionId: 'social', title: 'Connect & Follow', subtitle: 'Across social networks & code repositories', isEnabled: true, order: 14 },
  { id: 'sec-contact', sectionId: 'contact', title: 'Get In Touch', subtitle: 'Open for consulting, contracts and advisory roles', isEnabled: true, order: 15 },
  { id: 'sec-newsletter', sectionId: 'newsletter', title: 'Monthly Dispatch', subtitle: 'Curated technical perspectives delivered to your inbox', isEnabled: true, order: 16 },
  { id: 'sec-custom', sectionId: 'custom', title: 'Custom Showcase', subtitle: 'Notable open source and community contributions', isEnabled: false, order: 17, customContent: 'Contributing to open source tools and mentoring developers worldwide.' }
];

export const DEMO_USERS: User[] = [
  {
    id: 'user-mostafizur',
    email: 'gmmostafizur331@gmail.com',
    username: 'mostafizur',
    fullName: 'Mostafizur Rahman (Super Admin)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    plan: 'premium',
    role: 'admin',
    createdAt: '2026-01-15T09:00:00Z',
    isEmailVerified: true,
    profession: 'AI & Full-Stack Solutions Architect',
    tagline: 'Platform Super Administrator & Senior Cloud Systems Architect',
    phoneNumber: '+880 1712-345678',
    address: 'Gulshan-2, Dhaka 1212',
    country: 'Bangladesh',
    password: 'Allah2552@',
    lastLogin: '2026-10-01T08:50:00Z',
    ipAddress: '103.230.106.12',
    bio: 'Designing distributed cloud systems, LLM-powered applications, and reactive web architectures.',
    aiGenerationsUsed: 42
  },
  {
    id: 'user-sarah',
    email: 'sarah.jenkins@example.com',
    username: 'sarah',
    fullName: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    plan: 'pro',
    role: 'user',
    createdAt: '2026-02-10T14:30:00Z',
    isEmailVerified: true,
    profession: 'Principal Product & Interaction Designer',
    tagline: 'Bridging human emotion and interface elegance for global SaaS',
    phoneNumber: '+1 (212) 555-0199',
    address: 'SoHo, Manhattan, New York',
    country: 'United States',
    password: 'Sarah2026@',
    lastLogin: '2026-09-30T17:20:00Z',
    ipAddress: '198.51.100.42',
    bio: 'Bridging human emotion and interface elegance for global high-growth SaaS companies.',
    aiGenerationsUsed: 19
  },
  {
    id: 'user-alex',
    email: 'alex.rivera@example.com',
    username: 'alex',
    fullName: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    plan: 'pro',
    role: 'user',
    createdAt: '2026-03-01T11:20:00Z',
    isEmailVerified: true,
    profession: 'Growth Marketer & Technical Writer',
    tagline: 'Scaling organic search & automated demand engines',
    phoneNumber: '+44 20 7946 0912',
    address: 'Canary Wharf, London',
    country: 'United Kingdom',
    password: 'Alex2026@',
    lastLogin: '2026-09-29T11:15:00Z',
    ipAddress: '82.165.197.1',
    bio: 'Scaling organic search, technical devrel pipelines, and automated demand engines.',
    aiGenerationsUsed: 27
  }
];

export const DEMO_PORTFOLIOS: Record<string, Portfolio> = {
  mostafizur: {
    id: 'port-mostafizur',
    userId: 'user-mostafizur',
    username: 'mostafizur',
    status: 'published',
    publishedAt: '2026-09-20T12:00:00Z',
    updatedAt: '2026-09-30T16:45:00Z',
    profile: {
      fullName: 'Mostafizur Rahman',
      title: 'Senior Full-Stack Architect & AI Systems Specialist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
      shortBio: 'Specializing in enterprise cloud software, high-throughput distributed microservices, and cutting-edge Gemini AI integrations.',
      longBio: 'With over 9 years of engineering excellence, I construct resilient cloud systems that translate complex data into delightful, intuitive user journeys. My background encompasses cloud-native orchestration, micro-frontends, high-performance APIs, and practical LLM workflow automation for tech startups and enterprise platforms.',
      location: 'Singapore / Remote',
      email: 'gmmostafijur001@gmail.com',
      phone: '+1 (555) 389-4912',
      website: 'https://portfolioforge.ai/u/mostafizur',
      availability: 'available',
      statusText: 'Available for Advisory & Architect Consulting'
    },
    sections: [...DEFAULT_SECTIONS],
    skills: [
      { id: 'sk-1', name: 'TypeScript & React', category: 'Development', percentage: 96, level: 'Expert', years: 8, icon: 'code' },
      { id: 'sk-2', name: 'Gemini LLM & Agentic AI', category: 'Development', percentage: 94, level: 'Expert', years: 3, icon: 'sparkles' },
      { id: 'sk-3', name: 'Node.js & Go Microservices', category: 'Development', percentage: 91, level: 'Expert', years: 7, icon: 'server' },
      { id: 'sk-4', name: 'PostgreSQL & Cloud SQL', category: 'Development', percentage: 89, level: 'Advanced', years: 6, icon: 'database' },
      { id: 'sk-5', name: 'Cloud Architecture (GCP / AWS)', category: 'Development', percentage: 92, level: 'Expert', years: 7, icon: 'cloud' },
      { id: 'sk-6', name: 'Design Systems & UI Engineering', category: 'Design', percentage: 88, level: 'Advanced', years: 5, icon: 'palette' },
      { id: 'sk-7', name: 'Technical Product Strategy', category: 'Business', percentage: 86, level: 'Advanced', years: 5, icon: 'target' }
    ],
    experiences: [
      {
        id: 'exp-1',
        company: 'Vanguard Systems Lab',
        position: 'Principal Cloud & AI Architect',
        employmentType: 'Full-time',
        location: 'San Francisco, CA (Hybrid)',
        startDate: '2023-01',
        endDate: '',
        isCurrent: true,
        description: 'Directing the architecture of real-time AI agents and enterprise SaaS backbones serving 450K+ daily active users.',
        achievements: [
          'Spearheaded transition to event-driven streaming architecture, cutting P99 latency by 48%.',
          'Architected autonomous agent pipeline that automated 72% of recurring data parsing tasks.',
          'Mentored 18 senior engineers across 3 global squads in distributed system design.'
        ],
        logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=120&q=80'
      },
      {
        id: 'exp-2',
        company: 'HyperScale Cloud Technologies',
        position: 'Senior Lead Full-Stack Engineer',
        employmentType: 'Full-time',
        location: 'Austin, TX',
        startDate: '2020-04',
        endDate: '2022-12',
        isCurrent: false,
        description: 'Engineered high-concurrency developer tooling platforms and real-time visualization dashboards.',
        achievements: [
          'Delivered zero-downtime database sharding migration across 14 million records.',
          'Rebuilt design system using Tailwind and modern React, accelerating feature velocity by 35%.'
        ]
      }
    ],
    educations: [
      {
        id: 'edu-1',
        institution: 'National University of Engineering',
        degree: 'Bachelor of Science',
        field: 'Computer Science & Software Systems',
        startYear: '2014',
        endYear: '2018',
        grade: 'First Class Honors (3.92 GPA)',
        description: 'Specialized in Distributed Algorithms, Network Protocols, and High-Performance Computing.'
      }
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'Nexus Intelligence: Multi-Agent Cloud Mesh',
        description: 'An autonomous multi-agent task execution platform built with Gemini 3, Node.js, and streaming SSE pipelines.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        fileUrl: '#',
        fileName: 'Nexus_Architecture_Spec_v2.4.pdf',
        emoji: '⚡',
        badgeGif: 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif',
        gallery: [
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
        ],
        category: 'AI & Cloud Infrastructure',
        client: 'Enterprise Innovation Lab',
        date: '2025-2026',
        technologies: ['React 19', 'TypeScript', 'Gemini API', 'PostgreSQL', 'Tailwind CSS'],
        liveUrl: 'https://example.com/nexus',
        githubUrl: 'https://github.com/example/nexus-mesh',
        caseStudy: 'Reduced manual workflow bottlenecks by 80% while preserving audit logs and enterprise data guardrails.',
        results: ['450K+ Monthly Requests', '99.98% Uptime', '3.4x Faster Workflows'],
        isFeatured: true
      },
      {
        id: 'proj-2',
        title: 'Aura Analytics: Real-Time Telemetry Engine',
        description: 'High-throughput stream analytics visualization tool that processes 25K events/sec with sub-second chart rendering.',
        image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80',
        fileUrl: '#',
        fileName: 'Aura_Whitepaper_Benchmark.pdf',
        emoji: '📊',
        gallery: [],
        category: 'Data Engineering',
        client: 'FinTech Global',
        date: '2024',
        technologies: ['Next.js', 'Go', 'WebSockets', 'ClickHouse', 'Tailwind'],
        liveUrl: 'https://example.com/aura',
        githubUrl: 'https://github.com/example/aura-analytics',
        results: ['Sub-50ms Query Times', 'Over $1.2M Saved in Compute'],
        isFeatured: true
      },
      {
        id: 'proj-3',
        title: 'Synthetix Design Core',
        description: 'An open-source, ultra-accessible component library built for developer tooling and dark-mode dashboards.',
        image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
        fileUrl: '#',
        fileName: 'synthetix-core-v1.2.zip',
        emoji: '🎨',
        gallery: [],
        category: 'Open Source',
        date: '2024',
        technologies: ['TypeScript', 'Tailwind CSS', 'Radix UI', 'Storybook'],
        githubUrl: 'https://github.com/example/synthetix-core',
        results: ['2.4K GitHub Stars', '80K Monthly Downloads'],
        isFeatured: false
      }
    ],
    services: [
      {
        id: 'srv-1',
        name: 'AI Agent & LLM Architecture',
        description: 'End-to-end design and deployment of specialized reasoning agents, structured output parsers, and enterprise guardrails.',
        icon: 'sparkles',
        startingPrice: '$4,500',
        ctaText: 'Inquire for Advisory',
        features: ['Model evaluation & prompt engineering', 'Tool & function-calling pipelines', 'Sub-second streaming endpoints', 'Data compliance & privacy review']
      },
      {
        id: 'srv-2',
        name: 'Full-Stack SaaS MVP Engineering',
        description: 'Rapid, production-ready SaaS build from zero to launch in 4-6 weeks with enterprise-grade TypeScript architecture.',
        icon: 'rocket',
        startingPrice: '$7,500',
        ctaText: 'Start a Project',
        features: ['Modern React + Vite / Next.js', 'PostgreSQL / Cloud SQL setup', 'Stripe checkout & user tiering', 'Automated CI/CD & Cloud Run deploy']
      },
      {
        id: 'srv-3',
        name: 'System Audit & Latency Optimization',
        description: 'Deep dive architectural review to eliminate bottlenecks, cut cloud spend, and harden application security.',
        icon: 'gauge',
        startingPrice: '$2,800',
        ctaText: 'Schedule Audit',
        features: ['Database query optimization', 'Cache strategy (Redis/CDN)', 'Bundle size & core web vitals', 'Full architecture blueprint document']
      }
    ],
    certifications: [
      {
        id: 'cert-1',
        title: 'Google Cloud Professional Cloud Architect',
        issuer: 'Google Cloud',
        issueDate: '2024-05',
        expiryDate: '2027-05',
        credentialUrl: 'https://google.com/certification',
        credentialId: 'GCP-PCA-98241',
        description: 'Comprehensive mastery of enterprise scalability, identity management, and cloud security.'
      },
      {
        id: 'cert-2',
        title: 'Certified Kubernetes Administrator (CKA)',
        issuer: 'The Linux Foundation',
        issueDate: '2023-11',
        credentialUrl: 'https://cncf.io',
        credentialId: 'CKA-884210'
      }
    ],
    achievements: [
      {
        id: 'ach-1',
        title: 'Winner - Global Cloud Innovation Hackathon',
        organization: 'TechSummit 2025',
        year: '2025',
        description: 'Built a real-time disaster-relief resource routing agent with geospatial mapping and voice inputs.',
        metric: '1st Place out of 620 Teams'
      },
      {
        id: 'ach-2',
        title: 'Authored Top-Ranked Architecture Series',
        organization: 'Substack & Dev.to',
        year: '2024',
        description: 'Published 12 comprehensive case studies on microservices patterns that garnered over 350,000 views.',
        metric: '350K+ Readers'
      }
    ],
    testimonials: [
      {
        id: 't-1',
        clientName: 'Elena Rostova',
        role: 'Chief Technology Officer',
        company: 'Veloce Dynamics',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        content: 'Mostafizur transformed our prototype into a resilient enterprise platform that effortlessly withstood a 10x traffic spike on launch day. His ability to fuse AI with rock-solid software architecture is world-class.',
        rating: 5,
        projectRef: 'Nexus Intelligence'
      },
      {
        id: 't-2',
        clientName: 'Marcus Chen',
        role: 'Founder & CEO',
        company: 'Synthetix AI',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        content: 'Working with Mostafizur was seamless. He delivers clean, self-documenting code and communicates technical trade-offs with supreme clarity.',
        rating: 5
      }
    ],
    resume: {
      summary: 'Senior Full-Stack Architect with 9+ years building distributed cloud applications and modern LLM systems. Proficient in TypeScript, React, Go, Node.js, and Google Cloud.',
      pdfUrl: '#',
      fileName: 'Mostafizur_Rahman_Architect_CV.pdf',
      showPublicDownload: true,
      includeSections: {
        experience: true,
        education: true,
        skills: true,
        certifications: true,
        projects: true
      }
    },
    blogPosts: [
      {
        id: 'post-1',
        title: 'Architecting Autonomous Agents: Beyond Simple Prompt Chains',
        slug: 'architecting-autonomous-agents',
        summary: 'How to combine structured outputs, state machines, and resilient fallbacks when deploying LLMs in mission-critical applications.',
        content: `When engineers move beyond toy prototypes into enterprise environments, naive prompt-response loops break quickly. Determinism matters. In this essay, we inspect how to frame reasoning agents as bounded state machines with strict schema validation.

### 1. Schema Invariants
Every LLM call destined for downstream consumption must be gated behind structured JSON schemas. Relying on markdown backtick cleanup in client code is a recipe for silent errors.

### 2. Guardrails & Fallbacks
When reasoning steps fail, your agent must degrade gracefully. Having a deterministic heuristic fallback keeps user trust intact while background workers log anomalies for continuous improvement.`,
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        category: 'AI Architecture',
        tags: ['AI', 'System Design', 'TypeScript', 'Gemini'],
        publishedAt: '2026-08-14',
        isPublished: true,
        readMinutes: 6
      },
      {
        id: 'post-2',
        title: 'Building Zero-Lag Real-Time Dashboards with Tailwind and SSE',
        slug: 'zero-lag-realtime-dashboards',
        summary: 'Lessons learned building high-frequency telemetry visualization for financial systems.',
        content: `WebSockets are often the default choice, but Server-Sent Events (SSE) offer remarkable resilience and simplicity when telemetry flows strictly from server to client. Here is our architectural blueprint for keeping UI render cycles under 16ms even under heavy streaming loads.`,
        coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
        category: 'Frontend Engineering',
        tags: ['React', 'Performance', 'Streaming'],
        publishedAt: '2026-07-22',
        isPublished: true,
        readMinutes: 4
      }
    ],
    socialLinks: [
      { platform: 'github', url: 'https://github.com' },
      { platform: 'linkedin', url: 'https://linkedin.com' },
      { platform: 'twitter', url: 'https://x.com' },
      { platform: 'website', url: 'https://portfolioforge.ai' }
    ],
    themeId: 'modern-dark',
    themeSettings: { ...THEME_PRESETS[0] },
    seo: {
      title: 'Mostafizur Rahman - Full-Stack Architect & AI Specialist',
      description: 'Personal portfolio of Mostafizur Rahman. Explore software architecture, AI agent systems, case studies, and engineering essays.',
      keywords: ['Full Stack Architect', 'AI Engineer', 'TypeScript', 'React', 'Gemini API', 'Software Consultant'],
      ogImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
      canonicalUrl: 'https://portfolioforge.ai/u/mostafizur',
      robotsIndex: true,
      author: 'Mostafizur Rahman'
    },
    domain: {
      domain: 'mostafizur.dev',
      status: 'verified',
      configuredAt: '2026-02-01T10:00:00Z',
      dnsRecordA: '76.76.21.21',
      dnsRecordCNAME: 'cname.portfolioforge.ai'
    },
    media: [
      { id: 'm-1', name: 'Profile_Avatar_HQ.jpg', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80', size: '240 KB', category: 'avatar', uploadedAt: '2026-09-01' },
      { id: 'm-2', name: 'Nexus_Architecture_Banner.png', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', size: '1.2 MB', category: 'project', uploadedAt: '2026-09-10' }
    ]
  },
  sarah: {
    id: 'port-sarah',
    userId: 'user-sarah',
    username: 'sarah',
    status: 'published',
    publishedAt: '2026-09-12T10:00:00Z',
    updatedAt: '2026-09-28T14:15:00Z',
    profile: {
      fullName: 'Sarah Jenkins',
      title: 'Staff Product Designer & Design Systems Lead',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=500&q=80',
      coverImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=80',
      shortBio: 'Crafting thoughtful digital interfaces, design tokens, and human-centric experiences for high-velocity software companies.',
      longBio: 'I specialize in helping founders clarify complex problem spaces through tactile interaction design, thoughtful typography, and scalable Figma design systems that engineers love building.',
      location: 'New York, NY',
      email: 'sarah.jenkins@example.com',
      phone: '+1 (212) 555-0199',
      website: 'https://portfolioforge.ai/u/sarah',
      availability: 'open_to_offers',
      statusText: 'Open for Select Advisory & Fractional Design Roles'
    },
    sections: [...DEFAULT_SECTIONS],
    skills: [
      { id: 'sk-s1', name: 'Product Design & UX Strategy', category: 'Design', percentage: 98, level: 'Expert', years: 8, icon: 'figma' },
      { id: 'sk-s2', name: 'Design Systems & Tokens', category: 'Design', percentage: 95, level: 'Expert', years: 6, icon: 'layers' },
      { id: 'sk-s3', name: 'Interaction & Micro-Animations', category: 'Design', percentage: 90, level: 'Advanced', years: 5, icon: 'sparkles' },
      { id: 'sk-s4', name: 'Frontend Prototyping (HTML/Tailwind)', category: 'Development', percentage: 82, level: 'Advanced', years: 4, icon: 'code' },
      { id: 'sk-s5', name: 'User Research & Journey Mapping', category: 'Design', percentage: 92, level: 'Expert', years: 7, icon: 'users' }
    ],
    experiences: [
      {
        id: 'exp-s1',
        company: 'Lumina Design Labs',
        position: 'Staff Product Designer',
        employmentType: 'Full-time',
        location: 'New York, NY',
        startDate: '2022-03',
        endDate: '',
        isCurrent: true,
        description: 'Guiding global product design strategy for next-generation creative tooling software.',
        achievements: [
          'Unified 4 legacy products into one cohesive design system with 140+ accessible tokens.',
          'Increased product trial-to-paid conversion rate by 22% via simplified onboarding.'
        ]
      }
    ],
    educations: [
      {
        id: 'edu-s1',
        institution: 'Rhode Island School of Design',
        degree: 'Bachelor of Fine Arts',
        field: 'Graphic Design & Digital Media',
        startYear: '2013',
        endYear: '2017',
        description: 'Dean’s List, Honors in Typographic Systems.'
      }
    ],
    projects: [
      {
        id: 'proj-s1',
        title: 'Atelier: Creative Workflow Suite',
        description: 'Complete end-to-end design of an AI-powered visual asset manager for creative directors and studios.',
        image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
        gallery: [],
        category: 'Product Design',
        date: '2025',
        technologies: ['Figma', 'Protopie', 'Design Tokens', 'Tailwind'],
        liveUrl: 'https://example.com/atelier',
        results: ['Acquired by CreativeCloud', 'Featured on Awwwards Site of the Day'],
        isFeatured: true
      },
      {
        id: 'proj-s2',
        title: 'Prism Design Tokens Architecture',
        description: 'An open-source token schema bridging Figma variables directly into CSS and iOS/Android tokens.',
        image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
        gallery: [],
        category: 'Design Systems',
        date: '2024',
        technologies: ['Figma Variables', 'Style Dictionary', 'GitHub Actions'],
        githubUrl: 'https://github.com/example/prism-tokens',
        results: ['Adopted by 40+ engineering teams'],
        isFeatured: true
      }
    ],
    services: [
      {
        id: 'srv-s1',
        name: 'Design System Architecture',
        description: 'Complete audit, component architecture, and multi-brand token system in Figma.',
        icon: 'layers',
        startingPrice: '$6,000',
        ctaText: 'Book Design Audit',
        features: ['Component library & auto-layout', 'WCAG AAA contrast audit', 'Developer handoff documentation', 'Figma variables & dark mode']
      }
    ],
    certifications: [],
    achievements: [
      {
        id: 'ach-s1',
        title: 'Design Innovator of the Year',
        organization: 'UX Guild Awards',
        year: '2025',
        description: 'Awarded for pioneering human-centered AI interface standards.'
      }
    ],
    testimonials: [
      {
        id: 't-s1',
        clientName: 'Julian Vance',
        role: 'Founder',
        company: 'Verve Studio',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
        content: 'Sarah has that rare combination of strategic product vision and obsessively refined visual taste. Every pixel she delivers has purpose.',
        rating: 5
      }
    ],
    resume: {
      summary: 'Staff Product Designer with 8 years of experience leading UI/UX and design systems for high-growth tech companies.',
      pdfUrl: '#',
      fileName: 'Sarah_Jenkins_Product_Design.pdf',
      showPublicDownload: true,
      includeSections: {
        experience: true,
        education: true,
        skills: true,
        certifications: false,
        projects: true
      }
    },
    blogPosts: [
      {
        id: 'post-s1',
        title: 'Designing for AI Latency: The Psychology of Waiting',
        slug: 'designing-for-ai-latency',
        summary: 'How perceptual speed, progressive skeletons, and ambient motion make model generation feel instantaneous.',
        content: `When users wait 3 seconds for a generative model to synthesize answers, empty spinners induce anxiety. In this piece, we explore streaming token reveals, cognitive anchoring, and optimistic interface patterns.`,
        coverImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
        category: 'UI/UX Design',
        tags: ['UX', 'Generative AI', 'Micro-interactions'],
        publishedAt: '2026-08-30',
        isPublished: true,
        readMinutes: 5
      }
    ],
    socialLinks: [
      { platform: 'dribbble', url: 'https://dribbble.com' },
      { platform: 'twitter', url: 'https://x.com' },
      { platform: 'linkedin', url: 'https://linkedin.com' }
    ],
    themeId: 'studio-editorial',
    themeSettings: { ...THEME_PRESETS[1] },
    seo: {
      title: 'Sarah Jenkins - Staff Product Designer & UX Strategist',
      description: 'Portfolio of Sarah Jenkins. Product design, design tokens, interaction craft, and design systems.',
      keywords: ['Product Designer', 'Figma', 'Design Systems', 'UX Strategist', 'New York'],
      ogImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=1200&q=80',
      canonicalUrl: 'https://portfolioforge.ai/u/sarah',
      robotsIndex: true,
      author: 'Sarah Jenkins'
    },
    domain: {
      domain: '',
      status: 'none',
      dnsRecordA: '76.76.21.21',
      dnsRecordCNAME: 'cname.portfolioforge.ai'
    },
    media: []
  }
};
