export type UserRole = 'user' | 'admin';
export type SubscriptionPlan = 'free' | 'pro' | 'premium';

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatar: string;
  plan: SubscriptionPlan;
  role: UserRole;
  createdAt: string;
  isEmailVerified: boolean;
  profession: string;
  tagline?: string;
  phoneNumber?: string;
  address?: string;
  country?: string;
  password?: string;
  lastLogin?: string;
  ipAddress?: string;
  bio?: string;
  aiGenerationsUsed: number;
}

export type AvailabilityStatus = 'available' | 'busy' | 'open_to_offers';

export interface Profile {
  fullName: string;
  title: string;
  avatar: string;
  coverImage: string;
  shortBio: string;
  longBio: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  availability: AvailabilityStatus;
  statusText: string;
}

export type SectionType =
  | 'hero'
  | 'profile'
  | 'about'
  | 'skills'
  | 'services'
  | 'experience'
  | 'education'
  | 'projects'
  | 'case_studies'
  | 'certifications'
  | 'achievements'
  | 'awards'
  | 'testimonials'
  | 'resume'
  | 'blog'
  | 'social'
  | 'contact'
  | 'newsletter'
  | 'custom';

export interface PortfolioSectionConfig {
  id: string;
  sectionId: SectionType;
  title: string;
  subtitle?: string;
  isEnabled: boolean;
  order: number;
  customContent?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'Development' | 'Design' | 'Marketing' | 'Business' | 'Writing' | 'Other';
  percentage: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  years: number;
  icon?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  achievements: string[];
  logo?: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  grade?: string;
  description: string;
  logo?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  image: string;
  gallery: string[];
  category: string;
  client?: string;
  date: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  videoUrl?: string;
  fileUrl?: string;
  fileName?: string;
  emoji?: string;
  badgeGif?: string;
  caseStudy?: string;
  results: string[];
  isFeatured: boolean;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  startingPrice: string;
  ctaText: string;
  features: string[];
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
  credentialId?: string;
  badge?: string;
  description?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  organization: string;
  year: string;
  description: string;
  metric?: string;
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  projectRef?: string;
}

export interface ResumeData {
  summary: string;
  pdfUrl?: string;
  fileName?: string;
  showPublicDownload: boolean;
  includeSections: {
    experience: boolean;
    education: boolean;
    skills: boolean;
    certifications: boolean;
    projects: boolean;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  publishedAt: string;
  isPublished: boolean;
  readMinutes: number;
}

export interface ContactMessage {
  id: string;
  portfolioUserId: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  receivedAt: string;
  isRead: boolean;
  isSpam?: boolean;
}

export interface SocialLink {
  platform: 'github' | 'linkedin' | 'twitter' | 'dribbble' | 'behance' | 'youtube' | 'instagram' | 'website' | 'email' | 'telegram' | 'whatsapp' | 'other';
  url: string;
  label?: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: string;
  category: 'avatar' | 'project' | 'certificate' | 'blog' | 'cover' | 'general';
  uploadedAt: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  category: 'Developer' | 'Designer' | 'Marketer' | 'Executive' | 'Creative' | 'Minimal' | 'Modern';
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  cardBackground: string;
  textColor: string;
  mutedTextColor: string;
  fontFamily: 'sans' | 'heading' | 'serif' | 'mono';
  fontSize: 'sm' | 'base' | 'lg';
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  buttonStyle: 'solid' | 'outline' | 'glass' | 'brutalist';
  layout: 'standard' | 'minimal' | 'sidebar' | 'creative';
  isDark: boolean;
  animationStyle?: 'subtle' | 'smooth' | 'playful' | 'none';
  showEmojis?: boolean;
}

export interface SEOSettings {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  canonicalUrl: string;
  robotsIndex: boolean;
  author: string;
}

export interface CustomDomainSettings {
  domain: string;
  status: 'none' | 'pending' | 'verified' | 'failed';
  configuredAt?: string;
  dnsRecordA: string;
  dnsRecordCNAME: string;
}

export interface AnalyticsSummary {
  totalVisitors: number;
  pageViews: number;
  uniqueVisitors: number;
  topReferrers: { source: string; count: number }[];
  topDevices: { device: string; percentage: number }[];
  topCountries: { country: string; percentage: number }[];
  topSections: { section: string; views: number }[];
  viewsOverTime: { date: string; views: number }[];
}

export interface Portfolio {
  id: string;
  userId: string;
  username: string;
  status: 'draft' | 'published' | 'unpublished';
  publishedAt?: string;
  profile: Profile;
  sections: PortfolioSectionConfig[];
  skills: SkillItem[];
  experiences: ExperienceItem[];
  educations: EducationItem[];
  projects: ProjectItem[];
  services: ServiceItem[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  testimonials: TestimonialItem[];
  resume: ResumeData;
  blogPosts: BlogPost[];
  socialLinks: SocialLink[];
  themeId: string;
  themeSettings: ThemeConfig;
  seo: SEOSettings;
  domain: CustomDomainSettings;
  media: MediaItem[];
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'celebration';
  read: boolean;
  createdAt: string;
  link?: string;
}
