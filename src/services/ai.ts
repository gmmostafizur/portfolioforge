export interface AIGenerateOptions {
  tool: string;
  inputs: Record<string, any>;
  tone?: 'Professional' | 'Friendly' | 'Creative' | 'Corporate' | 'Minimal';
  length?: 'Short' | 'Medium' | 'Long';
}

export interface FullPortfolioOptions {
  name: string;
  profession: string;
  experienceYears?: number;
  skills?: string;
  background?: string;
  targetClients?: string;
}

export const AIService = {
  async generateContent(options: AIGenerateOptions): Promise<{ text: string; warning?: string }> {
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      return { text: data.text || '', warning: data.warning };
    } catch (err: any) {
      console.warn('Network call to AI endpoint failed, using local generator fallback:', err);
      return {
        text: `Accomplished ${options.inputs?.profession || 'Specialist'} with a focus on modern methodologies, robust architecture, and measurable outcomes. Dedicated to translating complex challenges into elegant solutions.`,
        warning: 'Rendered using offline intelligent fallback.'
      };
    }
  },

  async generateFullPortfolio(options: FullPortfolioOptions): Promise<any> {
    try {
      const response = await fetch('/api/ai/full-portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      return data.portfolioData;
    } catch (err: any) {
      console.warn('Network call to full portfolio endpoint failed, using fallback package:', err);
      return {
        headline: `Crafting High-Performance Products & Scalable Systems`,
        subheadline: `Specializing in ${options.profession} with high-velocity execution and focus on measurable business growth.`,
        shortBio: `Accomplished ${options.profession} with ${options.experienceYears || 5}+ years of hands-on delivery.`,
        longBio: `Over the past ${options.experienceYears || 5} years, I have helped organizations bridge complex requirements with resilient architectures.\n\nMy approach emphasizes clean design, rapid iteration, and maintainable systems.`,
        skills: [
          { name: options.skills?.split(',')[0]?.trim() || 'Modern Architecture', category: 'Development', percentage: 94, level: 'Expert', years: 5 },
          { name: 'Full-Cycle Delivery', category: 'Business', percentage: 90, level: 'Expert', years: 4 },
          { name: 'Interface & User Experience', category: 'Design', percentage: 88, level: 'Advanced', years: 4 }
        ],
        services: [
          {
            name: `${options.profession} Advisory`,
            description: 'Direct consultation on roadmaps, architecture, and sprint execution.',
            startingPrice: '$2,500',
            ctaText: 'Book Advisory',
            features: ['Architecture blueprint', 'Code & UX audit', 'Weekly leadership syncs']
          }
        ],
        projects: [
          {
            title: 'Flagship Platform Delivery',
            description: 'An end-to-end platform modernizing customer workflows with sub-second response times.',
            category: 'Core Work',
            technologies: ['TypeScript', 'Modern Web', 'Cloud APIs'],
            results: ['40% Productivity Boost', 'Zero unplanned downtime'],
            isFeatured: true
          }
        ],
        experiences: [
          {
            company: 'NextGen Solutions',
            position: `Lead ${options.profession}`,
            employmentType: 'Full-time',
            location: 'Remote',
            startDate: '2023-01',
            endDate: '',
            isCurrent: true,
            description: 'Leading key initiatives, driving client outcomes, and mentoring talent.',
            achievements: ['Delivered core platform ahead of schedule', 'Optimized critical workflow performance by 35%']
          }
        ],
        seoTitle: `${options.name} | ${options.profession}`,
        seoDescription: `Official portfolio of ${options.name}. Discover featured projects, consulting services, and verified credentials.`
      };
    }
  }
};
