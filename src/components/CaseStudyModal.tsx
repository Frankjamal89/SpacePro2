import { X, Calendar, MapPin, Tag, User, Layers, CheckCircle2, Bookmark } from 'lucide-react';
import { motion } from 'motion/react';
import { Project } from '../types';

interface CaseStudyModalProps {
  project: Project;
  onClose: () => void;
  allProjects?: Project[];
  onSelectProject?: (project: Project) => void;
}

export default function CaseStudyModal({ project, onClose, allProjects = [], onSelectProject }: CaseStudyModalProps) {
  // Get other projects in same category for "Related Projects" section
  const relatedProjects = allProjects
    .filter(p => p.id !== project.id && p.category === project.category)
    .slice(0, 2);

  // Fallback to other projects if none in same category
  const backupRelated = allProjects.filter(p => p.id !== project.id).slice(0, 2);
  const displaysRelated = relatedProjects.length > 0 ? relatedProjects : backupRelated;

  return (
    <motion.div 
      id="case-study-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-white overflow-y-auto"
    >
      {/* Editorial Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-brand-border flex items-center justify-between px-6 sm:px-12 py-4">
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.25em] text-brand-green font-medium">SpacePro Portfolio</span>
          <span className="text-gray-300">|</span>
          <span className="text-xs font-light text-gray-500 font-sans italic">{project.title}</span>
        </div>
        <button 
          onClick={onClose}
          className="group flex items-center gap-2 text-xs uppercase tracking-widest text-brand-charcoal hover:text-brand-green focus:outline-none transition-colors"
        >
          <span>Close Journal</span>
          <div className="w-8 h-8 rounded-full border border-brand-border group-hover:border-brand-green flex items-center justify-center transition-colors">
            <X className="w-3.5 h-3.5" />
          </div>
        </button>
      </div>

      {/* Hero Visual Section */}
      <div className="relative w-full h-[60vh] md:h-[75vh] bg-brand-gray overflow-hidden">
        <img 
          src={project.mainImage} 
          alt={project.title} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/60 via-transparent to-transparent"></div>
        <div className="absolute bottom-12 left-6 sm:left-12 md:left-24 max-w-3xl text-white space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] bg-brand-green text-white px-3 py-1 rounded-xs font-medium">
            {project.category}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-medium tracking-tight">
            {project.title}
          </h1>
          <p className="text-sm sm:text-base font-light text-white/80 max-w-xl font-sans leading-relaxed">
            {project.location} • Completed in {project.year}
          </p>
        </div>
      </div>

      {/* Main Magazine Layout */}
      <div className="max-w-6xl mx-auto px-6 sm:px-12 md:px-24 py-16 space-y-20 font-sans">
        
        {/* Project Metadata Dashboard Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-brand-border text-brand-charcoal">
          <div className="space-y-1">
            <div className="text-[10px] uppercase tracking-widest text-gray-400 font-medium flex items-center gap-1.5">
              <User className="w-3 h-3 text-brand-green" /> Client
            </div>
            <div className="text-sm font-semibold">{project.clientName}</div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] uppercase tracking-widest text-gray-400 font-medium flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-brand-green" /> Location
            </div>
            <div className="text-sm font-semibold">{project.location}</div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] uppercase tracking-widest text-gray-400 font-medium flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-brand-green" /> Year
            </div>
            <div className="text-sm font-semibold">{project.year}</div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] uppercase tracking-widest text-gray-400 font-medium flex items-center gap-1.5">
              <Tag className="w-3 h-3 text-brand-green" /> Core Focus
            </div>
            <div className="text-sm font-semibold">{project.category} Finishing</div>
          </div>
        </div>

        {/* Narrative & Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Story (Left) */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-brand-green font-medium block">The Commission</span>
            <h2 className="text-3xl font-display font-medium text-brand-charcoal tracking-tight">
              Crafting A Bespoke Legacy
            </h2>
            <p className="text-sm font-light text-gray-600 leading-relaxed">
              {project.description}
            </p>
            <p className="text-sm font-light text-gray-600 leading-relaxed">
              Our studio approach was to reject industrial standards, choosing instead to focus entirely on handcrafted touchpoints, natural material patinas, and customized spatial volume. Walkways were realigned to expand lines of sight, while structural pillars were cladded in pristine stone panels.
            </p>

            <div className="bg-brand-gray/50 p-6 border-l-2 border-brand-green rounded-r-xs mt-8">
              <div className="text-[10px] uppercase tracking-wider text-brand-green font-medium mb-2">Signature Plaque</div>
              <p className="text-xs font-light text-gray-500 italic leading-relaxed">
                "Our space is no longer just a physical boundary; it has become a serene extension of our mental clarity. Every single joint is flawless."
              </p>
              <div className="text-[10px] font-semibold text-brand-charcoal mt-3">— {project.clientName}</div>
            </div>
          </div>

          {/* Design Specifications Panel (Right) */}
          <div className="lg:col-span-5 bg-brand-gray p-8 rounded-sm border border-brand-border/60 self-start space-y-6">
            <h3 className="text-xs uppercase tracking-[0.25em] text-brand-charcoal font-semibold flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-green" /> Spatial Specifications
            </h3>
            
            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-gray-400 block">Exquisite Material Palette</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {project.materials.map((mat, i) => (
                    <span key={i} className="text-[10px] uppercase tracking-wider bg-white border border-brand-border px-3 py-1 rounded-full text-brand-charcoal">
                      {mat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 block mb-2">Key Accomplishments</span>
                <ul className="text-xs font-light text-gray-600 space-y-2.5">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-green shrink-0" />
                    <span>Custom acoustic insulation layers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-green shrink-0" />
                    <span>Millimetric bookmatched marble walls</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-green shrink-0" />
                    <span>Smart-home lighting presets integrated</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-green shrink-0" />
                    <span>Hand-burnished structural plasters</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Deep Dive Challenges & Solutions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-brand-border">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-red-700 font-medium">The Architectural Challenge</span>
            <p className="text-sm font-light text-gray-600 leading-relaxed">
              {project.challenges}
            </p>
          </div>
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-brand-green font-medium">The SpacePro Solution</span>
            <p className="text-sm font-light text-gray-600 leading-relaxed">
              {project.solutions}
            </p>
          </div>
        </div>

        {/* Full-Bleed Architectural Showcase of Uploaded Project Image */}
        <div className="space-y-6 py-8 border-y border-brand-border">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-brand-green font-medium block mb-1">Architectural Compendium</span>
              <h3 className="text-2xl sm:text-3xl font-display font-medium text-brand-charcoal">Finished Project Showcase</h3>
            </div>
            <span className="text-xs text-gray-400 font-mono tracking-wider">{project.location} • {project.year}</span>
          </div>

          <div className="w-full h-[55vh] md:h-[70vh] overflow-hidden rounded-xs border border-brand-border bg-brand-gray relative group">
            <img 
              src={project.mainImage} 
              alt={project.title} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.01]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-6 left-6 bg-brand-charcoal/85 backdrop-blur-md text-white text-[10px] uppercase tracking-widest px-4 py-2 rounded-xs border border-white/10 font-sans shadow-lg">
              {project.title} — Verified Finished Space
            </div>
          </div>
        </div>

        {/* Related Projects Editorial List */}
        <div className="pt-16 border-t border-brand-border space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-gray-400 font-medium block">Explore More</span>
              <h3 className="text-2xl font-display text-brand-charcoal font-medium">Related Creations</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displaysRelated.map((p) => (
              <div 
                key={p.id}
                onClick={() => onSelectProject?.(p)}
                className="group cursor-pointer space-y-4 text-left"
              >
                <div className="relative h-64 w-full overflow-hidden bg-brand-gray border border-brand-border rounded-xs">
                  <img 
                    src={p.mainImage} 
                    alt={p.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-brand-charcoal/10 group-hover:bg-brand-charcoal/0 transition-colors"></div>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-brand-green font-medium block mb-1">
                    {p.category}
                  </span>
                  <h4 className="text-lg font-display text-brand-charcoal group-hover:text-brand-green transition-colors font-medium">
                    {p.title}
                  </h4>
                  <p className="text-xs text-gray-400 font-sans">{p.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Design Reservation Offer */}
        <div className="bg-brand-gray p-8 sm:p-12 border border-brand-border text-center space-y-4 rounded-sm">
          <Bookmark className="w-6 h-6 text-brand-green mx-auto" />
          <h4 className="text-2xl font-display font-medium text-brand-charcoal">Desiring Pristine Space Finishing?</h4>
          <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
            Every home we finishing becomes a physical work of legacy art. Reserve an executive site consultation to blueprint your architectural transition.
          </p>
          <div className="pt-2">
            <a 
              href="#consultation-form-card" 
              onClick={() => {
                onClose();
                setTimeout(() => {
                  document.getElementById('consultation-form-card')?.scrollIntoView({ behavior: 'smooth' });
                }, 200);
              }}
              className="inline-block px-8 py-3 bg-brand-green text-white text-xs uppercase tracking-widest hover:bg-brand-charcoal transition-colors font-semibold"
            >
              Request Free Estimate
            </a>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
