import { SiteData } from '../types';
import { PROJECTS, SERVICES, JOURNAL_POSTS, CLIENT_EXPERIENCES, STATISTICS } from '../data';

export const DEFAULT_SITE_DATA: SiteData = {
  logoText: 'SPACEPRO',
  logoSubtext: 'BESPOKE FINISHING',
  logoImage: 'https://cdn.phototourl.com/member/2026-08-26-cc44dfe5-a445-4f55-99fa-01a62d3e3568.png',
  hero: {
    headline: 'Elegance \nThoughtfully Designed',
    subheadline: 'Every detail curated to reflect comfort, beauty, and timeless living. We sculpt bare developer shells into custom luxury masterworks.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=80',
    video: 'https://d34nji4x58k2pp.cloudfront.net/16200747/1783968112067-S8RofJV3pHEjB3QoM0ILsgshaFfqerFV.mp4',
    highlightText: 'Nigeria’s Finest Spatial Finishers'
  },
  projects: PROJECTS,
  services: SERVICES,
  journalPosts: JOURNAL_POSTS,
  clientExperiences: CLIENT_EXPERIENCES,
  statistics: STATISTICS,
  contactInfo: {
    phone: '+234 707 115 5646',
    phoneWhatsApp: '+234 707 115 5646',
    emailConcierge: 'info@spacepro.ng',
    emailProcurement: 'info@spacepro.ng',
    addressLine1: 'PHC | LAGOS | ABUJA | ASABA',
    addressLine2: '',
    mapImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80'
  }
};
