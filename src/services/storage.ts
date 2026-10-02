import { Portfolio, User, ContactMessage, NotificationItem, AnalyticsSummary } from '../types/portfolio';
import { DEMO_PORTFOLIOS, DEMO_USERS, DEFAULT_SECTIONS } from '../data/demoPortfolios';
import { THEME_PRESETS } from '../data/themes';

const STORAGE_KEY_USERS = 'pf_users_v2';
const STORAGE_KEY_PORTFOLIOS = 'pf_portfolios_v2';
const STORAGE_KEY_CURRENT_USER = 'pf_current_user_v2';
const STORAGE_KEY_MESSAGES = 'pf_messages_v2';
const STORAGE_KEY_NOTIFICATIONS = 'pf_notifications_v2';
const STORAGE_KEY_ANALYTICS = 'pf_analytics_v2';

// Initialize default storage
function initializeStorage() {
  if (typeof window === 'undefined') return;

  const existingUsers = localStorage.getItem(STORAGE_KEY_USERS);
  if (!existingUsers) {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(DEMO_USERS));
  } else {
    // Ensure Super Admin user with gmmostafizur331@gmail.com is present & updated
    try {
      const parsed: User[] = JSON.parse(existingUsers);
      const adminIdx = parsed.findIndex(u => u.email === 'gmmostafizur331@gmail.com' || u.username === 'mostafizur');
      if (adminIdx >= 0) {
        parsed[adminIdx].email = 'gmmostafizur331@gmail.com';
        parsed[adminIdx].password = 'Allah2552@';
        parsed[adminIdx].role = 'admin';
        parsed[adminIdx].country = parsed[adminIdx].country || 'Bangladesh';
        parsed[adminIdx].phoneNumber = parsed[adminIdx].phoneNumber || '+880 1712-345678';
        parsed[adminIdx].address = parsed[adminIdx].address || 'Gulshan-2, Dhaka 1212';
        parsed[adminIdx].tagline = parsed[adminIdx].tagline || 'Platform Super Administrator & Lead Architect';
      } else {
        parsed.unshift(DEMO_USERS[0]);
      }
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(parsed));
    } catch {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(DEMO_USERS));
    }
  }

  if (!localStorage.getItem(STORAGE_KEY_PORTFOLIOS)) {
    localStorage.setItem(STORAGE_KEY_PORTFOLIOS, JSON.stringify(DEMO_PORTFOLIOS));
  }

  if (!localStorage.getItem(STORAGE_KEY_CURRENT_USER)) {
    // Default logged in as Mostafizur (Super Admin)
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(DEMO_USERS[0]));
  }

  if (!localStorage.getItem(STORAGE_KEY_MESSAGES)) {
    const initialMessages: ContactMessage[] = [
      {
        id: 'msg-1',
        portfolioUserId: 'user-mostafizur',
        name: 'David Vance',
        email: 'david@venturepartners.com',
        subject: 'Senior Technical Advisory Opportunity',
        message: 'Hi Mostafizur, I was thoroughly impressed by your Nexus Intelligence architecture case study. We are backing an enterprise AI infrastructure seed company and would love to discuss an advisory role with you.',
        receivedAt: new Date(Date.now() - 3600000 * 28).toISOString(),
        isRead: false
      },
      {
        id: 'msg-2',
        portfolioUserId: 'user-mostafizur',
        name: 'Claire Chen',
        email: 'claire.c@scaleai.com',
        subject: 'Consulting on LLM Streaming Microservices',
        message: 'Hello! Are you open for a 3-week sprint audit regarding our distributed token streaming pipeline? We are looking for immediate input.',
        receivedAt: new Date(Date.now() - 3600000 * 72).toISOString(),
        isRead: true
      }
    ];
    localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(initialMessages));
  }

  if (!localStorage.getItem(STORAGE_KEY_NOTIFICATIONS)) {
    const initialNotifications: NotificationItem[] = [
      {
        id: 'notif-1',
        userId: 'user-mostafizur',
        title: 'Portfolio Live',
        message: 'Your portfolio is published and accessible worldwide at /u/mostafizur',
        type: 'celebration',
        read: false,
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        link: '/u/mostafizur'
      },
      {
        id: 'notif-2',
        userId: 'user-mostafizur',
        title: 'New Client Message',
        message: 'David Vance sent an inquiry regarding Senior Technical Advisory Opportunity.',
        type: 'info',
        read: false,
        createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
        link: '/dashboard/contact'
      }
    ];
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(initialNotifications));
  }
}

// Execute init
initializeStorage();

