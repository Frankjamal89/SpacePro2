import { useState, useEffect, FormEvent, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUpRight, 
  ArrowRight, 
  Sparkles, 
  Compass, 
  Award, 
  PhoneCall, 
  MapPin, 
  Mail, 
  BookOpen, 
  ChevronRight, 
  CheckCircle2, 
  MessageSquare, 
  ShieldCheck, 
  Star,
  Users,
  Eye,
  X,
  ChevronDown,
  Images,
  ChevronLeft
} from 'lucide-react';

import { Project, ProjectCategory, Service, SiteData, ClientExperience } from './types';
import { PROJECTS, SERVICES, CLIENT_EXPERIENCES, STATISTICS } from './data';

import Navigation from './components/Navigation';
import BeforeAfterSlider from './components/BeforeAfterSlider';
import ConsultationForm from './components/ConsultationForm';
import CaseStudyModal from './components/CaseStudyModal';
import ServiceTabs from './components/ServiceTabs';
import JournalSection from './components/JournalSection';
import AdminPortal from './components/AdminPortal';
import CreationCard from './components/CreationCard';
import { DEFAULT_SITE_DATA } from './utils/defaultSiteData';
import { saveLargeAsset, getLargeAsset, removeLargeAsset } from './utils/indexedDB';
import MouseFollower from './components/MouseFollower';

