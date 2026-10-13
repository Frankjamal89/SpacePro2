export type ProjectCategory = 'Residential' | 'Commercial' | 'Renovation' | 'Furnishing';

export interface Project {
  id: string;
  title: string;
  location: string;
  category: ProjectCategory;
  clientName: string;
  year: string;
  description: string;
  mainImage: string;
  beforeImage: string;
  afterImage: string;
  beforeName?: string;
  afterName?: string;
  galleryImages: string[];
  challenges: string;
  solutions: string;
  materials: string[];
  clientQuote: string;
}

export interface BeforeAfterPlaceCard {
  id: string;
  placeName: string;
  location: string;
  category?: string;
  beforeName: string;
  afterName: string;
  beforeImage: string;
  afterImage: string;
  description?: string;
}

export interface Service {
  id: string;
  name: string;
  title: string;
  tagline: string;
  description: string;
  brochureImage: string;
  benefits: string[];
  processSteps: {
    step: string;
    title: string;
    description: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export type JournalCategory = 
  | 'Design Inspiration'
  | 'Luxury Living'
  | 'Interior Trends'
  | 'Architecture'
  | 'Property Enhancement'
  | 'Design Guides';

export interface JournalPost {
  id: string;
  title: string;
  category: JournalCategory;
  date: string;
  author: string;
  readTime: string;
  previewImage: string;
  summary: string;
  paragraphs: string[];
  quote?: string;
}

export interface ClientExperience {
  id: string;
  clientName: string;
  role: string;
  location: string;
  projectTitle: string;
  quote: string;
  transformationSummary: string;
  image: string;
  galleryImages?: string[];
  achievement: string;
}

export interface SiteHero {
  headline: string;
  subheadline: string;
  image: string;
  video?: string;
  highlightText: string;
}

export interface SiteContactInfo {
  phone: string;
  phoneWhatsApp: string;
  emailConcierge: string;
  emailProcurement: string;
  addressLine1: string;
  addressLine2: string;
  mapImage: string;
}

export interface SiteData {
  logoText: string;
  logoSubtext: string;
  logoImage?: string;
  hero: SiteHero;
  projects: Project[];
  services: Service[];
  journalPosts: JournalPost[];
  clientExperiences: ClientExperience[];
  statistics: { value: string; label: string }[];
  contactInfo: SiteContactInfo;
}
