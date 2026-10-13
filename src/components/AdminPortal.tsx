import { useState, useRef, FormEvent, ChangeEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  Check, 
  Trash2, 
  Plus, 
  Edit3, 
  Save, 
  RefreshCw, 
  ArrowLeft, 
  Upload, 
  Image as ImageIcon, 
  FolderPlus,
  FileText,
  FileCheck,
  Download,
  AlertTriangle,
  Sparkles,
  Layers,
  Star,
  BookOpen,
  Info,
  ChevronRight,
  User,
  MapPin,
  Maximize2
} from 'lucide-react';
import { SiteData, Project, Service, JournalPost, ClientExperience, ProjectCategory, JournalCategory } from '../types';

interface AdminPortalProps {
  siteData: SiteData;
  onUpdateSiteData: (newData: SiteData) => void;
  onClose: () => void;
  onReset: () => void;
}

const CATEGORIES: ProjectCategory[] = ['Residential', 'Commercial', 'Renovation', 'Furnishing'];
const JOURNAL_CATEGORIES: JournalCategory[] = [
  'Design Inspiration',
  'Luxury Living',
  'Interior Trends',
  'Architecture',
  'Property Enhancement',
  'Design Guides'
];

export default function AdminPortal({ siteData, onUpdateSiteData, onClose, onReset }: AdminPortalProps) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('spacepro_admin_authed') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);

  // General UI state
  const [activeTab, setActiveTab] = useState<'branding' | 'portfolio' | 'services' | 'journal' | 'testimonials' | 'stats' | 'contact' | 'system' | 'ai-remodel'>('branding');
  const [saveStatus, setSaveStatus] = useState<string>('');

  // AI Remodel Studio Admin States
  const [remodelData, setRemodelData] = useState<{
    settings: { activeProvider: 'google' | 'openai' | 'flux' | 'sdxl'; generationLimit: number; promptTemplate: string };
    quoteRequests: any[];
    projects: any[];
    usageLogs: any[];
    projectsCount: number;
  } | null>(null);
  const [isLoadingRemodel, setIsLoadingRemodel] = useState(false);
  const [remodelTab, setRemodelTab] = useState<'quotes' | 'projects' | 'usage'>('quotes');

  // Editing Sub-states
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newMaterial, setNewMaterial] = useState('');
  const [newGalleryImg, setNewGalleryImg] = useState('');

  const [editingService, setEditingService] = useState<Service | null>(null);
  
  const [editingPost, setEditingPost] = useState<JournalPost | null>(null);
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [newParagraph, setNewParagraph] = useState('');

  const [editingTestimonial, setEditingTestimonial] = useState<ClientExperience | null>(null);
  const [isAddingTestimonial, setIsAddingTestimonial] = useState(false);

  // File Inputs references
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Passcode verification
  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (passcode.toLowerCase() === 'admin' || passcode === 'spacepro2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('spacepro_admin_authed', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid elite security key. Try "admin"');
    }
  };

  const handleQuickBypass = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('spacepro_admin_authed', 'true');
  };

  // Helper for Base64 files
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          callback(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const showTemporaryStatus = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(''), 4000);
  };

  // AI Remodel Studio Admin Handlers
  const fetchRemodelData = async () => {
    setIsLoadingRemodel(true);
    try {
      const res = await fetch('/api/remodel/data');
      if (res.ok) {
        const data = await res.json();
        setRemodelData(data);
      }
    } catch (err) {
      console.error('Failed to fetch remodel data:', err);
    } finally {
      setIsLoadingRemodel(false);
    }
  };

  const handleUpdateRemodelSettings = async (newSettings: any) => {
    try {
      const res = await fetch('/api/remodel/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: newSettings })
      });
      if (res.ok) {
        showTemporaryStatus('AI Remodel configurations saved successfully!');
        fetchRemodelData();
      } else {
        alert('Could not update AI Remodel settings.');
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
      alert('Network failure saving AI Remodel settings.');
    }
  };

  const handleUpdateQuoteStatus = async (quoteId: string, status: string) => {
    try {
      const res = await fetch('/api/remodel/update-quote-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteId, status })
      });
      if (res.ok) {
        showTemporaryStatus(`Quotation status set to ${status}!`);
        fetchRemodelData();
      } else {
        alert('Could not update quotation status.');
      }
    } catch (err) {
      console.error('Failed to update quote status:', err);
      alert('Network failure updating quotation status.');
    }
  };

  useEffect(() => {
    if (activeTab === 'ai-remodel') {
      fetchRemodelData();
    }
  }, [activeTab]);

  // Save changes to Parent
  const saveState = (updated: SiteData) => {
    onUpdateSiteData(updated);
    showTemporaryStatus('Site configuration compiled & synchronized successfully!');
  };

  // BRANDING UPDATES
  const handleBrandingChange = (field: string, value: string) => {
    const updated = { ...siteData };
    if (field === 'logoText') updated.logoText = value;
    if (field === 'logoSubtext') updated.logoSubtext = value;
    if (field === 'logoImage') updated.logoImage = value;
    saveState(updated);
  };

  const handleHeroChange = (field: keyof typeof siteData.hero, value: string) => {
    const updated = {
      ...siteData,
      hero: {
        ...siteData.hero,
        [field]: value
      }
    };
    saveState(updated);
  };

  // PORTFOLIO UPDATES
  const handleSaveProject = (e: FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    const updated = { ...siteData };
    if (isAddingProject) {
      updated.projects = [editingProject, ...updated.projects];
    } else {
      updated.projects = updated.projects.map(p => p.id === editingProject.id ? editingProject : p);
    }

    saveState(updated);
    setEditingProject(null);
    setIsAddingProject(false);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Are you absolutely certain you want to remove this project? This will update the front-end instantly.')) {
      const updated = { ...siteData };
      updated.projects = updated.projects.filter(p => p.id !== id);
      saveState(updated);
    }
  };

  const startAddProject = () => {
    setIsAddingProject(true);
    setEditingProject({
      id: 'project-' + Date.now(),
      title: 'New Luxury Creation',
      location: 'Ikoyi, Lagos',
      category: 'Residential',
      clientName: 'Elite Client',
      year: new Date().getFullYear().toString(),
      description: 'A grand space designed to optimize tranquility and bespoke aesthetic balance.',
      mainImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      beforeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      afterImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [],
      challenges: 'Optimizing high solar exposure and integrating seamless hidden HVAC controls.',
      solutions: 'Installed intelligent glass paneling with premium architectural louvers.',
      materials: ['Carrara Marble', 'Brushed Brass', 'Fluted Oak'],
      clientQuote: 'An extraordinary design from start to finish.'
    });
  };

  // SERVICES UPDATES
  const handleSaveService = (e: FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    const updated = { ...siteData };
    updated.services = updated.services.map(s => s.id === editingService.id ? editingService : s);
    saveState(updated);
    setEditingService(null);
  };

  // JOURNAL UPDATES
  const handleSavePost = (e: FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    const updated = { ...siteData };
    if (isAddingPost) {
      updated.journalPosts = [editingPost, ...updated.journalPosts];
    } else {
      updated.journalPosts = updated.journalPosts.map(p => p.id === editingPost.id ? editingPost : p);
    }

    saveState(updated);
    setEditingPost(null);
    setIsAddingPost(false);
  };

  const handleDeletePost = (id: string) => {
    if (confirm('Delete this journal article? This updates live immediately.')) {
      const updated = { ...siteData };
      updated.journalPosts = updated.journalPosts.filter(p => p.id !== id);
      saveState(updated);
    }
  };

  const startAddPost = () => {
    setIsAddingPost(true);
    setEditingPost({
      id: 'post-' + Date.now(),
      title: 'Designing for the Warm Tropics',
      category: 'Design Inspiration',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      author: 'Design Consultant',
      readTime: '5 min read',
      previewImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
      summary: 'Explore spatial breathing models designed to foster elite cooling and sensory peace.',
      paragraphs: ['Luxury is sensory. In tropical urban landscapes like Lagos, custom airflows combined with light stone floors deliver a profound physical release upon crossing the threshold.']
    });
  };

  // TESTIMONIALS UPDATES
  const handleSaveTestimonial = (e: FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;

    const updated = { ...siteData };
    if (isAddingTestimonial) {
      updated.clientExperiences = [...updated.clientExperiences, editingTestimonial];
    } else {
      updated.clientExperiences = updated.clientExperiences.map(t => t.id === editingTestimonial.id ? editingTestimonial : t);
    }

    saveState(updated);
    setEditingTestimonial(null);
    setIsAddingTestimonial(false);
  };

  const handleDeleteTestimonial = (id: string) => {
    if (confirm('Delete this client story?')) {
      const updated = { ...siteData };
      updated.clientExperiences = updated.clientExperiences.filter(t => t.id !== id);
      saveState(updated);
    }
  };

  const startAddTestimonial = () => {
    setIsAddingTestimonial(true);
    setEditingTestimonial({
      id: 'testimonial-' + Date.now(),
      clientName: 'Alhaji Ibrahim Musa',
      role: 'Investment Director',
      location: 'Ikoyi, Lagos',
      projectTitle: 'The Ivory Residence',
      quote: 'SpacePro provides client services and finishing and luxury management that rivals the best European agencies.',
      transformationSummary: 'A state-of-the-art office structure transformed to support world-class client staging.',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
      achievement: 'Successfully deployed under tight corporate parameters.'
    });
  };

  // STATS UPDATES
  const handleStatChange = (index: number, field: 'value' | 'label', value: string) => {
    const updated = { ...siteData };
    updated.statistics[index] = {
      ...updated.statistics[index],
      [field]: value
    };
    saveState(updated);
  };

  // CONTACT INFO
  const handleContactInfoChange = (field: keyof typeof siteData.contactInfo, value: string) => {
    const updated = {
      ...siteData,
      contactInfo: {
        ...siteData.contactInfo,
        [field]: value
      }
    };
    saveState(updated);
  };

  // EXPORT / IMPORT
  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(siteData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `spacepro_site_settings_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showTemporaryStatus('Settings file compiled & exported successfully!');
  };

  const handleImportData = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && parsed.hero && parsed.projects) {
            onUpdateSiteData(parsed);
            showTemporaryStatus('Custom database settings imported successfully! Site rewritten.');
          } else {
            alert('Invalid database format. Must contain SiteData properties.');
          }
        } catch (err) {
          alert('Failed to parse JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  // REST RESTORE METHOD
  const handleSystemReset = () => {
    if (confirm('Warning: This will restore the entire website layout to its initial premium design templates. All custom updates will be safely overwritten.')) {
      onReset();
      showTemporaryStatus('Website restored to absolute default premium template.');
    }
  };

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-brand-charcoal/80 backdrop-blur-md z-50 flex items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-brand-border/40 max-w-md w-full p-8 md:p-10 shadow-2xl relative"
        >
          {/* Close back */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-brand-charcoal transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="text-center space-y-6">
            <div className="w-14 h-14 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto text-brand-green">
              <Lock className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-display font-medium tracking-tight text-brand-charcoal">SpacePro Private Console</h2>
              <p className="text-xs text-gray-400 font-light max-w-xs mx-auto leading-relaxed">
                Enter your administrative passcode to configure the front-end layouts, imagery, and copywriting indexes.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input 
                  type={showPasscode ? "text" : "password"}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Private Console Access Key"
                  className="w-full bg-brand-gray border border-brand-border text-xs px-4 py-3.5 pr-12 focus:border-brand-green focus:outline-none tracking-widest text-center transition-colors"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-charcoal transition-colors"
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {authError && (
                <div className="text-red-500 text-[11px] bg-red-50 py-2 border border-red-100 font-medium">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-brand-charcoal hover:bg-brand-green text-white text-xs uppercase tracking-widest font-semibold transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>Validate & Access Console</span>
              </button>
            </form>

            <div className="border-t border-brand-border/60 pt-6 space-y-3">
              <p className="text-[10px] text-gray-400">
                To simplify your development testing, we have implemented an immediate quick-bypass.
              </p>
              <button
                onClick={handleQuickBypass}
                className="px-6 py-2 border border-brand-border text-[10px] uppercase tracking-widest text-brand-charcoal hover:bg-brand-gray transition-colors w-full font-medium"
              >
                Immediate Quick Bypass (No Key)
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // MAIN ADMIN CONSOLE LAYOUT
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-hidden flex flex-col font-sans text-left">
      {/* Dynamic Sync bar */}
      <header className="bg-brand-charcoal text-white px-6 sm:px-12 py-4 flex items-center justify-between shrink-0 border-b border-white/5">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-xs uppercase tracking-widest focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Website</span>
          </button>
          <span className="text-white/20 hidden sm:inline">|</span>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-brand-green font-medium uppercase tracking-wider">
            <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse"></span>
            <span>Live Interactive Workspace</span>
          </div>
        </div>

        {/* Brand Console Signature */}
        <div className="flex flex-col text-right">
          <span className="text-sm font-semibold tracking-[0.3em] font-display">SPACEPRO CONSOLE</span>
          <span className="text-[7px] uppercase tracking-[0.55em] text-brand-green -mt-0.5 font-bold">Front-End Content Engine</span>
        </div>
      </header>

      {/* Main Content Body with Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT NAV PANEL */}
        <aside className="w-64 bg-brand-gray border-r border-brand-border flex flex-col justify-between shrink-0 hidden md:flex">
          <div className="p-6 space-y-6">
            <div className="space-y-1.5">
              <h3 className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Workspace Directories</h3>
              <p className="text-[11px] text-gray-500 font-light leading-relaxed">
                All changes reflect dynamically across your main page immediately.
              </p>
            </div>

            <nav className="space-y-1">
              {[
                { id: 'branding', label: 'Hero & Branding', icon: Sparkles },
                { id: 'ai-remodel', label: 'AI Remodel Studio', icon: Sparkles },
                { id: 'portfolio', label: 'Portfolio Works', icon: Layers },
                { id: 'services', label: 'Services Studio', icon: Star },
                { id: 'journal', label: 'Journal Feed', icon: BookOpen },
                { id: 'testimonials', label: 'Testimonials', icon: User },
                { id: 'stats', label: 'Indices & Stats', icon: Maximize2 },
                { id: 'contact', label: 'Coordinates & Desk', icon: MapPin },
                { id: 'system', label: 'System Backup', icon: RefreshCw }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setEditingProject(null);
                      setEditingService(null);
                      setEditingPost(null);
                      setEditingTestimonial(null);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider transition-all border-l-2 focus:outline-none ${
                      activeTab === tab.id 
                        ? 'bg-white border-brand-green text-brand-green font-semibold shadow-2xs' 
                        : 'border-transparent text-gray-400 hover:text-brand-charcoal hover:bg-brand-border/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Backup prompt */}
          <div className="p-6 border-t border-brand-border bg-white/50 space-y-4">
            <div className="flex items-start gap-2 text-[11px] text-gray-500 leading-relaxed font-light">
              <Info className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
              <span>Use the System Backup tab to export your full configurations to JSON at any point!</span>
            </div>
          </div>
        </aside>

        {/* RIGHT EDITING WORKSPACE */}
        <main className="flex-grow bg-white overflow-y-auto p-6 sm:p-12">
          
          {/* Floating Status Notification */}
          <AnimatePresence>
            {saveStatus && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-20 right-12 bg-brand-charcoal text-white text-xs py-3.5 px-6 border border-brand-green shadow-xl z-50 flex items-center gap-3 font-sans"
              >
                <div className="w-4 h-4 rounded-full bg-brand-green/20 border border-brand-green flex items-center justify-center text-brand-green">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span>{saveStatus}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Selector Tab */}
          <div className="md:hidden mb-8">
            <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-bold">Configure Sector</label>
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as any)}
              className="w-full bg-brand-gray border border-brand-border text-xs py-3 px-4 focus:outline-none text-brand-charcoal font-semibold uppercase tracking-wider"
            >
              <option value="branding">Hero & Branding</option>
              <option value="ai-remodel">AI Remodel Studio</option>
              <option value="portfolio">Portfolio Works</option>
              <option value="services">Services Studio</option>
              <option value="journal">Journal Feed</option>
              <option value="testimonials">Testimonials</option>
              <option value="stats">Indices & Stats</option>
              <option value="contact">Coordinates & Desk</option>
              <option value="system">System Backup & Reset</option>
            </select>
          </div>

          {/* TAB CONTENT: BRANDING & HERO */}
          {activeTab === 'branding' && (
            <div className="space-y-10">
              <div className="border-b border-brand-border pb-6 space-y-2 text-left">
                <span className="text-xs uppercase tracking-widest text-brand-green font-bold">Identity & Presence</span>
                <h2 className="text-3xl font-display font-medium text-brand-charcoal">Hero & Brand Alignment</h2>
                <p className="text-xs text-gray-400 font-light leading-relaxed max-w-xl">
                  Configure corporate brand identifiers, logo typography, main marketing statements, and the immersive backdrop banner.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
                {/* Brand Identifiers */}
                <div className="space-y-6">
                  <h3 className="text-xs uppercase tracking-widest text-brand-charcoal font-bold border-b border-brand-border pb-2">1. Logo Brand Headers</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Main Brand Title</label>
                      <input 
                        type="text"
                        value={siteData.logoText}
                        onChange={(e) => handleBrandingChange('logoText', e.target.value)}
                        className="w-full bg-brand-gray border border-brand-border text-xs px-4 py-3 focus:border-brand-green focus:outline-none text-brand-charcoal font-semibold"
                        placeholder="e.g. SPACEPRO"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Secondary Tagline</label>
                      <input 
                        type="text"
                        value={siteData.logoSubtext}
                        onChange={(e) => handleBrandingChange('logoSubtext', e.target.value)}
                        className="w-full bg-brand-gray border border-brand-border text-xs px-4 py-3 focus:border-brand-green focus:outline-none text-brand-charcoal font-semibold"
                        placeholder="e.g. BESPOKE FINISHING"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Optional Graphic Logo (Upload Image/Base64)</label>
                    <div className="flex gap-4 items-center">
                      {siteData.logoImage ? (
                        <div className="w-16 h-16 bg-brand-gray border border-brand-border flex items-center justify-center relative overflow-hidden shrink-0">
                          <img src={siteData.logoImage} className="w-full h-full object-contain" />
                          <button 
                            onClick={() => handleBrandingChange('logoImage', '')}
                            className="absolute inset-0 bg-brand-charcoal/80 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white text-[9px] uppercase font-bold"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-brand-gray border border-brand-border/80 rounded-xs flex items-center justify-center text-gray-300 shrink-0">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <input 
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, (b64) => handleBrandingChange('logoImage', b64))}
                          className="hidden"
                          id="logo-upload-input"
                        />
                        <label 
                          htmlFor="logo-upload-input"
                          className="px-4 py-3 border border-brand-border hover:border-brand-green hover:bg-brand-gray transition-all text-[10px] uppercase tracking-widest font-semibold cursor-pointer inline-flex items-center gap-2"
                        >
                          <Upload className="w-3.5 h-3.5 text-brand-green" />
                          <span>Upload Brand Logo Image</span>
                        </label>
                        <p className="text-[9px] text-gray-400 mt-1.5 font-light">Replaces text header with a sleek graphical logo in navigation.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hero Layout */}
                <div className="space-y-6">
                  <h3 className="text-xs uppercase tracking-widest text-brand-charcoal font-bold border-b border-brand-border pb-2">2. Immersive Hero Statements</h3>
                  
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Bilingual highlight pill</label>
                    <input 
                      type="text"
                      value={siteData.hero.highlightText}
                      onChange={(e) => handleHeroChange('highlightText', e.target.value)}
                      className="w-full bg-brand-gray border border-brand-border text-xs px-4 py-3 focus:border-brand-green focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Display Headline (use \n for line-breaks)</label>
                    <textarea 
                      rows={2}
                      value={siteData.hero.headline}
                      onChange={(e) => handleHeroChange('headline', e.target.value)}
                      className="w-full bg-brand-gray border border-brand-border text-xs px-4 py-3 focus:border-brand-green focus:outline-none font-display font-medium text-lg leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Sub-headline Copy</label>
                    <textarea 
                      rows={3}
                      value={siteData.hero.subheadline}
                      onChange={(e) => handleHeroChange('subheadline', e.target.value)}
                      className="w-full bg-brand-gray border border-brand-border text-xs px-4 py-3 focus:border-brand-green focus:outline-none leading-relaxed"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Cinematic Hero Backdrop Image</label>
                    <div className="flex gap-4 items-center">
                      <div className="w-20 h-14 bg-brand-gray border border-brand-border overflow-hidden shrink-0 relative">
                        <img src={siteData.hero.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <input 
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, (b64) => handleHeroChange('image', b64))}
                          className="hidden"
                          id="hero-img-file"
                        />
                        <div className="flex gap-2">
                          <label 
                            htmlFor="hero-img-file"
                            className="px-3.5 py-2.5 border border-brand-border hover:border-brand-green hover:bg-brand-gray transition-all text-[9px] uppercase tracking-widest font-semibold cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <Upload className="w-3 h-3 text-brand-green" />
                            <span>Upload Image</span>
                          </label>
                          <input 
                            type="text"
                            value={siteData.hero.image.substring(0, 10) === 'data:image' ? '(Uploaded Base64 Graphic)' : siteData.hero.image}
                            onChange={(e) => {
                              if (e.target.value.substring(0, 4) === 'http') {
                                handleHeroChange('image', e.target.value);
                              }
                            }}
                            placeholder="Or input image web URL directly"
                            className="flex-grow bg-brand-gray border border-brand-border text-[10px] px-3 py-2.5 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Cinematic Hero Backdrop Video (Optional - Overrides Image)</label>
                    <div className="flex gap-4 items-center">
                      <div className="w-20 h-14 bg-brand-gray border border-brand-border overflow-hidden shrink-0 relative flex items-center justify-center">
                        {siteData.hero.video ? (
                          <video src={siteData.hero.video} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[9px] text-gray-400 uppercase tracking-widest">No Video</span>
                        )}
                      </div>
                      <div className="flex-grow">
                        <input 
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleImageUpload(e, (b64) => handleHeroChange('video', b64))}
                          className="hidden"
                          id="hero-video-file"
                        />
                        <div className="flex gap-2">
                          <label 
                            htmlFor="hero-video-file"
                            className="px-3.5 py-2.5 border border-brand-border hover:border-brand-green hover:bg-brand-gray transition-all text-[9px] uppercase tracking-widest font-semibold cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <Upload className="w-3 h-3 text-brand-green" />
                            <span>Upload Video</span>
                          </label>
                          <input 
                            type="text"
                            value={siteData.hero.video?.substring(0, 10) === 'data:video' ? '(Uploaded Base64 Video)' : (siteData.hero.video || '')}
                            onChange={(e) => handleHeroChange('video', e.target.value)}
                            placeholder="Or input video loop web URL (MP4, etc.)"
                            className="flex-grow bg-brand-gray border border-brand-border text-[10px] px-3 py-2.5 focus:outline-none"
                          />
                          {siteData.hero.video && (
                            <button
                              type="button"
                              onClick={() => handleHeroChange('video', '')}
                              className="px-3 py-2.5 bg-red-50 text-red-500 hover:bg-red-100 border border-red-200 text-[10px] uppercase tracking-widest font-semibold transition-all cursor-pointer"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        <p className="text-[9px] text-gray-400 mt-1.5 font-light">
                          Supports MP4 or WebM video loops. Click "Clear" to fallback to the static Backdrop Image above.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: AI REMODEL STUDIO */}
          {activeTab === 'ai-remodel' && (
            <div className="space-y-10">
              <div className="border-b border-brand-border pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="text-left space-y-1">
                  <span className="text-xs uppercase tracking-widest text-brand-green font-bold">Spatial Synthesis Engine</span>
                  <h2 className="text-3xl font-display font-medium text-brand-charcoal">AI Remodel Studio Console</h2>
                  <p className="text-xs text-gray-400 font-light max-w-xl">
                    Configure high-end prompt directives, select active design providers, monitor customer usage registries, and evaluate client quotation requests.
                  </p>
                </div>
                <button
                  onClick={fetchRemodelData}
                  disabled={isLoadingRemodel}
                  className="px-4 py-2 bg-brand-gray border border-brand-border hover:bg-brand-charcoal hover:text-white transition-all text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5 self-start sm:self-auto focus:outline-none"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRemodel ? 'animate-spin text-brand-green' : ''}`} />
                  <span>Sync Registry</span>
                </button>
              </div>

              {isLoadingRemodel && !remodelData ? (
                <div className="py-24 text-center space-y-3">
                  <RefreshCw className="w-10 h-10 text-brand-green animate-spin mx-auto" />
                  <p className="text-xs text-gray-400 font-light">Retrieving spatial telemetry and quote records...</p>
                </div>
              ) : !remodelData ? (
                <div className="py-16 text-center border border-dashed border-brand-border rounded-xs space-y-3">
                  <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
                  <p className="text-sm font-semibold">Could not establish contact with the AI Studio telemetry.</p>
                  <button onClick={fetchRemodelData} className="px-4 py-2 bg-brand-charcoal text-white text-xs uppercase tracking-widest font-bold">
                    Retry Synchronization
                  </button>
                </div>
              ) : (
                <div className="space-y-10 font-sans text-brand-charcoal">
                  
                  {/* 1. METRICS ROW */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                    <div className="p-5 bg-brand-gray/30 border border-brand-border rounded-xs">
                      <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Quote Pipeline</span>
                      <div className="text-3xl font-display font-bold text-brand-charcoal">{remodelData.quoteRequests.length}</div>
                      <span className="text-[10px] text-gray-400 font-light">Total Client Requests</span>
                    </div>

                    <div className="p-5 bg-brand-gray/30 border border-brand-border rounded-xs">
                      <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Synthesized Work</span>
                      <div className="text-3xl font-display font-bold text-brand-charcoal">{remodelData.projectsCount}</div>
                      <span className="text-[10px] text-gray-400 font-light">Client Designs Saved</span>
                    </div>

                    <div className="p-5 bg-brand-gray/30 border border-brand-border rounded-xs">
                      <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Model Computations</span>
                      <div className="text-3xl font-display font-bold text-brand-charcoal">{remodelData.usageLogs.length}</div>
                      <span className="text-[10px] text-gray-400 font-light">Total AI Render Runs</span>
                    </div>

                    <div className="p-5 bg-brand-gray/30 border border-brand-border rounded-xs">
                      <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Active Design Core</span>
                      <div className="text-3xl font-display font-bold text-brand-green uppercase tracking-wide">
                        {remodelData.settings.activeProvider}
                      </div>
                      <span className="text-[10px] text-gray-400 font-light">Provider Pipeline</span>
                    </div>
                  </div>

                  {/* 2. DUAL LAYOUT: SETTINGS ON LEFT, REGISTRIES ON RIGHT */}
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 text-left">
                    
                    {/* LEFT 5 COLS: MODEL DIRECTIVE CONTROLS */}
                    <div className="xl:col-span-5 space-y-6">
                      <div className="border-b border-brand-border pb-3">
                        <h3 className="text-xs uppercase tracking-widest text-brand-charcoal font-bold">1. Model Configuration</h3>
                        <p className="text-[11px] text-gray-400 font-light mt-0.5">Adjust client limits, base prompts, and active model providers.</p>
                      </div>

                      {/* Providers selection */}
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1.5 font-bold">Active Design Provider</label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: 'google', name: 'Google Gemini' },
                              { id: 'openai', name: 'OpenAI DALL-E' },
                              { id: 'flux', name: 'FLUX.1 Pro' },
                              { id: 'sdxl', name: 'Stable Diffusion' }
                            ].map((prov) => (
                              <button
                                key={prov.id}
                                type="button"
                                onClick={() => handleUpdateRemodelSettings({ ...remodelData.settings, activeProvider: prov.id })}
                                className={`py-3 px-4 text-[10px] uppercase tracking-wider font-bold border rounded-xs transition-colors focus:outline-none flex flex-col items-center justify-center gap-1 text-center ${
                                  remodelData.settings.activeProvider === prov.id 
                                    ? 'border-brand-green bg-brand-green/10 text-brand-green shadow-xs' 
                                    : 'border-brand-border text-gray-400 hover:text-brand-charcoal hover:bg-brand-gray/30'
                                }`}
                              >
                                <span>{prov.name}</span>
                                <span className="text-[7.5px] uppercase tracking-widest text-gray-400/80 font-normal">
                                  {prov.id === 'google' ? 'Imagen 3' : prov.id === 'openai' ? 'DALL-E 3' : prov.id === 'flux' ? 'FLUX.1 Pro' : 'SDXL 1.0'}
                                </span>
                              </button>
                            ))}
                          </div>
                          
                          {/* Secure API Key integration helpful checklist banner */}
                          <div className="mt-3 p-3 bg-brand-charcoal text-white rounded-xs space-y-1.5 border border-brand-border/40">
                            <span className="text-[9px] uppercase tracking-widest text-brand-green font-bold block">Secure API Keys Integration</span>
                            <p className="text-[10px] text-gray-400 font-light leading-relaxed">
                              Each active provider connects through encrypted server environment variables. Configure the keys in the workspace:
                            </p>
                            <ul className="text-[9.5px] font-mono text-gray-300 space-y-1">
                              <li>• <strong className="text-brand-green">GEMINI_API_KEY</strong> (Google Imagen/Flash)</li>
                              <li>• <strong className="text-brand-green">OPENAI_API_KEY</strong> (OpenAI DALL-E)</li>
                              <li>• <strong className="text-brand-green">FLUX_API_KEY</strong> or <strong className="text-brand-green">REPLICATE_API_TOKEN</strong></li>
                              <li>• <strong className="text-brand-green">STABILITY_API_KEY</strong> or <strong className="text-brand-green">SDXL_API_KEY</strong></li>
                            </ul>
                          </div>
                        </div>

                        {/* Limits selection */}
                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-bold">Session Free Generation Limit</label>
                          <input 
                            type="number"
                            min={1}
                            value={remodelData.settings.generationLimit}
                            onChange={(e) => handleUpdateRemodelSettings({ ...remodelData.settings, generationLimit: parseInt(e.target.value) || 5 })}
                            className="w-full bg-brand-gray border border-brand-border text-xs px-4 py-3 focus:outline-none font-bold text-brand-charcoal rounded-xs"
                          />
                          <p className="text-[10px] text-gray-400 mt-1 font-light leading-relaxed">Protects resource exhaustion by enforcing a limit on guest IP/cookie runs.</p>
                        </div>

                        {/* Prompt Template */}
                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-bold">Model System Prompt Directive</label>
                          <textarea
                            rows={8}
                            value={remodelData.settings.promptTemplate}
                            onChange={(e) => setRemodelData({
                              ...remodelData,
                              settings: { ...remodelData.settings, promptTemplate: e.target.value }
                            })}
                            className="w-full bg-brand-gray border border-brand-border text-xs px-4 py-3.5 focus:outline-none rounded-xs leading-relaxed"
                          />
                          <button
                            onClick={() => handleUpdateRemodelSettings(remodelData.settings)}
                            className="mt-3 w-full py-3 bg-brand-charcoal hover:bg-brand-green text-white text-[10px] uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 rounded-xs"
                          >
                            <Save className="w-3.5 h-3.5 text-brand-green" />
                            <span>Save Provider configurations</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT 7 COLS: DATA REGISTRIES */}
                    <div className="xl:col-span-7 space-y-6">
                      <div className="flex bg-brand-gray p-1 border border-brand-border rounded-xs">
                        {[
                          { id: 'quotes', label: `Quotes (${remodelData.quoteRequests.length})` },
                          { id: 'projects', label: `Projects (${remodelData.projects.length})` },
                          { id: 'usage', label: `Generations (${remodelData.usageLogs.length})` }
                        ].map((rt) => (
                          <button
                            key={rt.id}
                            type="button"
                            onClick={() => setRemodelTab(rt.id as any)}
                            className={`flex-1 py-2 text-xs uppercase tracking-widest font-bold transition-all focus:outline-none ${
                              remodelTab === rt.id 
                                ? 'bg-white text-brand-charcoal shadow-xs border border-brand-border/40' 
                                : 'text-gray-400 hover:text-brand-charcoal'
                            }`}
                          >
                            {rt.label}
                          </button>
                        ))}
                      </div>

                      <div className="space-y-4">
                        
                        {/* REGISTER T1: QUOTE REQUESTS */}
                        {remodelTab === 'quotes' && (
                          <div className="space-y-4">
                            {remodelData.quoteRequests.length === 0 ? (
                              <div className="text-center py-16 border border-brand-border/60 border-dashed rounded-xs text-gray-400">
                                <FileCheck className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                                <div className="text-xs uppercase font-bold tracking-wider">No quote requests compiled</div>
                              </div>
                            ) : (
                              remodelData.quoteRequests.map((req) => (
                                <div key={req.id} className="p-5 border border-brand-border bg-brand-gray/10 rounded-xs space-y-4 text-left">
                                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-brand-border/50 pb-3 gap-3">
                                    <div>
                                      <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400 block">{req.id} • {req.date}</span>
                                      <h4 className="text-xs font-bold text-brand-charcoal">{req.user.name} ({req.user.phone})</h4>
                                      <a href={`mailto:${req.user.email}`} className="text-[11px] text-brand-green hover:underline">{req.user.email}</a>
                                    </div>

                                    {/* Quote pipeline stage selector */}
                                    <div className="flex items-center gap-2">
                                      <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Stage:</span>
                                      <select
                                        value={req.status || 'Pending'}
                                        onChange={(e) => handleUpdateQuoteStatus(req.id, e.target.value)}
                                        className={`text-[10px] uppercase font-bold tracking-wider border py-1.5 px-2 rounded-xs focus:outline-none ${
                                          req.status === 'Completed' ? 'border-brand-green text-brand-green bg-brand-green/10' :
                                          req.status === 'Quoted' ? 'border-blue-300 text-blue-600 bg-blue-50' :
                                          req.status === 'Reviewing' ? 'border-amber-300 text-amber-600 bg-amber-50' :
                                          'border-red-200 text-red-500 bg-red-50'
                                        }`}
                                      >
                                        <option value="Pending">Pending</option>
                                        <option value="Reviewing">Reviewing</option>
                                        <option value="Quoted">Quoted</option>
                                        <option value="Completed">Completed</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                                    <div className="space-y-1">
                                      <div className="text-[9px] uppercase text-gray-400 font-bold leading-none">Parameters Specified</div>
                                      <div className="text-xs text-brand-charcoal leading-relaxed">
                                        <span className="font-bold">{req.details?.area} ({req.details?.category})</span> • <span className="font-light">{req.details?.style}</span> • <span className="text-brand-green font-semibold">{req.details?.budget}</span>
                                      </div>
                                      {req.notes && (
                                        <div className="p-2 border border-brand-border/40 bg-white text-[11px] text-gray-500 italic mt-2 leading-relaxed">
                                          "{req.notes}"
                                        </div>
                                      )}
                                    </div>

                                    {/* Thumbnails original vs generated */}
                                    <div className="flex gap-2">
                                      {req.originalImage && (
                                        <div className="relative aspect-video w-20 border border-brand-border bg-brand-gray overflow-hidden shrink-0 rounded-xs">
                                          <img src={req.originalImage} className="w-full h-full object-cover" />
                                          <span className="absolute left-1 top-1 bg-brand-charcoal/80 text-[7px] uppercase tracking-widest text-white px-1 py-0.5 rounded-xs leading-none scale-90">Original</span>
                                        </div>
                                      )}
                                      {req.generatedImage && (
                                        <div className="relative aspect-video w-20 border border-brand-border bg-brand-gray overflow-hidden shrink-0 rounded-xs">
                                          <img src={req.generatedImage} className="w-full h-full object-cover" />
                                          <span className="absolute left-1 top-1 bg-brand-green text-[7px] uppercase tracking-widest text-white px-1 py-0.5 rounded-xs leading-none scale-90">AI</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}

                        {/* REGISTER T2: SAVED PROJECTS */}
                        {remodelTab === 'projects' && (
                          <div className="space-y-4">
                            {remodelData.projects.length === 0 ? (
                              <div className="text-center py-16 border border-brand-border/60 border-dashed rounded-xs text-gray-400">
                                <Layers className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                                <div className="text-xs uppercase font-bold tracking-wider">No synthesized projects saved</div>
                              </div>
                            ) : (
                              remodelData.projects.map((proj) => (
                                <div key={proj.id} className="p-4 border border-brand-border bg-brand-gray/10 rounded-xs flex items-center gap-4 text-left">
                                  <img src={proj.concepts?.[0]?.imageUrl || proj.originalImage} className="w-16 h-16 object-cover border border-brand-border shrink-0 rounded-xs" />
                                  <div className="space-y-1 overflow-hidden flex-grow">
                                    <span className="text-[8px] uppercase tracking-widest bg-brand-green/10 text-brand-green px-1.5 py-0.5 rounded-full inline-block font-bold">
                                      {proj.category} • {proj.style?.replace('Ultra-', '')}
                                    </span>
                                    <h5 className="text-xs font-bold text-brand-charcoal truncate">{proj.area} Redesign</h5>
                                    <div className="text-[10px] text-gray-400 flex items-center gap-1.5 font-mono">
                                      <span>{proj.date}</span>
                                      <span>•</span>
                                      <span className="text-brand-green">{proj.concepts?.length || 0} Concept{proj.concepts?.length > 1 ? 's' : ''}</span>
                                      <span>•</span>
                                      <span className="text-gray-500 font-sans">{proj.userName || 'Guest Session'}</span>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}

                        {/* REGISTER T3: USAGE LOGS */}
                        {remodelTab === 'usage' && (
                          <div className="bg-brand-gray/20 border border-brand-border rounded-xs overflow-hidden">
                            <table className="w-full text-left text-xs font-sans">
                              <thead className="bg-brand-gray text-[9px] uppercase tracking-widest text-gray-400 font-bold border-b border-brand-border">
                                <tr>
                                  <th className="py-2.5 px-4">Timestamp</th>
                                  <th className="py-2.5 px-4">Provider</th>
                                  <th className="py-2.5 px-4">Category</th>
                                  <th className="py-2.5 px-4">Area</th>
                                  <th className="py-2.5 px-4">Style</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-brand-border/60">
                                {remodelData.usageLogs.slice(0, 30).map((log) => (
                                  <tr key={log.id} className="hover:bg-brand-gray/10">
                                    <td className="py-2 px-4 text-gray-400 font-mono text-[10px]">{new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}</td>
                                    <td className="py-2 px-4 uppercase font-bold text-[10px] text-brand-green">{log.provider}</td>
                                    <td className="py-2 px-4 font-light text-gray-500">{log.category}</td>
                                    <td className="py-2 px-4 font-semibold text-brand-charcoal">{log.area}</td>
                                    <td className="py-2 px-4 font-light text-gray-400 truncate max-w-[120px]">{log.style?.replace('Ultra-', '')}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                      </div>
                    </div>

                  </div>

                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: PORTFOLIO / GALLERY */}
          {activeTab === 'portfolio' && (
            <div className="space-y-10">
              <div className="border-b border-brand-border pb-6 flex items-end justify-between gap-4">
                <div className="text-left space-y-1">
                  <span className="text-xs uppercase tracking-widest text-brand-green font-bold">Sartorial Creations</span>
                  <h2 className="text-3xl font-display font-medium text-brand-charcoal">Portfolio Masterworks</h2>
                  <p className="text-xs text-gray-400 font-light max-w-xl">
                    Manage project publications, location logs, before/after comparative slides, challenges, and bespoke material grids.
                  </p>
                </div>
                {!editingProject && (
                  <button
                    onClick={startAddProject}
                    className="px-5 py-3 bg-brand-green hover:bg-brand-charcoal text-white text-[10px] uppercase tracking-widest font-semibold transition-colors flex items-center gap-2 shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Compile New Work</span>
                  </button>
                )}
              </div>

              {/* LIST VIEW */}
              {!editingProject ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  {siteData.projects.map((project) => (
                    <div 
                      key={project.id}
                      className="border border-brand-border/60 bg-brand-gray/30 p-5 rounded-xs flex gap-5 items-center justify-between hover:border-brand-green transition-all"
                    >
                      <div className="flex gap-4 items-center overflow-hidden">
                        <img 
                          src={project.mainImage} 
                          alt={project.title} 
                          className="w-20 h-20 object-cover shrink-0 rounded-xs border border-brand-border"
                        />
                        <div className="space-y-1 overflow-hidden">
                          <span className="text-[9px] uppercase tracking-widest bg-brand-green/10 text-brand-green font-bold px-2 py-0.5 rounded-full inline-block">
                            {project.category}
                          </span>
                          <h4 className="text-sm font-semibold text-brand-charcoal truncate">{project.title}</h4>
                          <p className="text-[10px] text-gray-400">{project.location} • {project.year}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => setEditingProject(project)}
                          className="p-2.5 bg-white hover:bg-brand-green/10 hover:text-brand-green text-gray-400 border border-brand-border rounded-xs transition-colors"
                          title="Edit Project Details"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-2.5 bg-white hover:bg-red-50 hover:text-red-500 text-gray-400 border border-brand-border rounded-xs transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* EDITING SUB-PANEL */
                <form onSubmit={handleSaveProject} className="bg-brand-gray/40 p-8 border border-brand-border space-y-8 text-left">
                  <div className="flex items-center justify-between border-b border-brand-border pb-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-brand-charcoal">
                      {isAddingProject ? 'Add Project Publication' : `Edit: ${editingProject.title}`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingProject(null)}
                      className="text-xs uppercase tracking-widest text-gray-400 hover:text-brand-charcoal flex items-center gap-1.5 focus:outline-none"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to list</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Project Name</label>
                      <input 
                        type="text" required
                        value={editingProject.title}
                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                        className="w-full bg-white border border-brand-border text-xs px-4 py-3"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Site Location</label>
                      <input 
                        type="text" required
                        value={editingProject.location}
                        onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                        className="w-full bg-white border border-brand-border text-xs px-4 py-3"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Category division</label>
                      <select
                        value={editingProject.category}
                        onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as ProjectCategory })}
                        className="w-full bg-white border border-brand-border text-xs px-4 py-3"
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Elite Client Owner Name</label>
                      <input 
                        type="text" required
                        value={editingProject.clientName}
                        onChange={(e) => setEditingProject({ ...editingProject, clientName: e.target.value })}
                        className="w-full bg-white border border-brand-border text-xs px-4 py-3"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Year Completed</label>
                      <input 
                        type="text" required
                        value={editingProject.year}
                        onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                        className="w-full bg-white border border-brand-border text-xs px-4 py-3"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Client Endorsement Quote</label>
                      <input 
                        type="text" required
                        value={editingProject.clientQuote}
                        onChange={(e) => setEditingProject({ ...editingProject, clientQuote: e.target.value })}
                        className="w-full bg-white border border-brand-border text-xs px-4 py-3"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Main Story description</label>
                    <textarea 
                      rows={3} required
                      value={editingProject.description}
                      onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                      className="w-full bg-white border border-brand-border text-xs px-4 py-3 leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">The Structural Challenges</label>
                      <textarea 
                        rows={2} required
                        value={editingProject.challenges}
                        onChange={(e) => setEditingProject({ ...editingProject, challenges: e.target.value })}
                        className="w-full bg-white border border-brand-border text-xs px-4 py-3 leading-relaxed"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Our Custom Engineering Solutions</label>
                      <textarea 
                        rows={2} required
                        value={editingProject.solutions}
                        onChange={(e) => setEditingProject({ ...editingProject, solutions: e.target.value })}
                        className="w-full bg-white border border-brand-border text-xs px-4 py-3 leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* IMAGES PANEL */}
                  <div className="space-y-4 border-t border-brand-border/60 pt-6">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-brand-charcoal">Visual assets management</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 block">Main Image Showcase</label>
                        <div className="flex gap-2 items-center">
                          <img src={editingProject.mainImage} className="w-14 h-14 object-cover border border-brand-border rounded-xs" />
                          <div className="flex-1">
                            <input 
                              type="file" accept="image/*"
                              onChange={(e) => handleImageUpload(e, (b64) => setEditingProject({ ...editingProject, mainImage: b64 }))}
                              className="hidden" id="p-main-img"
                            />
                            <label htmlFor="p-main-img" className="px-3 py-2 border border-brand-border text-[9px] uppercase tracking-widest cursor-pointer hover:bg-white inline-block">
                              Upload
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 block">Before Space Photo</label>
                        <div className="flex gap-2 items-center">
                          <img src={editingProject.beforeImage} className="w-14 h-14 object-cover border border-brand-border rounded-xs" />
                          <div className="flex-1">
                            <input 
                              type="file" accept="image/*"
                              onChange={(e) => handleImageUpload(e, (b64) => setEditingProject({ ...editingProject, beforeImage: b64 }))}
                              className="hidden" id="p-before-img"
                            />
                            <label htmlFor="p-before-img" className="px-3 py-2 border border-brand-border text-[9px] uppercase tracking-widest cursor-pointer hover:bg-white inline-block">
                              Upload
                            </label>
                          </div>
                        </div>
                        <input 
                          type="text" 
                          value={editingProject.beforeName || ''} 
                          onChange={(e) => setEditingProject({ ...editingProject, beforeName: e.target.value })}
                          placeholder="e.g. Original Raw Site Shell"
                          className="w-full text-xs p-2 bg-white border border-brand-border mt-1"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 block">After Space Photo</label>
                        <div className="flex gap-2 items-center">
                          <img src={editingProject.afterImage} className="w-14 h-14 object-cover border border-brand-border rounded-xs" />
                          <div className="flex-1">
                            <input 
                              type="file" accept="image/*"
                              onChange={(e) => handleImageUpload(e, (b64) => setEditingProject({ ...editingProject, afterImage: b64 }))}
                              className="hidden" id="p-after-img"
                            />
                            <label htmlFor="p-after-img" className="px-3 py-2 border border-brand-border text-[9px] uppercase tracking-widest cursor-pointer hover:bg-white inline-block">
                              Upload
                            </label>
                          </div>
                        </div>
                        <input 
                          type="text" 
                          value={editingProject.afterName || ''} 
                          onChange={(e) => setEditingProject({ ...editingProject, afterName: e.target.value })}
                          placeholder="e.g. Sculpted Obsidian Masterpiece"
                          className="w-full text-xs p-2 bg-white border border-brand-border mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* MATERIALS TAGS */}
                  <div className="space-y-4 border-t border-brand-border/60 pt-6">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-brand-charcoal">Prestige Materials Finishes</h4>
                    
                    <div className="flex flex-wrap gap-2">
                      {editingProject.materials.map((mat, idx) => (
                        <span key={idx} className="bg-white border border-brand-border px-3 py-1.5 text-xs text-brand-charcoal inline-flex items-center gap-1.5">
                          <span>{mat}</span>
                          <button 
                            type="button"
                            onClick={() => setEditingProject({ ...editingProject, materials: editingProject.materials.filter((_, i) => i !== idx) })}
                            className="text-red-400 hover:text-red-600 focus:outline-none"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2 max-w-sm">
                      <input 
                        type="text"
                        placeholder="Add bespoke material, e.g. Carrera Nero"
                        value={newMaterial}
                        onChange={(e) => setNewMaterial(e.target.value)}
                        className="bg-white border border-brand-border text-xs px-3 py-2.5 flex-grow focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newMaterial.trim()) {
                            setEditingProject({
                              ...editingProject,
                              materials: [...editingProject.materials, newMaterial.trim()]
                            });
                            setNewMaterial('');
                          }
                        }}
                        className="px-4 py-2.5 bg-brand-charcoal text-white hover:bg-brand-green text-[10px] uppercase font-bold"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* FORM ACTION DESK */}
                  <div className="border-t border-brand-border/60 pt-6 flex gap-4">
                    <button
                      type="submit"
                      className="px-8 py-3.5 bg-brand-green hover:bg-brand-charcoal text-white text-[10px] uppercase tracking-widest font-semibold transition-colors flex items-center gap-2 shadow-xs"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isAddingProject ? 'Publish Project To Showcase' : 'Save Case Study Changes'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingProject(null)}
                      className="px-8 py-3.5 border border-brand-border text-brand-charcoal hover:bg-white text-[10px] uppercase tracking-widest font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB CONTENT: SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-10">
              <div className="border-b border-brand-border pb-6 space-y-1 text-left">
                <span className="text-xs uppercase tracking-widest text-brand-green font-bold">Aesthetic Operations</span>
                <h2 className="text-3xl font-display font-medium text-brand-charcoal">Signature Divisions</h2>
                <p className="text-xs text-gray-400 font-light max-w-xl">
                  Configure titles, brochures, descriptions, service benefits, and process milestones for the four cornerstone divisions.
                </p>
              </div>

              {!editingService ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  {siteData.services.map((service) => (
                    <div 
                      key={service.id}
                      className="border border-brand-border/60 bg-brand-gray/30 p-6 rounded-xs flex flex-col justify-between hover:border-brand-green transition-all h-[180px]"
                    >
                      <div>
                        <h4 className="text-sm font-semibold text-brand-charcoal uppercase tracking-wider">{service.name}</h4>
                        <p className="text-[11px] text-gray-400 font-light mt-1.5 italic">"{service.title}"</p>
                        <p className="text-xs text-gray-500 font-light line-clamp-2 mt-2 leading-relaxed">{service.tagline}</p>
                      </div>

                      <div className="flex justify-end pt-4">
                        <button
                          onClick={() => setEditingService(service)}
                          className="px-4 py-2 bg-white hover:bg-brand-green/10 hover:text-brand-green text-xs font-semibold uppercase border border-brand-border rounded-xs transition-colors inline-flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Configure Division</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleSaveService} className="bg-brand-gray/40 p-8 border border-brand-border space-y-8 text-left">
                  <div className="flex items-center justify-between border-b border-brand-border pb-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-brand-charcoal">
                      Configure Service: {editingService.name}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingService(null)}
                      className="text-xs uppercase tracking-widest text-gray-400 hover:text-brand-charcoal flex items-center gap-1.5 focus:outline-none"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to list</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Division Name</label>
                      <input 
                        type="text" required
                        value={editingService.name}
                        onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                        className="w-full bg-white border border-brand-border text-xs px-4 py-3"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Aesthetic Tag Title</label>
                      <input 
                        type="text" required
                        value={editingService.title}
                        onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                        className="w-full bg-white border border-brand-border text-xs px-4 py-3"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Short tagline summary</label>
                    <input 
                      type="text" required
                      value={editingService.tagline}
                      onChange={(e) => setEditingService({ ...editingService, tagline: e.target.value })}
                      className="w-full bg-white border border-brand-border text-xs px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">In-Depth Process description</label>
                    <textarea 
                      rows={4} required
                      value={editingService.description}
                      onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                      className="w-full bg-white border border-brand-border text-xs px-4 py-3 leading-relaxed"
                    />
                  </div>

                  {/* BENEFITS / ACCENTS */}
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 block font-medium">Premium Service benefits (One per line)</label>
                    <textarea 
                      rows={4} required
                      value={editingService.benefits.join('\n')}
                      onChange={(e) => setEditingService({ ...editingService, benefits: e.target.value.split('\n').filter(line => line.trim() !== '') })}
                      className="w-full bg-white border border-brand-border text-xs px-4 py-3 leading-relaxed font-mono"
                      placeholder="Benefit 1&#10;Benefit 2&#10;Benefit 3"
                    />
                  </div>

                  <div className="border-t border-brand-border/60 pt-6 flex gap-4">
                    <button
                      type="submit"
                      className="px-8 py-3.5 bg-brand-green hover:bg-brand-charcoal text-white text-[10px] uppercase tracking-widest font-semibold transition-colors flex items-center gap-2 shadow-xs"
                    >
                      <Save className="w-4 h-4" />
                      <span>Synchronize Division Settings</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingService(null)}
                      className="px-8 py-3.5 border border-brand-border text-brand-charcoal hover:bg-white text-[10px] uppercase tracking-widest font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB CONTENT: JOURNAL / CHRONICLES */}
          {activeTab === 'journal' && (
            <div className="space-y-10">
              <div className="border-b border-brand-border pb-6 flex items-end justify-between gap-4 text-left">
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-widest text-brand-green font-bold">Design Chronicles</span>
                  <h2 className="text-3xl font-display font-medium text-brand-charcoal">Journal Publications</h2>
                  <p className="text-xs text-gray-400 font-light max-w-xl">
                    Publish original spatial essays, design guidelines, interior trends, and organic architectural updates to keep pages fresh.
                  </p>
                </div>
                {!editingPost && (
                  <button
                    onClick={startAddPost}
                    className="px-5 py-3 bg-brand-green hover:bg-brand-charcoal text-white text-[10px] uppercase tracking-widest font-semibold transition-colors flex items-center gap-2 shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publish New Article</span>
                  </button>
                )}
              </div>

              {!editingPost ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  {siteData.journalPosts.map((post) => (
                    <div 
                      key={post.id}
                      className="border border-brand-border/60 bg-brand-gray/30 p-5 rounded-xs flex gap-5 items-center justify-between hover:border-brand-green transition-all"
                    >
                      <div className="flex gap-4 items-center overflow-hidden">
                        <img 
                          src={post.previewImage} 
                          alt={post.title} 
                          className="w-16 h-16 object-cover shrink-0 rounded-xs border border-brand-border"
                        />
                        <div className="space-y-1 overflow-hidden">
                          <span className="text-[8.5px] uppercase tracking-widest bg-brand-green/10 text-brand-green font-bold px-2 py-0.5 rounded-full inline-block">
                            {post.category}
                          </span>
                          <h4 className="text-xs font-semibold text-brand-charcoal truncate">{post.title}</h4>
                          <p className="text-[10px] text-gray-400">{post.date} • {post.readTime}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => setEditingPost(post)}
                          className="p-2.5 bg-white hover:bg-brand-green/10 hover:text-brand-green text-gray-400 border border-brand-border rounded-xs transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-2.5 bg-white hover:bg-red-50 hover:text-red-500 text-gray-400 border border-brand-border rounded-xs transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleSavePost} className="bg-brand-gray/40 p-8 border border-brand-border space-y-8 text-left">
                  <div className="flex items-center justify-between border-b border-brand-border pb-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-brand-charcoal">
                      {isAddingPost ? 'Compile New Journal' : `Edit Article: ${editingPost.title}`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingPost(null)}
                      className="text-xs uppercase tracking-widest text-gray-400 hover:text-brand-charcoal flex items-center gap-1.5 focus:outline-none"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to list</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Article Title</label>
                      <input 
                        type="text" required
                        value={editingPost.title}
                        onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                        className="w-full bg-white border border-brand-border text-xs px-4 py-3"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Topic Division</label>
                      <select
                        value={editingPost.category}
                        onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value as JournalCategory })}
                        className="w-full bg-white border border-brand-border text-xs px-4 py-3"
                      >
                        {JOURNAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Author Bylines</label>
                      <input 
                        type="text" required
                        value={editingPost.author}
                        onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                        className="w-full bg-white border border-brand-border text-xs px-4 py-3"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Publishing Date</label>
                      <input 
                        type="text" required
                        value={editingPost.date}
                        onChange={(e) => setEditingPost({ ...editingPost, date: e.target.value })}
                        className="w-full bg-white border border-brand-border text-xs px-4 py-3"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Read Duration Metric</label>
                      <input 
                        type="text" required
                        value={editingPost.readTime}
                        onChange={(e) => setEditingPost({ ...editingPost, readTime: e.target.value })}
                        className="w-full bg-white border border-brand-border text-xs px-4 py-3"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Preview Summary</label>
                    <textarea 
                      rows={2} required
                      value={editingPost.summary}
                      onChange={(e) => setEditingPost({ ...editingPost, summary: e.target.value })}
                      className="w-full bg-white border border-brand-border text-xs px-4 py-3 leading-relaxed"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 block font-medium">Editorial paragraphs (One paragraph per line)</label>
                    <textarea 
                      rows={6} required
                      value={editingPost.paragraphs.join('\n\n')}
                      onChange={(e) => setEditingPost({ ...editingPost, paragraphs: e.target.value.split('\n\n').filter(p => p.trim() !== '') })}
                      className="w-full bg-white border border-brand-border text-xs px-4 py-3 leading-relaxed font-light"
                      placeholder="Paragraph 1...&#10;&#10;Paragraph 2..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Editorial Callout Quote (Optional)</label>
                      <input 
                        type="text"
                        value={editingPost.quote || ''}
                        onChange={(e) => setEditingPost({ ...editingPost, quote: e.target.value })}
                        className="w-full bg-white border border-brand-border text-xs px-4 py-3"
                        placeholder="e.g. Marble is the structural memory..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 block">Preview Image Backdrop</label>
                      <div className="flex gap-2 items-center">
                        <img src={editingPost.previewImage} className="w-14 h-14 object-cover border border-brand-border rounded-xs" />
                        <div className="flex-1">
                          <input 
                            type="file" accept="image/*"
                            onChange={(e) => handleImageUpload(e, (b64) => setEditingPost({ ...editingPost, previewImage: b64 }))}
                            className="hidden" id="post-img"
                          />
                          <label htmlFor="post-img" className="px-3 py-2 border border-brand-border text-[9px] uppercase tracking-widest cursor-pointer hover:bg-white inline-block">
                            Upload Photo
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-brand-border/60 pt-6 flex gap-4">
                    <button
                      type="submit"
                      className="px-8 py-3.5 bg-brand-green hover:bg-brand-charcoal text-white text-[10px] uppercase tracking-widest font-semibold transition-colors flex items-center gap-2 shadow-xs"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isAddingPost ? 'Publish To Journal Feed' : 'Update Journal Article'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingPost(null)}
                      className="px-8 py-3.5 border border-brand-border text-brand-charcoal hover:bg-white text-[10px] uppercase tracking-widest font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB CONTENT: TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-10 text-left">
              <div className="border-b border-brand-border pb-6 flex items-end justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-widest text-brand-green font-bold">Client Praise</span>
                  <h2 className="text-3xl font-display font-medium text-brand-charcoal">Testimonial Records</h2>
                  <p className="text-xs text-gray-400 font-light max-w-xl">
                    Coordinate private client records, review letters of praise, edit achievements, and custom upload client profile photos.
                  </p>
                </div>
                {!editingTestimonial && (
                  <button
                    onClick={startAddTestimonial}
                    className="px-5 py-3 bg-brand-green hover:bg-brand-charcoal text-white text-[10px] uppercase tracking-widest font-semibold transition-colors flex items-center gap-2 shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Compile Testimony</span>
                  </button>
                )}
              </div>

              {!editingTestimonial ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {siteData.clientExperiences.map((exp) => (
                    <div 
                      key={exp.id}
                      className="border border-brand-border/60 bg-brand-gray/30 p-5 rounded-xs flex gap-5 items-center justify-between hover:border-brand-green transition-all"
                    >
                      <div className="flex gap-4 items-center overflow-hidden">
                        <img 
                          src={exp.image} 
                          alt={exp.clientName} 
                          className="w-16 h-16 object-cover shrink-0 rounded-xs border border-brand-border"
                        />
                        <div className="space-y-1 overflow-hidden">
                          <h4 className="text-xs font-semibold text-brand-charcoal truncate">{exp.projectTitle}</h4>
                          <p className="text-[10px] text-gray-400 font-light truncate">{exp.role} • {exp.location}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => setEditingTestimonial(exp)}
                          className="p-2.5 bg-white hover:bg-brand-green/10 hover:text-brand-green text-gray-400 border border-brand-border rounded-xs transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTestimonial(exp.id)}
                          className="p-2.5 bg-white hover:bg-red-50 hover:text-red-500 text-gray-400 border border-brand-border rounded-xs transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleSaveTestimonial} className="bg-brand-gray/40 p-8 border border-brand-border space-y-8">
                  <div className="flex items-center justify-between border-b border-brand-border pb-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-brand-charcoal">
                      {isAddingTestimonial ? 'Log Client Testimony' : `Edit Client Record: ${editingTestimonial.clientName}`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingTestimonial(null)}
                      className="text-xs uppercase tracking-widest text-gray-400 hover:text-brand-charcoal flex items-center gap-1.5 focus:outline-none"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to list</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Client Name</label>
                      <input 
                        type="text" required
                        value={editingTestimonial.clientName}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, clientName: e.target.value })}
                        className="w-full bg-white border border-brand-border text-xs px-4 py-3"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Professional Role / Title</label>
                      <input 
                        type="text" required
                        value={editingTestimonial.role}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                        className="w-full bg-white border border-brand-border text-xs px-4 py-3"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Home Location</label>
                      <input 
                        type="text" required
                        value={editingTestimonial.location}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, location: e.target.value })}
                        className="w-full bg-white border border-brand-border text-xs px-4 py-3"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Associated Masterwork Project</label>
                      <input 
                        type="text" required
                        value={editingTestimonial.projectTitle}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, projectTitle: e.target.value })}
                        className="w-full bg-white border border-brand-border text-xs px-4 py-3"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Key Transformation Achievement</label>
                      <input 
                        type="text" required
                        value={editingTestimonial.achievement}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, achievement: e.target.value })}
                        className="w-full bg-white border border-brand-border text-xs px-4 py-3"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Original Quote Letter</label>
                    <textarea 
                      rows={3} required
                      value={editingTestimonial.quote}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                      className="w-full bg-white border border-brand-border text-xs px-4 py-3 leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Transformation Summary Narrative</label>
                      <textarea 
                        rows={2} required
                        value={editingTestimonial.transformationSummary}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, transformationSummary: e.target.value })}
                        className="w-full bg-white border border-brand-border text-xs px-4 py-3 leading-relaxed"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 block">Client Profile Photo</label>
                      <div className="flex gap-2 items-center">
                        <img src={editingTestimonial.image} className="w-14 h-14 object-cover border border-brand-border rounded-xs" />
                        <div className="flex-1">
                          <input 
                            type="file" accept="image/*"
                            onChange={(e) => handleImageUpload(e, (b64) => setEditingTestimonial({ ...editingTestimonial, image: b64 }))}
                            className="hidden" id="t-img"
                          />
                          <label htmlFor="t-img" className="px-3 py-2 border border-brand-border text-[9px] uppercase tracking-widest cursor-pointer hover:bg-white inline-block">
                            Upload Avatar
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-brand-border/60 pt-6 flex gap-4">
                    <button
                      type="submit"
                      className="px-8 py-3.5 bg-brand-green hover:bg-brand-charcoal text-white text-[10px] uppercase tracking-widest font-semibold transition-colors flex items-center gap-2 shadow-xs"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isAddingTestimonial ? 'Log Record' : 'Save Client Testimony'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingTestimonial(null)}
                      className="px-8 py-3.5 border border-brand-border text-brand-charcoal hover:bg-white text-[10px] uppercase tracking-widest font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB CONTENT: STATS */}
          {activeTab === 'stats' && (
            <div className="space-y-10">
              <div className="border-b border-brand-border pb-6 space-y-1 text-left">
                <span className="text-xs uppercase tracking-widest text-brand-green font-bold">Enterprise Achievements</span>
                <h2 className="text-3xl font-display font-medium text-brand-charcoal">Numerical Indices & Metrics</h2>
                <p className="text-xs text-gray-400 font-light max-w-xl">
                  Update primary figures and descriptions displayed in the black architectural statistics block.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left font-sans">
                {siteData.statistics.map((stat, idx) => (
                  <div key={idx} className="bg-brand-gray/30 border border-brand-border p-6 rounded-xs space-y-4">
                    <span className="text-[10px] uppercase tracking-widest text-brand-green font-bold block">Index Block {idx + 1}</span>
                    
                    <div>
                      <label className="text-[9px] uppercase tracking-widest text-gray-400 block mb-1">Value Metric</label>
                      <input 
                        type="text" required
                        value={stat.value}
                        onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                        className="w-full bg-white border border-brand-border text-lg font-mono px-3 py-2 text-brand-charcoal font-semibold"
                        placeholder="e.g. 120+"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] uppercase tracking-widest text-gray-400 block mb-1">Text Descriptor</label>
                      <input 
                        type="text" required
                        value={stat.label}
                        onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                        className="w-full bg-white border border-brand-border text-xs px-3 py-2 text-gray-500"
                        placeholder="e.g. Delivered Masterpieces"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB CONTENT: CONTACT */}
          {activeTab === 'contact' && (
            <div className="space-y-10">
              <div className="border-b border-brand-border pb-6 space-y-1 text-left">
                <span className="text-xs uppercase tracking-widest text-brand-green font-bold">Physical Locations</span>
                <h2 className="text-3xl font-display font-medium text-brand-charcoal">Coordinates & private Client Desk</h2>
                <p className="text-xs text-gray-400 font-light max-w-xl">
                  Align client concierge hotlines, physical office directions, email routing parameters, and direct secure messaging integrations.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
                
                <div className="space-y-6">
                  <h3 className="text-xs uppercase tracking-widest text-brand-charcoal font-bold border-b border-brand-border pb-2">1. Hotlines & Direct Messages</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Concierge Telephone</label>
                      <input 
                        type="text" required
                        value={siteData.contactInfo.phone}
                        onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                        className="w-full bg-brand-gray border border-brand-border text-xs px-4 py-3"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">WhatsApp Secure Line</label>
                      <input 
                        type="text" required
                        value={siteData.contactInfo.phoneWhatsApp}
                        onChange={(e) => handleContactInfoChange('phoneWhatsApp', e.target.value)}
                        className="w-full bg-brand-gray border border-brand-border text-xs px-4 py-3"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Concierge E-mail</label>
                      <input 
                        type="email" required
                        value={siteData.contactInfo.emailConcierge}
                        onChange={(e) => handleContactInfoChange('emailConcierge', e.target.value)}
                        className="w-full bg-brand-gray border border-brand-border text-xs px-4 py-3"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Procurement E-mail</label>
                      <input 
                        type="email" required
                        value={siteData.contactInfo.emailProcurement}
                        onChange={(e) => handleContactInfoChange('emailProcurement', e.target.value)}
                        className="w-full bg-brand-gray border border-brand-border text-xs px-4 py-3"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xs uppercase tracking-widest text-brand-charcoal font-bold border-b border-brand-border pb-2">2. Office Coordinates</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Physical Address Line 1</label>
                      <input 
                        type="text" required
                        value={siteData.contactInfo.addressLine1}
                        onChange={(e) => handleContactInfoChange('addressLine1', e.target.value)}
                        className="w-full bg-brand-gray border border-brand-border text-xs px-4 py-3"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Physical Address Line 2</label>
                      <input 
                        type="text" required
                        value={siteData.contactInfo.addressLine2}
                        onChange={(e) => handleContactInfoChange('addressLine2', e.target.value)}
                        className="w-full bg-brand-gray border border-brand-border text-xs px-4 py-3"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 block">Map Graphic Coordinates</label>
                    <div className="flex gap-4 items-center">
                      <img src={siteData.contactInfo.mapImage} className="w-16 h-12 object-cover border border-brand-border" />
                      <div className="flex-1">
                        <input 
                          type="file" accept="image/*"
                          onChange={(e) => handleImageUpload(e, (b64) => handleContactInfoChange('mapImage', b64))}
                          className="hidden" id="map-img"
                        />
                        <label htmlFor="map-img" className="px-3 py-2 border border-brand-border text-[9px] uppercase tracking-widest cursor-pointer hover:bg-white inline-block">
                          Upload Custom Map Graphic
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB CONTENT: SYSTEM BACKUP & RESET */}
          {activeTab === 'system' && (
            <div className="space-y-10 text-left">
              <div className="border-b border-brand-border pb-6 space-y-1">
                <span className="text-xs uppercase tracking-widest text-brand-green font-bold">Enterprise Maintenance</span>
                <h2 className="text-3xl font-display font-medium text-brand-charcoal">System Backup & Master Reset</h2>
                <p className="text-xs text-gray-400 font-light max-w-xl">
                  Keep physical offline copies of all modified pages, restore pristine factory setups, or upload previously saved site files instantly.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
                
                {/* BACKUP EXPORT */}
                <div className="bg-brand-gray/30 border border-brand-border p-8 rounded-xs space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-10 h-10 bg-brand-green/10 text-brand-green rounded-full flex items-center justify-center">
                      <Download className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-semibold text-brand-charcoal uppercase tracking-wider">Export Site Layout</h4>
                    <p className="text-xs text-gray-400 font-light leading-relaxed">
                      Compiles and downloads a clean JSON file containing all customized copy, tags, images, blog chronicles, and projects.
                    </p>
                  </div>
                  <button
                    onClick={handleExportData}
                    className="w-full py-3.5 bg-brand-charcoal hover:bg-brand-green text-white text-[10px] uppercase tracking-widest font-bold transition-colors"
                  >
                    Download JSON Config
                  </button>
                </div>

                {/* BACKUP IMPORT */}
                <div className="bg-brand-gray/30 border border-brand-border p-8 rounded-xs space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-semibold text-brand-charcoal uppercase tracking-wider">Import Saved Layout</h4>
                    <p className="text-xs text-gray-400 font-light leading-relaxed">
                      Upload any previously compiled SpacePro JSON configuration file to restore customized environments immediately.
                    </p>
                  </div>
                  
                  <div>
                    <input 
                      type="file" accept=".json"
                      onChange={handleImportData}
                      className="hidden" id="import-json-file"
                    />
                    <label 
                      htmlFor="import-json-file"
                      className="w-full py-3.5 border border-brand-border hover:border-brand-green hover:bg-white text-brand-charcoal text-[10px] uppercase tracking-widest font-bold transition-all text-center block cursor-pointer"
                    >
                      Upload JSON Configuration
                    </label>
                  </div>
                </div>

                {/* FACTORY RESET */}
                <div className="bg-red-50/20 border border-red-100 p-8 rounded-xs space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-semibold text-brand-charcoal uppercase tracking-wider">Master Default Reset</h4>
                    <p className="text-xs text-red-900/60 font-light leading-relaxed">
                      Overwrites all currently cached browser settings and restores the original pre-curated interior layout and portfolio cases.
                    </p>
                  </div>
                  <button
                    onClick={handleSystemReset}
                    className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white text-[10px] uppercase tracking-widest font-bold transition-colors"
                  >
                    Restore Original Template
                  </button>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
