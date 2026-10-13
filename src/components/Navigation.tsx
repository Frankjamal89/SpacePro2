import { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, PhoneCall, Sparkles } from 'lucide-react';
import { SiteData } from '../types';

interface NavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenConsultation: () => void;
  siteData?: SiteData;
  onOpenAdmin?: () => void;
}

export default function Navigation({ currentView, onNavigate, onOpenConsultation, siteData, onOpenAdmin }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'services', label: 'Services' },
    { id: 'journal', label: 'Journal' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header 
      id="main-navigation"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 font-sans ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md py-3.5 shadow-sm border-b border-brand-border' 
          : 'bg-white py-4.5 border-b border-brand-border/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between">
        {/* Brand Logo - Premium high-res graphic logo */}
        <div 
          onClick={() => handleNavClick('home')}
          className="cursor-pointer flex items-center gap-2 group transition-opacity duration-300 animate-fade-in"
        >
          <img 
            src={siteData?.logoImage || "https://cdn.phototourl.com/member/2026-08-26-cc44dfe5-a445-4f55-99fa-01a62d3e3568.png"} 
            alt="SpacePro Logo" 
            className="h-[36px] sm:h-[42px] md:h-[48px] lg:h-[52px] w-auto object-contain transition-all duration-250 ease-out group-hover:scale-[1.03] drop-shadow-[0_2px_4px_rgba(0,0,0,0.08)]"
            loading="eager"
            fetchPriority="high"
          />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-xs uppercase tracking-[0.25em] font-medium transition-all duration-300 relative py-1.5 focus:outline-none ${
                currentView === item.id 
                  ? 'text-brand-green font-semibold' 
                  : 'text-gray-400 hover:text-brand-charcoal'
              }`}
            >
              {item.label}
              {currentView === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-brand-green"></span>
              )}
            </button>
          ))}
        </nav>

        {/* Header CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <a 
            href={`https://wa.me/${(siteData?.contactInfo.phoneWhatsApp || '+234 707 115 5646').replace(/[^0-9]/g, '')}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] uppercase tracking-wider text-gray-500 hover:text-brand-green transition-colors flex items-center gap-1.5"
          >
            <PhoneCall className="w-3 h-3" />
            <span>Consultant Direct</span>
          </a>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-brand-charcoal hover:text-brand-green focus:outline-none p-1.5"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-brand-border shadow-xl animate-fade-in py-8 px-6 space-y-6">
          <div className="flex flex-col gap-5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left text-sm uppercase tracking-[0.25em] py-2 border-b border-brand-border/40 focus:outline-none ${
                  currentView === item.id 
                    ? 'text-brand-green font-semibold' 
                    : 'text-gray-400'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-4 flex flex-col gap-4">
            <a 
              href={`https://wa.me/${(siteData?.contactInfo.phoneWhatsApp || '+234 707 115 5646').replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-wider text-gray-500 flex items-center gap-2 py-2"
            >
              <PhoneCall className="w-4 h-4 text-brand-green" />
              <span>Direct WhatsApp Line</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
