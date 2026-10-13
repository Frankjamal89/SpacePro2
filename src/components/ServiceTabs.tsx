import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ChevronDown, HelpCircle, ArrowRight, BookOpen, Sparkles, Star } from 'lucide-react';
import { Service, Project } from '../types';
import { SERVICES, PROJECTS } from '../data';

interface ServiceTabsProps {
  onSelectProject: (project: Project) => void;
  onOpenConsultation: () => void;
  initialServiceId?: string;
  services?: Service[];
  projects?: Project[];
  phoneWhatsApp?: string;
}

export default function ServiceTabs({ 
  onSelectProject, 
  onOpenConsultation, 
  initialServiceId,
  services: propServices,
  projects: propProjects,
  phoneWhatsApp
}: ServiceTabsProps) {
  const SERVICES_LIST = propServices || SERVICES;
  const PROJECTS_LIST = propProjects || PROJECTS;

  const [activeServiceId, setActiveServiceId] = useState(initialServiceId || 'interior-design');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const activeService = SERVICES_LIST.find(s => s.id === activeServiceId) || SERVICES_LIST[0];

  // Filter projects associated with this service category
  const serviceCategoryMap: Record<string, string> = {
    'interior-design': 'Residential',
    'turnkey-renovation': 'Renovation',
    'space-finishing': 'Commercial', // maps space-finishing to commercial/custom cases
    'furnishing': 'Furnishing'
  };

  const associatedProjects = PROJECTS_LIST.filter(
    p => p.category === serviceCategoryMap[activeServiceId] || p.category === 'Residential'
  ).slice(0, 2);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div id="services-component" className="w-full space-y-16">
      
      {/* Upper Navigation Tabs (Interactive Brochure Menu) */}
      <div className="flex flex-wrap justify-center border-b border-brand-border pb-4 gap-4 md:gap-8 font-sans">
        {SERVICES_LIST.map((service) => (
          <button
            key={service.id}
            onClick={() => {
              setActiveServiceId(service.id);
              setExpandedFaq(null);
            }}
            className={`text-xs md:text-sm uppercase tracking-[0.25em] pb-3 transition-all font-medium relative focus:outline-none ${
              activeServiceId === service.id 
                ? 'text-brand-green font-semibold' 
                : 'text-gray-400 hover:text-brand-charcoal'
            }`}
          >
            {service.name}
            {activeServiceId === service.id && (
              <motion.span 
                layoutId="activeServiceUnderline" 
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-green" 
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeServiceId}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4 }}
          className="space-y-20"
        >
          {/* Sub-Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="text-xs uppercase tracking-[0.3em] text-brand-green font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-green" /> 
                {activeService.tagline}
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-medium text-brand-charcoal tracking-tight leading-tight">
                {activeService.title}
              </h2>
              <p className="text-sm font-light text-gray-500 leading-relaxed font-sans">
                {activeService.description}
              </p>

              <div className="pt-4 flex flex-wrap gap-4">
                <a 
                  href={`https://wa.me/${(phoneWhatsApp || '+234 707 115 5646').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3.5 bg-brand-green text-white text-xs uppercase tracking-widest hover:bg-brand-charcoal transition-colors font-semibold shadow-sm"
                >
                  Chat with Design Partner
                </a>
                <a 
                  href={`https://wa.me/${(phoneWhatsApp || '+234 707 115 5646').replace(/[^0-9]/g, '')}?text=Please%20send%20me%20the%20SpacePro%20Brochure%20PDF`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 border border-brand-border text-brand-charcoal hover:border-brand-green text-xs uppercase tracking-widest transition-colors font-sans flex items-center gap-2"
                >
                  Request Brochure PDF
                </a>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative h-[380px] md:h-[460px] w-full overflow-hidden bg-brand-gray border border-brand-border rounded-sm group shadow-xl">
                <img 
                  src={activeService.brochureImage} 
                  alt={activeService.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-brand-charcoal/5"></div>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="py-12 bg-brand-gray border-y border-brand-border/80 px-6 sm:px-12 rounded-xs">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-brand-green font-semibold block mb-2">Exclusives</span>
                <h3 className="text-2xl font-display font-medium text-brand-charcoal">Why Choose SpacePro Finishing?</h3>
                <p className="text-xs font-light text-gray-400 mt-2 leading-relaxed font-sans">
                  We maintain absolute material custody, meaning every slab of marble and hand-burnished wood handles are managed through our direct logistical framework.
                </p>
              </div>

              <div className="space-y-4">
                {activeService.benefits.map((benefit, i) => (
                  <div key={i} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                    <p className="text-xs font-light text-gray-600 leading-relaxed font-sans">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Luxury Design Journey Timeline */}
          <div className="space-y-12">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <span className="text-xs uppercase tracking-[0.3em] text-brand-green font-semibold">Orchestrated Execution</span>
              <h3 className="text-3xl font-display font-medium text-brand-charcoal">The Architectural Journey</h3>
              <p className="text-xs font-light text-gray-400 font-sans leading-relaxed">
                We believe standard projects rush finishing. SpacePro sequences physical construction to preserve timber stability and maximize stone bookmatching perfection.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
              {activeService.processSteps.map((step, idx) => (
                <div 
                  key={idx} 
                  className="bg-white border border-brand-border p-6 rounded-sm text-left hover:border-brand-green transition-colors duration-300 relative space-y-3 shadow-xs group"
                >
                  <span className="text-4xl font-display font-bold text-brand-green/20 group-hover:text-brand-green/30 transition-colors block">
                    {step.step}
                  </span>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal">
                    {step.title}
                  </h4>
                  <p className="text-xs font-light text-gray-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Contextual Case Studies */}
          <div className="space-y-8 text-left">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-gray-400 font-medium block">Proven Quality</span>
              <h3 className="text-2xl font-display text-brand-charcoal font-medium">Associated Masterpieces</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {associatedProjects.map((p) => (
                <div 
                  key={p.id}
                  onClick={() => onSelectProject(p)}
                  className="group cursor-pointer flex flex-col md:flex-row gap-6 bg-white border border-brand-border p-4 rounded-xs items-center hover:border-brand-green transition-colors"
                >
                  <div className="h-44 w-full md:w-44 overflow-hidden rounded-xs bg-brand-gray shrink-0 relative">
                    <img 
                      src={p.mainImage} 
                      alt={p.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <span className="text-[10px] uppercase tracking-widest text-brand-green font-medium font-sans">
                      {p.category}
                    </span>
                    <h4 className="text-lg font-display text-brand-charcoal group-hover:text-brand-green transition-colors font-medium">
                      {p.title}
                    </h4>
                    <p className="text-xs font-light text-gray-400 line-clamp-2 leading-relaxed font-sans">
                      {p.description}
                    </p>
                    <span className="text-[10px] uppercase tracking-widest text-brand-charcoal font-semibold flex items-center gap-1 font-sans">
                      <BookOpen className="w-3.5 h-3.5 text-brand-green" /> View Journal
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dedicated FAQs for this Service */}
          <div className="max-w-3xl mx-auto space-y-8 font-sans">
            <div className="text-center space-y-3">
              <span className="text-xs uppercase tracking-[0.3em] text-brand-green font-semibold block">Inquiries Resolved</span>
              <h3 className="text-2xl font-display font-medium text-brand-charcoal">Service Level FAQ</h3>
            </div>

            <div className="space-y-4 text-left">
              {activeService.faqs.map((faq, idx) => {
                const isOpen = expandedFaq === idx;
                return (
                  <div 
                    key={idx} 
                    className="border border-brand-border rounded-xs overflow-hidden transition-all duration-300"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full px-6 py-4.5 bg-brand-gray/40 hover:bg-brand-gray flex items-center justify-between text-left focus:outline-none transition-colors"
                    >
                      <span className="text-xs font-semibold uppercase tracking-wide text-brand-charcoal flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-brand-green shrink-0" />
                        {faq.question}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="bg-white px-6 py-4.5 border-t border-brand-border text-xs font-light text-gray-500 leading-relaxed"
                        >
                          {faq.answer}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section Footer CTA */}
          <div className="bg-brand-charcoal text-white p-8 md:p-12 text-center rounded-sm space-y-6">
            <div className="inline-flex items-center gap-1 bg-brand-green/20 border border-brand-green/40 px-3 py-1 rounded-full">
              <Star className="w-3.5 h-3.5 text-brand-green fill-brand-green" />
              <span className="text-[10px] uppercase tracking-wider text-brand-green font-medium font-sans">Strict Client Limit Enforced</span>
            </div>
            <h3 className="text-3xl font-display font-medium max-w-xl mx-auto">Ready to craft a space that echoes your lifestyle?</h3>
            <p className="text-xs text-white/70 max-w-md mx-auto leading-relaxed font-sans font-light">
              Submit your spatial requirements via our private estimators or client onboarding portal to reserve a structural finishing timeframe.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${(phoneWhatsApp || '+234 707 115 5646').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-brand-green hover:bg-white hover:text-brand-charcoal text-white text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-sm flex items-center gap-2 mx-auto w-fit"
              >
                <span>Connect with a Designer</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