export const StorageService = {
  getUsers(): User[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_USERS);
      return data ? JSON.parse(data) : DEMO_USERS;
    } catch {
      return DEMO_USERS;
    }
  },

  getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    }
  },

  login(emailOrUsername: string, password?: string): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const query = emailOrUsername.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === query || u.username.toLowerCase() === query);

    if (!user) {
      return { success: false, error: 'User not found. Please check your username or register.' };
    }

    // Verify password if user has password set and password was entered
    if (password && user.password && user.password !== password) {
      return { success: false, error: 'Incorrect password. Please verify and try again.' };
    }

    user.lastLogin = new Date().toISOString();
    user.ipAddress = user.ipAddress || '103.230.106.12';

    // Persist updated last login
    const updatedUsers = users.map(u => u.id === user.id ? user : u);
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(updatedUsers));

    this.setCurrentUser(user);
    return { success: true, user };
  },

  register(data: {
    fullName: string;
    email: string;
    username: string;
    profession?: string;
    tagline?: string;
    phoneNumber?: string;
    address?: string;
    country?: string;
    password?: string;
    avatar?: string;
  }): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const cleanUsername = data.username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');

    if (!cleanUsername) {
      return { success: false, error: 'Please provide a valid alphanumeric username.' };
    }

    if (users.some(u => u.username.toLowerCase() === cleanUsername)) {
      return { success: false, error: 'Username is already taken. Please choose another.' };
    }

    if (users.some(u => u.email.toLowerCase() === data.email.trim().toLowerCase())) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email.trim(),
      username: cleanUsername,
      fullName: data.fullName.trim(),
      avatar: data.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${cleanUsername}`,
      plan: 'free',
      role: data.email.trim().toLowerCase() === 'gmmostafizur331@gmail.com' ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      ipAddress: '103.230.106.12',
      isEmailVerified: true,
      profession: data.profession || data.tagline || 'Professional Creator',
      tagline: data.tagline || 'Crafting creative digital solutions',
      phoneNumber: data.phoneNumber || '',
      address: data.address || '',
      country: data.country || 'Bangladesh',
      password: data.password || '',
      bio: `Hello, I'm ${data.fullName}. Welcome to my professional portfolio.`,
      aiGenerationsUsed: 0
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));

    // Create blank initial portfolio with tagline & country
    const initialPortfolio = this.createInitialPortfolio(newUser);
    if (data.tagline) {
      initialPortfolio.profile.title = data.tagline;
    }
    if (data.address || data.country) {
      initialPortfolio.profile.location = [data.address, data.country].filter(Boolean).join(', ');
    }
    if (data.phoneNumber) {
      initialPortfolio.profile.phone = data.phoneNumber;
    }
    this.savePortfolio(newUser.username, initialPortfolio);

    this.setCurrentUser(newUser);
    return { success: true, user: newUser };
  },

  createInitialPortfolio(user: User): Portfolio {
    const portfolios = this.getPortfolios();
    const defaultTheme = THEME_PRESETS[0];

    const initialPortfolio: Portfolio = {
      id: `port-${user.username}`,
      userId: user.id,
      username: user.username,
      status: 'draft',
      updatedAt: new Date().toISOString(),
      profile: {
        fullName: user.fullName,
        title: user.profession,
        avatar: user.avatar,
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
        shortBio: user.bio || `Specializing in ${user.profession} with high-impact outcomes.`,
        longBio: `Welcome to my professional portfolio. I bring strategic clarity, modern methodologies, and dedication to delivering measurable results.`,
        location: 'Remote / Global',
        email: user.email,
        phone: '+1 (555) 012-3456',
        website: `https://portfolioforge.ai/u/${user.username}`,
        availability: 'available',
        statusText: 'Available for New Projects & Opportunities'
      },
      sections: JSON.parse(JSON.stringify(DEFAULT_SECTIONS)),
      skills: [
        { id: 'sk-init-1', name: 'Strategic Execution', category: 'Business', percentage: 90, level: 'Advanced', years: 4, icon: 'target' },
        { id: 'sk-init-2', name: 'Domain Mastery', category: 'Other', percentage: 85, level: 'Advanced', years: 3, icon: 'sparkles' },
        { id: 'sk-init-3', name: 'Client Communication', category: 'Business', percentage: 95, level: 'Expert', years: 5, icon: 'users' }
      ],
      experiences: [
        {
          id: 'exp-init-1',
          company: 'Leading Enterprise or Client Studio',
          position: user.profession,
          employmentType: 'Full-time',
          location: 'Remote',
          startDate: '2023-01',
          endDate: '',
          isCurrent: true,
          description: 'Leading key initiatives, driving client success, and optimizing high-impact projects.',
          achievements: [
            'Delivered critical milestone 2 weeks ahead of schedule.',
            'Improved efficiency across project stakeholders by 30%.'
          ]
        }
      ],
      educations: [
        {
          id: 'edu-init-1',
          institution: 'University / Institute',
          degree: 'Degree of Excellence',
          field: 'Professional Studies',
          startYear: '2016',
          endYear: '2020',
          description: 'Focused on core industry principles, collaborative projects, and advanced practical skills.'
        }
      ],
      projects: [
        {
          id: 'proj-init-1',
          title: 'Flagship Showcase Project',
          description: 'A comprehensive project demonstrating high quality execution, modern principles, and measurable impact.',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
          gallery: [],
          category: 'Key Work',
          date: '2025',
          technologies: ['Strategy', 'Execution', 'Modern Tools'],
          results: ['100% Client Satisfaction', 'Delivered on budget'],
          isFeatured: true
        }
      ],
      services: [
        {
          id: 'srv-init-1',
          name: 'Professional Consulting',
          description: 'Direct engagement to analyze requirements, plan roadmap, and execute high-value deliverables.',
          icon: 'sparkles',
          startingPrice: '$1,500',
          ctaText: 'Get In Touch',
          features: ['Initial discovery session', 'Detailed strategy roadmap', 'Weekly progress reporting']
        }
      ],
      certifications: [],
      achievements: [
        {
          id: 'ach-init-1',
          title: 'Outstanding Delivery Award',
          organization: 'Industry Guild',
          year: '2024',
          description: 'Honored for exceptional quality and client satisfaction.'
        }
      ],
      testimonials: [],
      resume: {
        summary: `Accomplished ${user.profession} dedicated to driving results and creating high-impact solutions.`,
        pdfUrl: '#',
        fileName: `${user.username}_resume.pdf`,
        showPublicDownload: true,
        includeSections: {
          experience: true,
          education: true,
          skills: true,
          certifications: true,
          projects: true
        }
      },
      blogPosts: [],
      socialLinks: [
        { platform: 'linkedin', url: 'https://linkedin.com' },
        { platform: 'github', url: 'https://github.com' },
        { platform: 'twitter', url: 'https://x.com' }
      ],
      themeId: defaultTheme.id,
      themeSettings: { ...defaultTheme },
      seo: {
        title: `${user.fullName} - ${user.profession}`,
        description: `Explore the personal portfolio of ${user.fullName}. Projects, experience, competencies, and contact.`,
        keywords: [user.fullName, user.profession, 'Portfolio', 'Resume'],
        ogImage: user.avatar,
        canonicalUrl: `https://portfolioforge.ai/u/${user.username}`,
        robotsIndex: true,
        author: user.fullName
      },
      domain: {
        domain: '',
        status: 'none',
        dnsRecordA: '76.76.21.21',
        dnsRecordCNAME: 'cname.portfolioforge.ai'
      },
      media: []
    };

    portfolios[user.username] = initialPortfolio;
    localStorage.setItem(STORAGE_KEY_PORTFOLIOS, JSON.stringify(portfolios));
    return initialPortfolio;
  },

  getPortfolios(): Record<string, Portfolio> {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PORTFOLIOS);
      return data ? JSON.parse(data) : DEMO_PORTFOLIOS;
    } catch {
      return DEMO_PORTFOLIOS;
    }
  },

  getPortfolioByUsername(username: string): Portfolio | null {
    const portfolios = this.getPortfolios();
    const clean = username.trim().toLowerCase();
    return portfolios[clean] || null;
  },

  savePortfolio(username: string, portfolio: Portfolio): boolean {
    try {
      const portfolios = this.getPortfolios();
      const clean = username.trim().toLowerCase();
      portfolio.updatedAt = new Date().toISOString();
      portfolios[clean] = portfolio;
      localStorage.setItem(STORAGE_KEY_PORTFOLIOS, JSON.stringify(portfolios));
      return true;
    } catch (err) {
      console.error('Failed to save portfolio:', err);
      return false;
    }
  },

  publishPortfolio(username: string): { success: boolean; url: string } {
    const portfolio = this.getPortfolioByUsername(username);
    if (!portfolio) return { success: false, url: '' };

    portfolio.status = 'published';
    portfolio.publishedAt = new Date().toISOString();
    this.savePortfolio(username, portfolio);

    const currentUser = this.getCurrentUser();
    if (currentUser) {
      this.addNotification(currentUser.id, {
        title: 'Portfolio Published! 🎉',
        message: `Your professional portfolio is now live at /u/${username}`,
        type: 'celebration',
        link: `/u/${username}`
      });
    }

    return { success: true, url: `/u/${username}` };
  },

  unpublishPortfolio(username: string): boolean {
    const portfolio = this.getPortfolioByUsername(username);
    if (!portfolio) return false;

    portfolio.status = 'unpublished';
    this.savePortfolio(username, portfolio);
    return true;
  },

  // Contact Messages
  getContactMessages(username: string): ContactMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_MESSAGES);
      const all: ContactMessage[] = data ? JSON.parse(data) : [];
      const user = this.getUsers().find(u => u.username.toLowerCase() === username.toLowerCase());
      if (!user) return [];
      return all.filter(m => m.portfolioUserId === user.id);
    } catch {
      return [];
    }
  },

  sendContactMessage(username: string, data: { name: string; email: string; subject: string; message: string }): boolean {
    try {
      const user = this.getUsers().find(u => u.username.toLowerCase() === username.toLowerCase());
      if (!user) return false;

      const allMessages: ContactMessage[] = JSON.parse(localStorage.getItem(STORAGE_KEY_MESSAGES) || '[]');
      const newMsg: ContactMessage = {
        id: `msg-${Date.now()}`,
        portfolioUserId: user.id,
        name: data.name,
        email: data.email,
        subject: data.subject || 'Portfolio Inquiry',
        message: data.message,
        receivedAt: new Date().toISOString(),
        isRead: false
      };

      allMessages.unshift(newMsg);
      localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(allMessages));

      // Trigger notification for the portfolio owner
      this.addNotification(user.id, {
        title: `New Inquiry from ${data.name}`,
        message: data.subject ? `Subject: ${data.subject}` : 'You received a new contact message.',
        type: 'info',
        link: '/dashboard/contact'
      });

      return true;
    } catch (err) {
      console.error('Error sending message:', err);
      return false;
    }
  },

  markMessageRead(id: string): void {
    try {
      const allMessages: ContactMessage[] = JSON.parse(localStorage.getItem(STORAGE_KEY_MESSAGES) || '[]');
      const target = allMessages.find(m => m.id === id);
      if (target) {
        target.isRead = true;
        localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(allMessages));
      }
    } catch (err) {
      console.error(err);
    }
  },

  deleteMessage(id: string): void {
    try {
      const allMessages: ContactMessage[] = JSON.parse(localStorage.getItem(STORAGE_KEY_MESSAGES) || '[]');
      const updated = allMessages.filter(m => m.id !== id);
      localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  },

  // Notifications
  getNotifications(userId: string): NotificationItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
      const all: NotificationItem[] = data ? JSON.parse(data) : [];
      return all.filter(n => n.userId === userId);
    } catch {
      return [];
    }
  },

  addNotification(userId: string, item: Omit<NotificationItem, 'id' | 'userId' | 'createdAt' | 'read'>) {
    try {
      const all: NotificationItem[] = JSON.parse(localStorage.getItem(STORAGE_KEY_NOTIFICATIONS) || '[]');
      all.unshift({
        ...item,
        id: `notif-${Date.now()}`,
        userId,
        createdAt: new Date().toISOString(),
        read: false
      });
      localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(all.slice(0, 50)));
    } catch (err) {
      console.error(err);
    }
  },

  markNotificationRead(id: string) {
    try {
      const all: NotificationItem[] = JSON.parse(localStorage.getItem(STORAGE_KEY_NOTIFICATIONS) || '[]');
      const target = all.find(n => n.id === id);
      if (target) {
        target.read = true;
        localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(all));
      }
    } catch (err) {
      console.error(err);
    }
  },

  // Analytics
  recordVisit(username: string, section?: string) {
    try {
      const key = `${STORAGE_KEY_ANALYTICS}_${username.toLowerCase()}`;
      const existing: AnalyticsSummary = JSON.parse(localStorage.getItem(key) || 'null') || {
        totalVisitors: 412,
        pageViews: 1248,
        uniqueVisitors: 367,
        topReferrers: [
          { source: 'LinkedIn', count: 184 },
          { source: 'GitHub', count: 142 },
          { source: 'Google / Direct', count: 96 },
          { source: 'X / Twitter', count: 68 }
        ],
        topDevices: [
          { device: 'Desktop / Laptop', percentage: 68 },
          { device: 'Mobile Phones', percentage: 27 },
          { device: 'Tablets', percentage: 5 }
        ],
        topCountries: [
          { country: 'United States', percentage: 42 },
          { country: 'United Kingdom', percentage: 16 },
          { country: 'Singapore', percentage: 14 },
          { country: 'Germany', percentage: 11 },
          { country: 'Other', percentage: 17 }
        ],
        topSections: [
          { section: 'Projects', views: 890 },
          { section: 'About Me', views: 760 },
          { section: 'Skills', views: 640 },
          { section: 'Experience', views: 510 },
          { section: 'Contact', views: 240 }
        ],
        viewsOverTime: [
          { date: 'Mon', views: 142 },
          { date: 'Tue', views: 189 },
          { date: 'Wed', views: 231 },
          { date: 'Thu', views: 198 },
          { date: 'Fri', views: 245 },
          { date: 'Sat', views: 120 },
          { date: 'Sun', views: 123 }
        ]
      };

      existing.pageViews += 1;
      if (section) {
        const sec = existing.topSections.find(s => s.section.toLowerCase() === section.toLowerCase());
        if (sec) sec.views += 1;
      }

      localStorage.setItem(key, JSON.stringify(existing));
    } catch {
      // ignore
    }
  },

  getAnalytics(username: string): AnalyticsSummary {
    try {
      const key = `${STORAGE_KEY_ANALYTICS}_${username.toLowerCase()}`;
      const data = localStorage.getItem(key);
      if (data) return JSON.parse(data);
    } catch {}

    return {
      totalVisitors: 412,
      pageViews: 1248,
      uniqueVisitors: 367,
      topReferrers: [
        { source: 'LinkedIn', count: 184 },
        { source: 'GitHub', count: 142 },
        { source: 'Google / Direct', count: 96 },
        { source: 'X / Twitter', count: 68 }
      ],
      topDevices: [
        { device: 'Desktop', percentage: 68 },
        { device: 'Mobile', percentage: 27 },
        { device: 'Tablet', percentage: 5 }
      ],
      topCountries: [
        { country: 'United States', percentage: 42 },
        { country: 'United Kingdom', percentage: 16 },
        { country: 'Singapore', percentage: 14 },
        { country: 'Germany', percentage: 11 },
        { country: 'Others', percentage: 17 }
      ],
      topSections: [
        { section: 'Featured Projects', views: 890 },
        { section: 'About & Bio', views: 760 },
        { section: 'Core Skills', views: 640 },
        { section: 'Work Experience', views: 510 },
        { section: 'Contact Inquiries', views: 240 }
      ],
      viewsOverTime: [
        { date: 'Day 1', views: 142 },
        { date: 'Day 2', views: 189 },
        { date: 'Day 3', views: 231 },
        { date: 'Day 4', views: 198 },
        { date: 'Day 5', views: 245 },
        { date: 'Day 6', views: 120 },
        { date: 'Day 7', views: 123 }
      ]
    };
  },

  // Calculate profile completeness percentage
  calculateCompleteness(portfolio: Portfolio): { percentage: number; missing: string[] } {
    let score = 0;
    const missing: string[] = [];

    if (portfolio.profile.fullName && portfolio.profile.title) {
      score += 15;
    } else {
      missing.push('Full name & professional headline');
    }

    if (portfolio.profile.avatar) {
      score += 10;
    } else {
      missing.push('Profile photo');
    }

    if (portfolio.profile.shortBio || portfolio.profile.longBio) {
      score += 15;
    } else {
      missing.push('About / Bio story');
    }

    if (portfolio.skills && portfolio.skills.length >= 3) {
      score += 15;
    } else {
      missing.push('At least 3 core skills');
    }

    if (portfolio.projects && portfolio.projects.length >= 2) {
      score += 20;
    } else {
      missing.push('At least 2 featured projects');
    }

    if (portfolio.experiences && portfolio.experiences.length >= 1) {
      score += 10;
    } else {
      missing.push('Work experience milestone');
    }

    if (portfolio.socialLinks && portfolio.socialLinks.length >= 1) {
      score += 5;
    } else {
      missing.push('Social media links');
    }

    if (portfolio.resume && (portfolio.resume.summary || portfolio.resume.pdfUrl)) {
      score += 5;
    } else {
      missing.push('Resume / CV configuration');
    }

    if (portfolio.seo && portfolio.seo.title && portfolio.seo.description) {
      score += 5;
    } else {
      missing.push('SEO title and meta description');
    }

    return { percentage: Math.min(score, 100), missing };
  }
};