function renderHeadline(text: string) {
  if (!text) return null;
  const parts = text.split(/(Thoughtfully)/gi);
  return (
    <>
      {parts.map((part, index) => {
        if (part.toLowerCase() === 'thoughtfully') {
          return (
            <span key={index} className="font-light italic editorial-statement text-brand-green">
              {part}
            </span>
          );
        }
        return part;
      })}
    </>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<ProjectCategory | 'All'>('All');
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [activeServiceId, setActiveServiceId] = useState<string>('interior-design');
  const [selectedExperienceImage, setSelectedExperienceImage] = useState<ClientExperience | null>(null);
  const [expandedExperienceIds, setExpandedExperienceIds] = useState<Record<string, boolean>>({});

  const toggleExpandExperience = (id: string) => {
    setExpandedExperienceIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const [expSlideIndices, setExpSlideIndices] = useState<Record<string, number>>({});

  const nextExpSlide = (expId: string, len: number, e?: MouseEvent) => {
    if (e) e.stopPropagation();
    setExpSlideIndices(prev => ({
      ...prev,
      [expId]: ((prev[expId] || 0) + 1) % len
    }));
  };

  const prevExpSlide = (expId: string, len: number, e?: MouseEvent) => {
    if (e) e.stopPropagation();
    setExpSlideIndices(prev => ({
      ...prev,
      [expId]: ((prev[expId] || 0) - 1 + len) % len
    }));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedExperienceImage(null);
      }
    };
    if (selectedExperienceImage) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedExperienceImage]);

  // Dynamic Site Customization State
  const [siteData, setSiteData] = useState<SiteData>(() => {
    const saved = localStorage.getItem('spacepro_custom_sitedata');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.contactInfo) {
          if (parsed.contactInfo.phoneWhatsApp !== '+234 707 115 5646') {
            parsed.contactInfo.phoneWhatsApp = '+234 707 115 5646';
          }
          if (parsed.contactInfo.phone !== '+234 707 115 5646') {
            parsed.contactInfo.phone = '+234 707 115 5646';
          }
          if (parsed.contactInfo.emailConcierge === 'concierge@spacepro.luxury' || !parsed.contactInfo.emailConcierge) {
            parsed.contactInfo.emailConcierge = 'info@spacepro.ng';
          }
          if (parsed.contactInfo.emailProcurement === 'procurement@spacepro.luxury' || !parsed.contactInfo.emailProcurement) {
            parsed.contactInfo.emailProcurement = 'info@spacepro.ng';
          }
          if (parsed.contactInfo.addressLine1 === 'Plot 15, Bourdillon Road,') {
            parsed.contactInfo.addressLine1 = 'PHC | LAGOS | ABUJA | ASABA';
            parsed.contactInfo.addressLine2 = '';
          }
          localStorage.setItem('spacepro_custom_sitedata', JSON.stringify(parsed));
        }
        if (parsed && (!parsed.logoImage || parsed.logoImage === 'https://cdn.phototourl.com/free/2026-07-20-de6856d6-9985-427c-beb7-9ff516cfc993.png')) {
          parsed.logoImage = 'https://cdn.phototourl.com/member/2026-08-26-cc44dfe5-a445-4f55-99fa-01a62d3e3568.png';
          localStorage.setItem('spacepro_custom_sitedata', JSON.stringify(parsed));
        }
        // Ensure new hero properties (like default video) are populated if missing in old stored local storage
        if (parsed && parsed.hero) {
          if (parsed.hero.video === undefined) {
            parsed.hero.video = DEFAULT_SITE_DATA.hero.video;
          }
        }
        if (parsed && Array.isArray(parsed.projects)) {
          parsed.projects = parsed.projects.map((p: any) => {
            const defProject = PROJECTS.find(dp => dp.id === p.id);
            const galleryImages = (Array.isArray(p.galleryImages) && p.galleryImages.length >= (defProject?.galleryImages.length || 0))
              ? p.galleryImages
              : (defProject?.galleryImages || p.galleryImages || []);

            if (p.id === 'obsidian-villa') {
              return { 
                ...p, 
                clientName: 'Dr. Kunle A',
                mainImage: 'https://cdn.phototourl.com/member/2026-10-12-660aeb35-c950-44c3-9b0a-d60017dfc312.jpg',
                beforeImage: 'https://cdn.phototourl.com/member/2026-10-12-89eb7df6-58d8-41cd-ba0c-2be4f3d292f3.jpg',
                afterImage: 'https://cdn.phototourl.com/member/2026-10-12-63dd9d02-b986-4cee-b2b9-c5c2e7fed987.jpg',
                beforeName: p.beforeName || 'Original Bare Site Shell',
                afterName: p.afterName || 'Sculpted Obsidian Masterpiece',
                galleryImages: [
                  'https://cdn.phototourl.com/member/2026-10-12-660aeb35-c950-44c3-9b0a-d60017dfc312.jpg',
                  'https://cdn.phototourl.com/member/2026-10-12-6919a1ee-c97d-42fb-bcfd-9054eff6966e.jpg',
                  'https://cdn.phototourl.com/member/2026-10-12-afc2af71-d3c8-4814-b0eb-38480342b98c.jpg',
                  'https://cdn.phototourl.com/member/2026-10-12-fd809a71-25ed-4d9a-81a2-f2dc1ef5ca9e.jpg',
                  'https://cdn.phototourl.com/member/2026-10-12-8d611b18-092b-487e-96a8-dfaeaf16826e.jpg'
                ]
              };
            }
            if (p.id === 'ivory-residence') {
              return { 
                ...p, 
                clientName: 'Chief Sandra A',
                mainImage: 'https://cdn.phototourl.com/member/2026-10-12-dcb7bdeb-a9b4-4216-a8c3-a5ff37b8e0f6.jpg', 
                afterImage: 'https://cdn.phototourl.com/member/2026-10-12-dcb7bdeb-a9b4-4216-a8c3-a5ff37b8e0f6.jpg',
                beforeName: p.beforeName || 'Raw Concrete Framing & Shell',
                afterName: p.afterName || 'Bespoke Ivory Living Sanctuary',
                galleryImages: [
                  'https://cdn.phototourl.com/member/2026-10-12-dcb7bdeb-a9b4-4216-a8c3-a5ff37b8e0f6.jpg',
                  'https://cdn.phototourl.com/member/2026-10-12-eb575210-0f61-4560-a3cf-2d4fc2616019.jpg',
                  'https://cdn.phototourl.com/member/2026-10-12-1880993b-886e-4ecc-a5ed-e9f0816d80b5.jpg',
                  'https://cdn.phototourl.com/member/2026-10-12-d80b3353-3383-451e-ab21-21b1eedde7f5.jpg',
                  'https://cdn.phototourl.com/member/2026-10-12-cb62d73b-ee29-4c34-a53c-bd2b9e11b23a.jpg'
                ]
              };
            }
            if (p.id === 'apex-lounge') {
              return { 
                ...p, 
                title: 'Apex Executive Suite',
                beforeName: p.beforeName || 'Industrial Concrete Commercial Slab',
                afterName: p.afterName || 'Prestige Executive Acoustic Lounge',
                mainImage: 'https://cdn.phototourl.com/member/2026-10-13-c81e2d2e-2cc8-49ad-a7f2-380a3a6571af.jpg', 
                afterImage: 'https://cdn.phototourl.com/member/2026-10-13-c81e2d2e-2cc8-49ad-a7f2-380a3a6571af.jpg',
                galleryImages: [
                  'https://cdn.phototourl.com/member/2026-10-13-c81e2d2e-2cc8-49ad-a7f2-380a3a6571af.jpg',
                  'https://cdn.phototourl.com/member/2026-10-13-b5ebbd2b-d3c3-4da8-a13c-793f0227b45b.jpg',
                  'https://cdn.phototourl.com/member/2026-10-13-398c4268-1cb9-4710-ad06-f3dbdd550ddb.jpg',
                  'https://cdn.phototourl.com/member/2026-10-13-2741cc77-8da4-4c06-826e-e008dbe6cc83.jpg',
                  'https://cdn.phototourl.com/member/2026-10-13-47e29836-c6eb-4669-9b3d-9045085ee800.jpg'
                ]
              };
            }
            if (p.id === 'eko-penthouse') {
              return { 
                ...p, 
                beforeName: p.beforeName || 'Bare High-Rise Glazing & Concrete Deck',
                afterName: p.afterName || 'Oceanfront Travertine Penthouse',
                mainImage: 'https://cdn.phototourl.com/member/2026-08-26-49b38adc-2791-4236-8177-673f823c2e5c.jpg',
                afterImage: 'https://cdn.phototourl.com/member/2026-08-26-49b38adc-2791-4236-8177-673f823c2e5c.jpg',
                galleryImages
              };
            }
            return { ...p, galleryImages };
          });
          localStorage.setItem('spacepro_custom_sitedata', JSON.stringify(parsed));
        }
        if (parsed && Array.isArray(parsed.clientExperiences)) {
          parsed.clientExperiences = parsed.clientExperiences.map((exp: any) => {
            return { ...exp, clientName: '' };
          });
          const hasGrandVista = parsed.clientExperiences.some((exp: any) => exp.id === 'grand-vista-experience');
          if (!hasGrandVista) {
            const grandVistaExp = DEFAULT_SITE_DATA.clientExperiences.find((e: any) => e.id === 'grand-vista-experience');
            if (grandVistaExp) {
              parsed.clientExperiences.push(grandVistaExp);
            }
          }
          const hasAzureHorizon = parsed.clientExperiences.some((exp: any) => exp.id === 'azure-horizon-experience');
          if (!hasAzureHorizon) {
            const azureExp = DEFAULT_SITE_DATA.clientExperiences.find((e: any) => e.id === 'azure-horizon-experience');
            if (azureExp) {
              parsed.clientExperiences.push(azureExp);
            }
          }
          const hasCelestialHeights = parsed.clientExperiences.some((exp: any) => exp.id === 'celestial-heights-experience');
          if (!hasCelestialHeights) {
            const celestialExp = DEFAULT_SITE_DATA.clientExperiences.find((e: any) => e.id === 'celestial-heights-experience');
            if (celestialExp) {
              parsed.clientExperiences.push(celestialExp);
            }
          }
          const hasPortHarcourt = parsed.clientExperiences.some((exp: any) => exp.id === 'port-harcourt-residence');
          if (!hasPortHarcourt) {
            const phExp = DEFAULT_SITE_DATA.clientExperiences.find((e: any) => e.id === 'port-harcourt-residence');
            if (phExp) {
              parsed.clientExperiences.push(phExp);
            }
          }
          localStorage.setItem('spacepro_custom_sitedata', JSON.stringify(parsed));
        }
        if (parsed && Array.isArray(parsed.statistics)) {
          parsed.statistics = parsed.statistics.map((stat: any) => {
            if (stat.label === 'Assets Transformed' || stat.value === '₦4.2B+') {
              return { ...stat, label: 'Assets Transformed', value: '.........' };
            }
            return stat;
          });
          localStorage.setItem('spacepro_custom_sitedata', JSON.stringify(parsed));
        }
        return parsed;
      } catch (e) {
        console.error("Failed to parse custom site data, falling back to defaults.", e);
      }
    }
    return DEFAULT_SITE_DATA;
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Load custom configuration from Server and local IndexedDB fallbacks on mount
  useEffect(() => {
    const loadConfiguration = async () => {
      try {
        // 1. First try to load the permanent site data saved on the server
        const response = await fetch('/api/custom-site-data');
        if (response.ok) {
          const serverData = await response.json();
          if (serverData) {
            setSiteData(serverData);
            return; // Successfully loaded permanent server-side assets!
          }
        }
      } catch (e) {
        console.warn("Failed to fetch custom site data from server, falling back to local storage.", e);
      }

      // 2. Fallback to Local Storage and IndexedDB if the server is offline or empty
      const saved = localStorage.getItem('spacepro_custom_sitedata');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          let updatedVideo = null;
          let updatedLogo = null;

          if (parsed && parsed.hero && parsed.hero.video === 'indexeddb:custom_hero_video') {
            updatedVideo = await getLargeAsset('custom_hero_video');
          }
          if (parsed && parsed.logoImage === 'indexeddb:custom_logo_image') {
            updatedLogo = await getLargeAsset('custom_logo_image');
          }

          setSiteData(prev => {
            const nextState = { ...prev, ...parsed };
            if (updatedVideo) {
              nextState.hero = { ...nextState.hero, video: updatedVideo };
            }
            if (updatedLogo) {
              nextState.logoImage = updatedLogo;
            }
            return nextState;
          });
        } catch (e) {
          console.error("Failed to load IndexedDB fallback assets", e);
        }
      }
    };
    loadConfiguration();
  }, []);

  const handleUpdateSiteData = async (newData: SiteData) => {
    let dataToSave = { ...newData };
    
    // Process Local Browser Video Asset
    if (newData.hero.video && newData.hero.video.startsWith('data:')) {
      await saveLargeAsset('custom_hero_video', newData.hero.video);
      dataToSave.hero = { ...newData.hero, video: 'indexeddb:custom_hero_video' };
    } else if (newData.hero.video === '') {
      await removeLargeAsset('custom_hero_video');
    }

    // Process Local Browser Logo Image Asset
    if (newData.logoImage && newData.logoImage.startsWith('data:')) {
      await saveLargeAsset('custom_logo_image', newData.logoImage);
      dataToSave.logoImage = 'indexeddb:custom_logo_image';
    } else if (newData.logoImage === '') {
      await removeLargeAsset('custom_logo_image');
    }

    // Persist local state & localStorage fallback
    setSiteData(newData);
    try {
      localStorage.setItem('spacepro_custom_sitedata', JSON.stringify(dataToSave));
    } catch (e) {
      console.warn("localStorage quota exceeded, but large assets have been securely saved to IndexedDB.", e);
    }

    // 3. Persist permanently to the server workspace/code folder
    try {
      const response = await fetch('/api/save-site-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ siteData: newData }),
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.siteData) {
          // Update the local state to point to the saved static server URLs
          setSiteData(result.siteData);
          localStorage.setItem('spacepro_custom_sitedata', JSON.stringify(result.siteData));
        }
      }
    } catch (e) {
      console.error("Failed to save site data permanently to server:", e);
    }
  };

  const handleResetSiteData = async () => {
    // 1. Clear local browser assets
    await removeLargeAsset('custom_hero_video');
    await removeLargeAsset('custom_logo_image');
    setSiteData(DEFAULT_SITE_DATA);
    localStorage.removeItem('spacepro_custom_sitedata');

    // 2. Reset on the server
    try {
      await fetch('/api/reset-site-data', { method: 'POST' });
    } catch (e) {
      console.error("Failed to reset site data on server:", e);
    }
  };

  // Contact Form States
  const [contactFormSubmitted, setContactFormSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    setContactFormSubmitted(true);
    setTimeout(() => {
      setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 500);
  };

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  // Filter projects for portfolio page
  const filteredProjects = activeCategoryFilter === 'All' 
    ? siteData.projects 
    : siteData.projects.filter(p => p.category === activeCategoryFilter);

  return (
    <div className="min-h-screen bg-white text-brand-charcoal selection:bg-brand-green selection:text-white flex flex-col justify-between">
      
      {/* 1. STICKY LUXURY NAVIGATION */}
      <Navigation 
        currentView={currentView}
        onNavigate={(viewId) => {
          setCurrentView(viewId);
          // If navigating to services page, default back to interior design tab
          if (viewId === 'services') {
            setActiveServiceId('interior-design');
          }
        }}
        onOpenConsultation={() => setIsConsultationModalOpen(true)}
        siteData={siteData}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 2. DYNAMIC CONTENT CONTAINER (With Page Fade-ins) */}
      <main className="flex-grow pt-[84px]">
        <AnimatePresence mode="wait">
          
          {/* =========================================================================
              VIEW: HOMEPAGE
              ========================================================================= */}
          {currentView === 'home' && (
            <motion.div
              key="home-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-0"
            >
              {/* SECTION 1: FULLSCREEN HERO */}
              <section id="hero-section" className="relative h-[90vh] md:h-[95vh] bg-brand-charcoal overflow-hidden flex items-center border-b border-brand-border/60">
                {/* Background Video with Cinematic Ambient Presentation */}
                <div className="absolute inset-0">
                  <video 
                    key={siteData.hero.video}
                    src={siteData.hero.video || 'https://d34nji4x58k2pp.cloudfront.net/16200747/1783968112067-S8RofJV3pHEjB3QoM0ILsgshaFfqerFV.mp4'} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    preload="auto"
                    className="w-full h-full object-cover scale-105"
                  />
                  {/* Subtle dark overlay (40% opacity) for high visual contrast */}
                  <div className="absolute inset-0 bg-black/40 z-[1]"></div>
                </div>

                {/* Hero Text Card - Pure Sophistication */}
                <div className="relative max-w-7xl mx-auto px-6 sm:px-12 md:px-24 w-full text-left space-y-6 md:space-y-8 z-10">
                  <div className="inline-flex items-center gap-2 bg-brand-green/20 border border-brand-green/30 px-3.5 py-1.5 rounded-full animate-fade-in">
                    <Sparkles className="w-3.5 h-3.5 text-brand-green animate-pulse" />
                    <span className="text-[10px] uppercase tracking-[0.25em] text-brand-green font-semibold font-sans">
                      {siteData.hero.highlightText}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-medium text-white leading-tight tracking-tight max-w-3xl whitespace-pre-line">
                      {renderHeadline(siteData.hero.headline)}
                    </h1>
                    <p className="text-sm md:text-base font-sans font-light text-gray-300 max-w-lg leading-relaxed">
                      {siteData.hero.subheadline}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <button
                      onClick={() => setCurrentView('contact')}
                      className="px-8 py-4 bg-brand-green hover:bg-white hover:text-brand-charcoal text-white text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-sm flex items-center gap-2 cursor-pointer font-sans"
                    >
                      <span>Inquire Today</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentView('portfolio')}
                      className="px-8 py-4 border border-white text-white hover:border-brand-green hover:text-brand-green text-xs uppercase tracking-widest font-medium transition-colors font-sans cursor-pointer"
                    >
                      Explore Projects
                    </button>
                  </div>
                </div>

                {/* Absolute Floating Spec Plaque (Translucent Cinematic Glass) */}
                <div className="absolute bottom-8 right-8 hidden xl:block bg-brand-charcoal/80 backdrop-blur-md p-4 border border-white/10 rounded-xs max-w-xs text-left z-10 text-white">
                  <div className="text-[8.5px] uppercase tracking-widest text-brand-green font-semibold">Featured Masterwork</div>
                  <div className="text-xs font-semibold text-white mt-1">
                    {siteData.projects[0]?.title || 'The Obsidian Villa'}
                  </div>
                  <div className="text-[9.5px] text-gray-400 font-light font-sans mt-0.5">
                    {siteData.projects[0]?.location || 'Ikoyi, Lagos'} • {siteData.projects[0]?.category || 'Interior Design'}
                  </div>
                </div>
              </section>

              {/* SECTION 2: THE SPACEPRO PHILOSOPHY */}
              <section id="philosophy-section" className="py-24 px-6 sm:px-12 md:px-24 max-w-7xl mx-auto border-b border-brand-border/40">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                  
                  {/* Left Editorial Layout */}
                  <div className="lg:col-span-7 space-y-8 text-left">
                    <span className="text-xs uppercase tracking-[0.3em] text-brand-green font-semibold block">The Philosophy</span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-editorial font-light text-brand-charcoal leading-relaxed italic">
                      "A beautifully designed space is more than a place. It is <span className="text-brand-green font-normal">an experience</span>. It reflects your identity, enhances your lifestyle, and elevates every moment."
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 font-sans">
                      <div className="space-y-2">
                        <h4 className="text-xs uppercase tracking-wider font-semibold text-brand-charcoal flex items-center gap-1.5">
                          <Compass className="w-4 h-4 text-brand-green" /> Craftsmanship First
                        </h4>
                        <p className="text-xs font-light text-gray-500 leading-relaxed">
                          We eschew rapid building trends. We analyze light incidence, acoustic feedback, and human movement parameters prior to material fittings.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xs uppercase tracking-wider font-semibold text-brand-charcoal flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-brand-green" /> Elite Materials Custody
                        </h4>
                        <p className="text-xs font-light text-gray-500 leading-relaxed">
                          From Carrara stone blocks to Belgian wool threads, we purchase direct from origin mills to secure certified luxury results.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Immersive Portrait Visual */}
                  <div className="lg:col-span-5 relative">
                    <div className="relative h-[480px] w-full overflow-hidden bg-brand-gray border border-brand-border rounded-xs group shadow-lg">
                      <img 
                        src="https://cdn.phototourl.com/member/2026-10-12-91db4397-2cc7-4f6c-91b2-a1eacc2e64f9.jpg" 
                        alt="SpacePro bespoke finishing philosophy" 
                        className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-brand-charcoal/5"></div>
                    </div>
                    {/* Tiny Floating Counter */}
                    <div className="absolute -bottom-6 -left-6 bg-brand-charcoal text-white px-6 py-4 rounded-sm border border-brand-border/10 hidden sm:block text-left">
                      <div className="text-2xl font-mono text-brand-green font-bold">100%</div>
                      <div className="text-[9px] uppercase tracking-widest text-gray-400 font-light mt-0.5">Custom Tailored Work</div>
                    </div>
                  </div>

                </div>
              </section>

              {/* SECTION 3: FEATURED PROJECTS */}
              <section id="featured-projects" className="py-24 bg-white border-b border-brand-border/40">
                <div className="max-w-7xl mx-auto px-6 sm:px-12">
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
                    <div className="text-left">
                      <span className="text-xs uppercase tracking-[0.3em] text-brand-green font-semibold block mb-3">Architectural Legacy</span>
                      <h2 className="text-4xl md:text-5xl font-display text-brand-charcoal tracking-tight font-medium">
                        Featured Creations
                      </h2>
                    </div>
                    <button 
                      onClick={() => setCurrentView('portfolio')}
                      className="text-xs uppercase tracking-widest text-brand-charcoal hover:text-brand-green flex items-center gap-2 mt-4 md:mt-0 transition-colors focus:outline-none font-semibold font-sans"
                    >
                      <span>View All Works</span>
                      <ArrowRight className="w-4 h-4 text-brand-green" />
                    </button>
                  </div>

                  {/* Dynamic Custom Cards Grid with Multi-Image Moving Slider */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {siteData.projects.slice(0, 3).map((project, idx) => (
                      <CreationCard
                        key={project.id}
                        project={project}
                        cardIndex={idx}
                        onSelect={(proj) => setSelectedProject(proj)}
                      />
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION 4: SIGNATURE SERVICES */}
              <section id="services-section" className="py-24 bg-brand-gray border-y border-brand-border/60">
                <div className="max-w-7xl mx-auto px-6 sm:px-12">
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
                    <div className="text-left">
                      <span className="text-xs uppercase tracking-[0.3em] text-brand-green font-semibold block mb-3">Premium Offerings</span>
                      <h2 className="text-4xl md:text-5xl font-display text-brand-charcoal tracking-tight font-medium">
                        Signature Services
                      </h2>
                    </div>
                    <button 
                      onClick={() => setCurrentView('services')}
                      className="text-xs uppercase tracking-widest text-brand-charcoal hover:text-brand-green flex items-center gap-2 mt-4 md:mt-0 transition-colors focus:outline-none font-semibold font-sans"
                    >
                      <span>Deep Service Guide</span>
                      <ArrowRight className="w-4 h-4 text-brand-green" />
                    </button>
                  </div>

                  {/* Brochure Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {siteData.services.map((service) => (
                      <div 
                        key={service.id}
                        onClick={() => {
                          setActiveServiceId(service.id);
                          setCurrentView('services');
                        }}
                        className="bg-white border border-brand-border/60 p-8 rounded-sm text-left hover:border-brand-green/80 transition-all duration-300 cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between h-[360px] group"
                      >
                        <div className="space-y-4">
                          {/* Slim Branding Accent Line */}
                          <div className="w-10 h-[1.5px] bg-brand-green"></div>
                          <h3 className="text-lg font-display text-brand-charcoal font-medium group-hover:text-brand-green transition-colors leading-snug">
                            {service.name}
                          </h3>
                          <p className="text-xs font-light text-gray-400 font-sans leading-relaxed line-clamp-4">
                            {service.tagline}
                          </p>
                        </div>

                        <div className="font-sans pt-4">
                          <div className="text-[10px] uppercase tracking-widest text-brand-charcoal font-semibold flex items-center gap-1 group-hover:text-brand-green transition-colors">
                            <span>Explore Service</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION 5: BEFORE & AFTER COMPARATIVE SLIDER */}
              <BeforeAfterSlider 
                projects={siteData.projects}
                title="The Magic of Refinement"
                subtitle="We take bare, raw structural concrete layouts and construct pristine architectural sanctuaries. Select each place card below to experience its radical transformation."
              />

              {/* SECTION 6: DESIGN JOURNEY (TIMELINE) */}
              <section id="journey-timeline" className="py-24 bg-white border-b border-brand-border/40">
                <div className="max-w-7xl mx-auto px-6 sm:px-12">
                  <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
                    <span className="text-xs uppercase tracking-[0.3em] text-brand-green font-semibold">The Method</span>
                    <h2 className="text-4xl font-display font-medium text-brand-charcoal">The Finishing Journey</h2>
                    <p className="text-xs font-light text-gray-400 font-sans leading-relaxed">
                      Luxury is an orchestration. We map out physical tasks with strict dry times and millimeter tolerances to secure long-term architectural stability.
                    </p>
                  </div>

                  {/* Horizontal Timeline Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative font-sans">
                    
                    {[
                      { num: '01', title: 'Discover', desc: 'Space forensics, lighting alignment indexes, and programmatic client brief analysis.' },
                      { num: '02', title: 'Design', desc: 'Millimeter spatial models, 3D high-fidelity visualization, and material sourcing.' },
                      { num: '03', title: 'Build', desc: 'Technical plumbing, advanced layout updates, and precision core masonry.' },
                      { num: '04', title: 'Furnish', desc: 'Bespoke joinery Fitting, textured plaster, and premium luxury textiles.' },
                      { num: '05', title: 'Deliver', desc: 'Sartorial Final staging, white-glove clean, and bespoke masterpiece reveal.' }
                    ].map((step, idx) => (
                      <div key={idx} className="relative space-y-4 text-left group">
                        {/* Connecting Line for desktop */}
                        {idx < 4 && (
                          <div className="hidden md:block absolute top-7 left-1/2 right-0 h-[1.5px] bg-brand-border group-hover:bg-brand-green/30 transition-colors z-0"></div>
                        )}
                        
                        <div className="relative z-10 w-14 h-14 bg-brand-gray border border-brand-border rounded-full flex items-center justify-center font-display font-bold text-brand-charcoal text-sm group-hover:bg-brand-green group-hover:text-white group-hover:border-brand-green transition-all duration-300">
                          {step.num}
                        </div>

                        <div className="space-y-1">
                          <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-charcoal">
                            {step.title}
                          </h3>
                          <p className="text-xs font-normal text-gray-600 leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    ))}

                  </div>
                </div>
              </section>

              {/* SECTION 7: DESIGN / PROJECT EXPERIENCES */}
              <section id="client-stories" className="py-24 bg-brand-gray/30 border-b border-brand-border/40 text-left">
                <div className="max-w-7xl mx-auto px-6 sm:px-12">
                  <div className="text-left mb-16">
                    <span className="text-xs uppercase tracking-[0.3em] text-brand-green font-semibold block mb-3">Spatial Portfolios</span>
                    <h2 className="text-4xl md:text-5xl font-display text-brand-charcoal tracking-tight font-medium">
                      Design / Project Experiences
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                    {siteData.clientExperiences.map((exp) => {
                      const isLongQuote = exp.quote.length > 210 || exp.quote.includes('\n');
                      const isExpanded = !!expandedExperienceIds[exp.id];
                      const firstParagraph = exp.quote.split('\n\n')[0].split('\n')[0];
                      const displayQuote = isLongQuote && !isExpanded 
                        ? (firstParagraph.length > 200 ? firstParagraph.slice(0, 190).trim() + '...' : firstParagraph + '...')
                        : exp.quote;

                      const expImages = [exp.image, ...(exp.galleryImages || [])].filter(Boolean);
                      const currentExpIdx = expSlideIndices[exp.id] || 0;

                      return (
                        <div 
                          key={exp.id}
                          className="bg-white border border-brand-border/60 p-7 sm:p-8 rounded-sm flex flex-col justify-between shadow-xs hover:border-brand-green transition-all duration-300 font-sans group relative"
                        >
                          <div className="space-y-6">
                            {/* Project Image Carousel */}
                            <div className="h-56 w-full overflow-hidden rounded-xs bg-brand-gray relative border border-brand-border shrink-0 group/img select-none">
                              <div
                                className="flex w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                                style={{ transform: `translateX(-${currentExpIdx * 100}%)` }}
                              >
                                {expImages.map((imgUrl, imgIdx) => (
                                  <div key={imgIdx} className="w-full h-full shrink-0 relative">
                                    <img 
                                      src={imgUrl} 
                                      alt={`${exp.projectTitle} - View ${imgIdx + 1}`}
                                      className="w-full h-full object-cover cursor-pointer"
                                      referrerPolicy="no-referrer"
                                      onClick={() => setSelectedExperienceImage(exp)}
                                    />
                                  </div>
                                ))}
                              </div>

                              {/* Multi-Image Counter Pill */}
                              {expImages.length > 1 && (
                                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/65 backdrop-blur-md text-white text-[10px] tracking-widest px-2.5 py-1 rounded-full border border-white/15 shadow-sm z-10 pointer-events-none">
                                  <Images className="w-3 h-3 text-brand-green" />
                                  <span className="font-mono font-medium">{currentExpIdx + 1}/{expImages.length}</span>
                                </div>
                              )}

                              {/* Interactive Prev & Next Arrows */}
                              {expImages.length > 1 && (
                                <>
                                  <button
                                    type="button"
                                    onClick={(e) => prevExpSlide(exp.id, expImages.length, e)}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-brand-green text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all duration-300 backdrop-blur-sm z-10 cursor-pointer shadow-md"
                                    aria-label="Previous image"
                                  >
                                    <ChevronLeft className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => nextExpSlide(exp.id, expImages.length, e)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-brand-green text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all duration-300 backdrop-blur-sm z-10 cursor-pointer shadow-md"
                                    aria-label="Next image"
                                  >
                                    <ChevronRight className="w-4 h-4" />
                                  </button>
                                </>
                              )}

                              {/* View Image Action Button */}
                              <button
                                type="button"
                                onClick={() => setSelectedExperienceImage(exp)}
                                className="absolute bottom-3 right-3 bg-brand-charcoal/85 hover:bg-brand-green text-white text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-xs backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer shadow-md border border-white/10 z-10"
                                title="View Full Resolution Image"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View Image</span>
                              </button>

                              {exp.projectTitle && (
                                <div className="absolute bottom-3 left-3 bg-brand-charcoal/85 backdrop-blur-md px-3 py-1 text-[9px] uppercase tracking-widest text-white rounded-xs font-mono border border-white/10">
                                  {exp.projectTitle}
                                </div>
                              )}
                            </div>

                            <div className="space-y-3">
                              <p className="text-xs italic font-light text-gray-600 leading-relaxed whitespace-pre-line transition-all duration-300">
                                "{displayQuote}"
                              </p>

                              {isLongQuote && (
                                <button
                                  type="button"
                                  onClick={() => toggleExpandExperience(exp.id)}
                                  className="text-[11px] uppercase tracking-widest text-brand-green hover:text-brand-charcoal font-semibold flex items-center gap-1.5 pt-1 transition-colors cursor-pointer"
                                >
                                  <span>{isExpanded ? 'View Less' : 'View More Experience'}</span>
                                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="space-y-3 pt-6 mt-6 border-t border-brand-border/60">
                            <div className="space-y-0.5">
                              <h4 className="text-sm font-semibold text-brand-charcoal uppercase tracking-wider">
                                {exp.projectTitle}
                              </h4>
                              <div className="text-[10px] text-gray-500">
                                {exp.role} • <span className="font-medium text-brand-green">{exp.location}</span>
                              </div>
                            </div>

                            <div className="pt-2 text-[10px] font-mono text-gray-400 border-t border-brand-border/30">
                              <span className="font-semibold text-brand-charcoal">Achievement:</span> {exp.achievement}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* SECTION 8: PROJECT STATISTICS */}
              <section id="statistics-section" className="py-20 bg-brand-charcoal text-white text-center">
                <div className="max-w-7xl mx-auto px-6 sm:px-12">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
                    {siteData.statistics.map((stat, idx) => (
                      <div key={idx} className="space-y-2 pt-6 lg:pt-0">
                        <span className="text-4xl md:text-5xl font-mono text-brand-green font-semibold tracking-tight block">
                          {stat.value}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.25em] text-white/60 font-light block">
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

            </motion.div>
          )}

          {/* =========================================================================
              VIEW: PORTFOLIO / GALLERY
              ========================================================================= */}
          {currentView === 'portfolio' && (
            <motion.div
              key="portfolio-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-6 sm:px-12 py-16 space-y-12"
            >
              <div className="text-left space-y-3">
                <span className="text-xs uppercase tracking-[0.3em] text-brand-green font-semibold block">Curated Compendium</span>
                <h1 className="text-4xl md:text-5xl font-display font-medium text-brand-charcoal tracking-tight">
                  Portfolio of Masterworks
                </h1>
                <p className="text-sm font-sans font-light text-gray-400 max-w-xl leading-relaxed">
                  Every project is a story of meticulous volume planning and exquisite materials finishing, delivered to elite specifications in Nigeria.
                </p>
              </div>

              {/* Portfolio Filter Bar */}
              <div className="flex flex-wrap gap-2 justify-start border-b border-brand-border pb-6 font-sans">
                {['All', 'Residential', 'Commercial', 'Renovation', 'Furnishing'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategoryFilter(cat as any)}
                    className={`px-5 py-2.5 text-[10px] uppercase tracking-widest transition-all focus:outline-none rounded-full ${
                      activeCategoryFilter === cat 
                        ? 'bg-brand-green text-white font-semibold' 
                        : 'bg-brand-gray text-gray-400 hover:text-brand-charcoal hover:bg-brand-border/40'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Masonry-Style Portfolio Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 text-left font-sans">
                {filteredProjects.map((project) => (
                  <div 
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="group cursor-pointer space-y-6 bg-white border border-brand-border p-6 rounded-sm hover:border-brand-green transition-colors duration-300 shadow-xs"
                  >
                    <div className="relative h-[340px] md:h-[420px] w-full overflow-hidden bg-brand-gray rounded-xs">
                      <img 
                        src={project.mainImage} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.015]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-brand-charcoal/10 group-hover:bg-brand-charcoal/0 transition-colors"></div>
                      
                      <div className="absolute right-4 top-4 bg-white/95 text-brand-charcoal text-[9px] uppercase tracking-widest px-3 py-1 font-semibold rounded-xs border border-brand-border">
                        {project.category}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-t border-brand-border/60 pt-4">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-widest text-brand-green font-semibold">
                          {project.location}
                        </span>
                        <h3 className="text-2xl font-display font-medium text-brand-charcoal group-hover:text-brand-green transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-xs font-light text-gray-400 leading-relaxed max-w-md line-clamp-2 mt-1">
                          {project.description}
                        </p>
                      </div>

                      <div className="shrink-0">
                        <span className="text-[10px] uppercase tracking-widest text-brand-charcoal font-bold flex items-center gap-1">
                          <span>View Case Journal</span>
                          <ArrowUpRight className="w-4 h-4 text-brand-green" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* =========================================================================
              VIEW: SERVICES PAGE
              ========================================================================= */}
          {currentView === 'services' && (
            <motion.div
              key="services-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-6 sm:px-12 py-16 space-y-12"
            >
              <div className="text-left space-y-3">
                <span className="text-xs uppercase tracking-[0.3em] text-brand-green font-semibold block">Craft Divisions</span>
                <h1 className="text-4xl md:text-5xl font-display font-medium text-brand-charcoal tracking-tight">
                  Bespoke Architectural Services
                </h1>
                <p className="text-sm font-sans font-light text-gray-400 max-w-xl leading-relaxed">
                  We handle the complete scope of luxury transformations—from initial spatial models to bespoke furniture fabrication and staging.
                </p>
              </div>

              {/* Custom tabs controller component */}
              <ServiceTabs 
                onSelectProject={(project) => setSelectedProject(project)}
                onOpenConsultation={() => setIsConsultationModalOpen(true)}
                initialServiceId={activeServiceId}
                services={siteData.services}
                projects={siteData.projects}
                phoneWhatsApp={siteData.contactInfo.phoneWhatsApp}
              />
            </motion.div>
          )}

          {/* =========================================================================
              VIEW: JOURNAL (REBRANDED BLOG)
              ========================================================================= */}
          {currentView === 'journal' && (
            <motion.div
              key="journal-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-6 sm:px-12 py-16 space-y-12"
            >
              <div className="text-left space-y-3">
                <span className="text-xs uppercase tracking-[0.3em] text-brand-green font-semibold block">Design Chronicle</span>
                <h1 className="text-4xl md:text-5xl font-display font-medium text-brand-charcoal tracking-tight">
                  The SpacePro Journal
                </h1>
                <p className="text-sm font-sans font-light text-gray-400 max-w-xl leading-relaxed">
                  Reflections on material aesthetics, structural finishes, interior trends, and high-end design principles for premium West African homes.
                </p>
              </div>

              {/* Custom Journal feed and reading component */}
              <JournalSection posts={siteData.journalPosts} />
            </motion.div>
          )}

          {/* =========================================================================
              VIEW: CONTACT EXPERIENCE
              ========================================================================= */}
          {currentView === 'contact' && (
            <motion.div
              key="contact-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-6 sm:px-12 py-16 space-y-16 text-left"
            >
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-[0.3em] text-brand-green font-semibold block">Connect</span>
                <h1 className="text-4xl md:text-5xl font-display font-medium text-brand-charcoal tracking-tight">
                  Establish Contact
                </h1>
                <p className="text-sm font-sans font-light text-gray-400 max-w-xl leading-relaxed">
                  An outstanding spatial masterwork begins with a conversation. Visit our Ikoyi design offices or submit an inquiry to coordinate a private site visit.
                </p>
              </div>

              {/* Layout grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 font-sans">
                
                {/* Contact Coordinates (Left) */}
                <div className="lg:col-span-5 space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-xs uppercase tracking-widest text-brand-green font-bold">Private Client Desk</h3>
                    
                    <div className="space-y-4 text-xs font-light text-gray-500">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                        <div>
                          <strong>Studio Locations:</strong> <br />
                          <span className="text-brand-charcoal font-medium">{siteData.contactInfo.addressLine1}</span>
                          {siteData.contactInfo.addressLine2 && <><br />{siteData.contactInfo.addressLine2}</>}
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <PhoneCall className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                        <div>
                          <strong>Telephone & WhatsApp:</strong> <br />
                          {siteData.contactInfo.phone} <br />
                          <span className="text-gray-400 text-[11px]">(Direct Line & WhatsApp Consultant)</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                        <div>
                          <strong>Email:</strong> <br />
                          <a href={`mailto:${siteData.contactInfo.emailConcierge}`} className="text-brand-green hover:underline">
                            {siteData.contactInfo.emailConcierge}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Direct */}
                  <div className="p-6 bg-brand-gray border border-brand-border rounded-sm space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">Immediate Chat Access</h4>
                    <p className="text-xs font-light text-gray-500 leading-relaxed">
                      Would you like to transmit your architect’s blueprints directly? Initiate a secure WhatsApp session with our Lead Finishing Director.
                    </p>
                    <a 
                      href={`https://wa.me/${siteData.contactInfo.phoneWhatsApp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-brand-green hover:bg-brand-charcoal text-white text-xs uppercase tracking-widest font-semibold transition-colors shadow-xs"
                    >
                      <span>Open WhatsApp Chat</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Interactive Mock Map Component */}
                  <div className="h-64 w-full bg-brand-gray border border-brand-border rounded-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-cover bg-center filter grayscale contrast-125 opacity-70" style={{ backgroundImage: `url('${siteData.contactInfo.mapImage}')` }}></div>
                    <div className="absolute inset-0 bg-brand-green/10 mix-blend-multiply"></div>
                    <div className="absolute inset-0 flex flex-col justify-between p-6">
                      <span className="bg-brand-charcoal text-white text-[9px] uppercase tracking-widest px-3 py-1 font-bold rounded-xs self-start border border-white/10 shadow-md">
                        Nigeria Studio Network
                      </span>
                      <div className="bg-white/95 backdrop-blur-md p-4 border border-brand-border rounded-xs text-left max-w-xs">
                        <div className="text-xs font-bold text-brand-charcoal">SpacePro Bespoke Finishing</div>
                        <div className="text-[10px] text-gray-500 font-medium mt-0.5">{siteData.contactInfo.addressLine1}</div>
                        <a 
                          href="mailto:info@spacepro.ng" 
                          className="text-[9px] uppercase tracking-widest text-brand-green font-bold block mt-2 hover:underline"
                        >
                          info@spacepro.ng
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Consultation Message form (Right) */}
                <div className="lg:col-span-7 bg-brand-gray p-8 sm:p-12 border border-brand-border rounded-sm">
                  <h3 className="text-2xl font-display font-medium text-brand-charcoal mb-2">Transmitting Requirements</h3>
                  <p className="text-xs font-light text-gray-400 mb-8 leading-relaxed">
                    Please populate the form fields below. A concierge representative will review your project parameters and respond within 24 hours.
                  </p>

                  <AnimatePresence mode="wait">
                    {contactFormSubmitted ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-12 space-y-4"
                      >
                        <div className="w-16 h-16 bg-brand-green/10 rounded-full border border-brand-green/20 flex items-center justify-center mx-auto">
                          <CheckCircle2 className="w-6 h-6 text-brand-green" />
                        </div>
                        <h4 className="text-xl font-display font-medium text-brand-charcoal">Message Logged</h4>
                        <p className="text-xs font-light text-gray-500 max-w-md mx-auto leading-relaxed">
                          Thank you for connecting. Your request details have been synchronized with our private client registry database. We will be in contact shortly.
                        </p>
                        <button
                          onClick={() => setContactFormSubmitted(false)}
                          className="text-xs uppercase tracking-widest text-brand-green hover:text-brand-charcoal font-semibold pt-4"
                        >
                          Submit Another Inquiry
                        </button>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleContactSubmit} className="space-y-4 font-sans">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[9px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Your Name</label>
                            <input 
                              type="text" 
                              required
                              value={contactForm.name}
                              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                              placeholder="e.g. Kolawole Cole"
                              className="w-full bg-white border border-brand-border text-xs px-4 py-3.5 focus:border-brand-green focus:outline-none transition-colors"
                            />
                          </div>

                          <div>
                            <label className="text-[9px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Email Address</label>
                            <input 
                              type="email" 
                              required
                              value={contactForm.email}
                              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                              placeholder="e.g. k.cole@domain.com"
                              className="w-full bg-white border border-brand-border text-xs px-4 py-3.5 focus:border-brand-green focus:outline-none transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[9px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Contact Line</label>
                          <input 
                            type="tel" 
                            required
                            value={contactForm.phone}
                            onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                            placeholder="e.g. +234 803 000 0000"
                            className="w-full bg-white border border-brand-border text-xs px-4 py-3.5 focus:border-brand-green focus:outline-none transition-colors"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Aesthetic Subject</label>
                          <input 
                            type="text" 
                            required
                            value={contactForm.subject}
                            onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                            placeholder="e.g. Master Bedroom Plaster and Bookmatching inquiry"
                            className="w-full bg-white border border-brand-border text-xs px-4 py-3.5 focus:border-brand-green focus:outline-none transition-colors"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Spatial Narrative / Details</label>
                          <textarea 
                            rows={4}
                            required
                            value={contactForm.message}
                            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                            placeholder="Provide details about the project context, timeline, locations, or special materials..."
                            className="w-full bg-white border border-brand-border text-xs px-4 py-3.5 focus:border-brand-green focus:outline-none transition-colors"
                          />
                        </div>

                        <div className="pt-2">
                          <button
                            type="submit"
                            className="w-full py-4 bg-brand-charcoal hover:bg-brand-green text-white text-xs uppercase tracking-widest font-semibold transition-colors duration-300 shadow-sm flex items-center justify-center gap-2"
                          >
                            <span>Transmit Form Message</span>
                            <ArrowRight className="w-4 h-4 text-brand-green" />
                          </button>
                        </div>
                      </form>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* 3. LUXURY MAGAZINE-STYLE FOOTER */}
      <footer id="magazine-footer" className="bg-brand-charcoal text-white pt-20 pb-10 border-t border-brand-border/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 text-left font-sans mb-16">
          
          {/* Logo / Brand bio (Spans 4 columns) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex flex-col">
              <img 
                src={siteData.logoImage || "https://cdn.phototourl.com/member/2026-08-26-cc44dfe5-a445-4f55-99fa-01a62d3e3568.png"} 
                alt="SpacePro Logo" 
                className="h-[48px] w-auto object-contain self-start filter brightness-0 invert transition-transform duration-250 ease-out hover:scale-[1.03]"
                loading="lazy"
              />
            </div>
            
            <p className="text-xs font-light text-white/60 leading-relaxed max-w-sm">
              We specialize in taking bare developer concrete shells and completing them to radical, bespoke architectural masterworks. Based in Ikoyi, Lagos, serving premium residential, corporate, and private clients worldwide.
            </p>

            <div className="flex items-center gap-1.5 text-[10px] text-brand-green font-medium uppercase tracking-wider">
              <span className="w-2 h-2 bg-brand-green rounded-full animate-ping"></span>
              <span>Available for 2026 Q3 Commissions</span>
            </div>
          </div>

          {/* Directory Links (Spans 2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-white font-bold">Studio Directory</h4>
            <ul className="space-y-2.5 text-xs font-light text-white/50">
              {['home', 'portfolio', 'services', 'journal', 'contact'].map((viewId) => (
                <li key={viewId}>
                  <button 
                    onClick={() => {
                      setCurrentView(viewId);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-brand-green uppercase tracking-wider text-[10px] focus:outline-none transition-colors cursor-pointer"
                  >
                    {viewId}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Quick Index (Spans 3 columns) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-white font-bold">Services Index</h4>
            <ul className="space-y-2.5 text-xs font-light text-white/50">
              {[
                { id: 'interior-design', label: 'Luxury Interior Design' },
                { id: 'turnkey-renovation', label: 'Turnkey Renovation' },
                { id: 'space-finishing', label: 'Space Finishing & Plasters' },
                { id: 'furnishing', label: 'Curated Furnishing' }
              ].map((s) => (
                <li key={s.id}>
                  <button 
                    onClick={() => {
                      setActiveServiceId(s.id);
                      setCurrentView('services');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-brand-green text-left focus:outline-none transition-colors cursor-pointer"
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal / Location specs (Spans 3 columns) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-white font-bold">Locations</h4>
            <div className="space-y-3 text-xs font-light text-white/50">
              <p className="leading-relaxed font-medium text-white/85 tracking-wider text-xs">
                PHC | LAGOS | ABUJA | ASABA
              </p>
              <p>
                Direct: {siteData.contactInfo.phone} <br />
                WhatsApp: {siteData.contactInfo.phoneWhatsApp}
              </p>
              <div className="pt-1">
                <span className="inline-block px-2.5 py-0.5 bg-white/5 border border-white/10 rounded-xs text-[10px] font-mono tracking-widest text-brand-green font-semibold">
                  RC: 1828272
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Lower Legal Bar */}
        <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-white/40">
          <div className="flex flex-wrap gap-4 items-center">
            <span>© {new Date().getFullYear()} {siteData.logoText} Bespoke. All Rights Reserved.</span>
            <span>•</span>
            <span className="text-[10px] text-white/60 font-mono tracking-wider">RC: 1828272</span>
            <span>•</span>
            <span className="text-[10px] text-brand-green font-mono uppercase tracking-widest">Designed for Legacy</span>
          </div>
          
          <div className="flex gap-6">
            <a href="#privacy" className="hover:text-brand-green transition-colors">Privacy Charter</a>
            <a href="#terms" className="hover:text-brand-green transition-colors">Client Covenant</a>
            {/* Elegant tiny Lock key in the corner of footer */}
            <button 
              onClick={() => setIsAdminOpen(true)}
              className="text-[10px] text-white/30 hover:text-brand-green uppercase tracking-widest transition-colors font-mono cursor-pointer"
            >
              🔑 [Console]
            </button>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          4. IMMERSIVE CASE STUDY OVERLAY (MODAL PANEL)
          ========================================================================= */}
      <AnimatePresence>
        {selectedProject && (
          <CaseStudyModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)}
            allProjects={siteData.projects}
            onSelectProject={(project) => {
              setSelectedProject(project);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </AnimatePresence>

      {/* =========================================================================
          5. BOOKING / CONSULTATION DIALOG OVERLAY (MODAL PANEL)
          ========================================================================= */}
      <AnimatePresence>
        {isConsultationModalOpen && (
          <motion.div 
            id="consultation-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-charcoal/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-sm shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
            >
              {/* Close Button overlay */}
              <button
                onClick={() => setIsConsultationModalOpen(false)}
                className="absolute right-6 top-6 text-gray-400 hover:text-brand-charcoal z-10 transition-colors focus:outline-none"
              >
                <span className="text-xs uppercase tracking-widest mr-2">Dismiss</span>
                <span>✖</span>
              </button>

              {/* Injected Form Component */}
              <ConsultationForm 
                onClose={() => setIsConsultationModalOpen(false)} 
                embedMode={false} 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          6.Besoke SPACEPRO SITE CUSTOMIZATION / ADMIN PORTAL OVERLAY
          ========================================================================= */}
      <AnimatePresence>
        {isAdminOpen && (
          <AdminPortal
            siteData={siteData}
            onUpdateSiteData={handleUpdateSiteData}
            onClose={() => setIsAdminOpen(false)}
            onReset={handleResetSiteData}
          />
        )}
      </AnimatePresence>

      {/* =========================================================================
          7. CLIENT EXPERIENCE IMAGE LIGHTBOX MODAL
          ========================================================================= */}
      <AnimatePresence>
        {selectedExperienceImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-charcoal/90 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 md:p-10"
            onClick={() => setSelectedExperienceImage(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-sm shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col border border-brand-border"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border bg-brand-gray/50 shrink-0">
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-brand-green font-semibold">
                    Client Space Exhibition
                  </div>
                  <h3 className="text-base sm:text-lg font-display font-medium text-brand-charcoal">
                    {selectedExperienceImage.clientName} {selectedExperienceImage.projectTitle ? `— ${selectedExperienceImage.projectTitle}` : ''}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedExperienceImage(null)}
                  className="p-2 text-gray-400 hover:text-brand-charcoal hover:bg-brand-gray rounded-xs transition-colors cursor-pointer"
                  aria-label="Close image viewer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body - Image */}
              <div className="flex-1 bg-neutral-950 flex items-center justify-center p-3 sm:p-6 overflow-hidden relative min-h-[300px]">
                <img 
                  src={selectedExperienceImage.image} 
                  alt={selectedExperienceImage.clientName} 
                  className="max-h-[60vh] sm:max-h-[66vh] w-auto max-w-full object-contain rounded-xs shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Modal Footer - Client details & experience summary */}
              <div className="px-6 py-4 bg-white border-t border-brand-border text-left font-sans flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shrink-0">
                <div className="space-y-0.5">
                  <div className="font-semibold text-brand-charcoal">
                    {selectedExperienceImage.clientName}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {selectedExperienceImage.role} • <span className="text-brand-green font-medium">{selectedExperienceImage.location}</span>
                  </div>
                </div>
                {selectedExperienceImage.achievement && (
                  <div className="text-[10px] font-mono text-gray-400 max-w-md">
                    <span className="font-semibold text-brand-charcoal">Achievement:</span> {selectedExperienceImage.achievement}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <MouseFollower />
    </div>
  );
}
