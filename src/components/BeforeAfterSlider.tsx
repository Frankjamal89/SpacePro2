import { useState, useRef, useEffect, MouseEvent, TouchEvent } from 'react';
import { 
  Eye, 
  ArrowLeftRight, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  X, 
  Sparkles, 
  MapPin, 
  RotateCcw, 
  Check, 
  Layers
} from 'lucide-react';
import { BeforeAfterPlaceCard, Project } from '../types';
import { BEFORE_AFTER_PLACES } from '../data';

interface BeforeAfterSliderProps {
  title?: string;
  subtitle?: string;
  projects?: Project[];
  placeCards?: BeforeAfterPlaceCard[];
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function BeforeAfterSlider({
  title = "The Magic of Refinement",
  subtitle = "We take bare, raw structural concrete layouts and construct pristine architectural sanctuaries. Select each place card below to experience its metamorphosis.",
  projects,
  placeCards,
  beforeImage: legacyBefore,
  afterImage: legacyAfter,
  beforeLabel: legacyBeforeLabel,
  afterLabel: legacyAfterLabel
}: BeforeAfterSliderProps) {
  // Construct the active list of place cards
  const resolvedPlaces: BeforeAfterPlaceCard[] = (() => {
    if (placeCards && placeCards.length > 0) return placeCards;

    // Start with the curated BEFORE_AFTER_PLACES as base
    const basePlaces = [...BEFORE_AFTER_PLACES];

    // If projects are passed, synchronize images and titles from live projects
    if (projects && projects.length > 0) {
      return basePlaces.map(bp => {
        const matchingProject = projects.find(p => 
          p.id === bp.id.replace('place-', '') || 
          p.title.toLowerCase() === bp.placeName.toLowerCase()
        );
        if (matchingProject) {
          return {
            ...bp,
            placeName: matchingProject.title || bp.placeName,
            location: matchingProject.location || bp.location,
            beforeImage: matchingProject.beforeImage || bp.beforeImage,
            afterImage: matchingProject.afterImage || bp.afterImage,
            beforeName: matchingProject.beforeName || bp.beforeName,
            afterName: matchingProject.afterName || bp.afterName,
            description: matchingProject.description || bp.description
          };
        }
        return bp;
      });
    }

    return basePlaces;
  })();

  const [activeIndex, setActiveIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0 - 100)
  const [isDragging, setIsDragging] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'slider' | 'side-by-side'>('slider');
  const [modalSliderPos, setModalSliderPos] = useState(50);
  const [modalDragging, setModalDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const placeCardsScrollRef = useRef<HTMLDivElement>(null);

  const activePlace: BeforeAfterPlaceCard = resolvedPlaces[activeIndex] || {
    id: 'default',
    placeName: 'The Obsidian Villa',
    location: 'Ikoyi, Lagos',
    category: 'Residential',
    beforeName: legacyBeforeLabel || 'Original Site Shell',
    afterName: legacyAfterLabel || 'Finished SpacePro Masterpiece',
    beforeImage: legacyBefore || "https://cdn.phototourl.com/member/2026-10-12-89eb7df6-58d8-41cd-ba0c-2be4f3d292f3.jpg",
    afterImage: legacyAfter || "https://cdn.phototourl.com/member/2026-10-12-63dd9d02-b986-4cee-b2b9-c5c2e7fed987.jpg",
    description: 'Transforming bare structural shells into timeless architectural sanctuaries.'
  };

  const handleMove = (clientX: number, target: 'main' | 'modal' = 'main') => {
    const ref = target === 'main' ? containerRef.current : modalContainerRef.current;
    if (!ref) return;
    const rect = ref.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    if (target === 'main') {
      setSliderPosition(percentage);
    } else {
      setModalSliderPos(percentage);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX, 'main');
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX, 'main');
    }
  };

  const handleModalMouseMove = (e: MouseEvent) => {
    if (!modalDragging) return;
    handleMove(e.clientX, 'modal');
  };

  const handleModalTouchMove = (e: TouchEvent) => {
    if (!modalDragging) return;
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX, 'modal');
    }
  };

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
      setModalDragging(false);
    };
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  const handlePrevPlace = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : resolvedPlaces.length - 1));
    setSliderPosition(50);
  };

  const handleNextPlace = () => {
    setActiveIndex((prev) => (prev < resolvedPlaces.length - 1 ? prev + 1 : 0));
    setSliderPosition(50);
  };

  const handleSelectPlace = (index: number) => {
    setActiveIndex(index);
    setSliderPosition(50);
    // Smooth scroll the selected place card into view
    if (placeCardsScrollRef.current) {
      const cards = placeCardsScrollRef.current.children;
      if (cards[index]) {
        (cards[index] as HTMLElement).scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      }
    }
  };

  return (
    <div id="before-after-section" className="w-full bg-brand-gray py-20 px-4 sm:px-8 md:px-16 lg:px-24 border-y border-brand-border">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
              <span className="text-xs uppercase tracking-[0.3em] text-brand-green font-medium">
                Before & After Transformations
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display text-brand-charcoal tracking-tight font-medium">
              {title}
            </h2>
          </div>
          <div className="max-w-md mt-4 md:mt-0">
            <p className="text-sm font-light text-gray-500 leading-relaxed font-sans">
              {subtitle}
            </p>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 font-sans">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gray-400"></span> Raw Site Layout
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-green"></span> SpacePro Finished Masterpiece
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PLACE CARDS SELECTOR (Horizontal interactive deck of place cards) */}
        {/* ========================================================================= */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-green" />
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-brand-charcoal">
                Select Place Card ({resolvedPlaces.length} Distinct Locations)
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevPlace}
                className="w-8 h-8 rounded-full border border-brand-border bg-white text-brand-charcoal hover:bg-brand-green hover:text-white transition-colors flex items-center justify-center shadow-xs cursor-pointer"
                aria-label="Previous place card"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextPlace}
                className="w-8 h-8 rounded-full border border-brand-border bg-white text-brand-charcoal hover:bg-brand-green hover:text-white transition-colors flex items-center justify-center shadow-xs cursor-pointer"
                aria-label="Next place card"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Place Cards Scrollable Rail */}
          <div 
            ref={placeCardsScrollRef}
            className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {resolvedPlaces.map((place, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => handleSelectPlace(idx)}
                  className={`flex-shrink-0 w-[280px] sm:w-[320px] text-left p-4 rounded-sm border transition-all duration-300 cursor-pointer snap-start relative group flex flex-col justify-between ${
                    isActive 
                      ? 'bg-white border-brand-green shadow-lg ring-2 ring-brand-green/20' 
                      : 'bg-white/80 hover:bg-white border-brand-border hover:border-gray-300 shadow-xs'
                  }`}
                >
                  {/* Active Indicator Top Tag */}
                  <div className="flex items-center justify-between mb-3 w-full">
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-xs bg-brand-gray text-gray-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-brand-green" />
                      {place.location}
                    </span>
                    {isActive ? (
                      <span className="text-[10px] uppercase tracking-wider font-medium text-brand-green flex items-center gap-1 bg-brand-green/10 px-2 py-0.5 rounded-xs">
                        <Check className="w-3 h-3 text-brand-green" /> Active Place
                      </span>
                    ) : (
                      <span className="text-[10px] tracking-wider text-gray-400 group-hover:text-brand-green transition-colors">
                        Place Card #{idx + 1}
                      </span>
                    )}
                  </div>

                  {/* Dual Thumbnail Preview */}
                  <div className="relative w-full h-24 overflow-hidden rounded-xs mb-3 border border-brand-border/60 flex bg-brand-charcoal">
                    {/* Before Half */}
                    <div className="relative w-1/2 h-full overflow-hidden border-r border-white/20">
                      <img 
                        src={place.beforeImage} 
                        alt={`Before: ${place.beforeName}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-1 left-1 bg-black/75 backdrop-blur-xs text-[8px] uppercase tracking-wider text-white px-1.5 py-0.5 rounded-2xs">
                        Before
                      </span>
                    </div>
                    {/* After Half */}
                    <div className="relative w-1/2 h-full overflow-hidden">
                      <img 
                        src={place.afterImage} 
                        alt={`After: ${place.afterName}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-1 right-1 bg-brand-green/90 backdrop-blur-xs text-[8px] uppercase tracking-wider text-white px-1.5 py-0.5 rounded-2xs">
                        After
                      </span>
                    </div>
                  </div>

                  {/* Place Name */}
                  <div className="mb-2">
                    <h4 className={`text-base font-display font-medium leading-snug tracking-tight ${
                      isActive ? 'text-brand-charcoal font-semibold' : 'text-gray-800'
                    }`}>
                      {place.placeName}
                    </h4>
                  </div>

                  {/* Names of the Before & After */}
                  <div className="mt-auto pt-2 border-t border-brand-border/60 text-[11px] space-y-1.5 font-sans">
                    <div className="flex items-start gap-1.5 text-gray-500">
                      <span className="font-semibold text-gray-600 flex-shrink-0">Before:</span>
                      <span className="truncate text-gray-600" title={place.beforeName}>{place.beforeName}</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-brand-green font-medium">
                      <span className="font-semibold flex-shrink-0">After:</span>
                      <span className="truncate text-brand-green" title={place.afterName}>{place.afterName}</span>
                    </div>
                  </div>

                  {/* Active bottom line */}
                  <div className={`mt-3 pt-2 text-[10px] uppercase tracking-wider font-semibold flex items-center justify-between ${
                    isActive ? 'text-brand-green' : 'text-gray-400 group-hover:text-brand-charcoal'
                  }`}>
                    <span>{isActive ? 'Currently In View' : 'Click to View Slider'}</span>
                    <ArrowLeftRight className="w-3 h-3" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN INTERACTIVE SLIDER STAGE (For the currently selected Place Card) */}
        {/* ========================================================================= */}
        <div id="interactive-slider-stage" className="bg-white p-6 sm:p-8 md:p-10 rounded-sm border border-brand-border shadow-md">
          
          {/* Active Place Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-brand-border gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase tracking-widest text-brand-green font-bold bg-brand-green/10 px-2 py-0.5 rounded-xs">
                  Active Place Card: #{activeIndex + 1} of {resolvedPlaces.length}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500 font-sans flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-brand-green" />
                  {activePlace.location}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-medium text-brand-charcoal tracking-tight">
                {activePlace.placeName}
              </h3>
              {activePlace.description && (
                <p className="text-xs text-gray-500 font-sans mt-1 max-w-2xl leading-relaxed">
                  {activePlace.description}
                </p>
              )}
            </div>

            {/* Quick Actions & Navigation */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <button
                type="button"
                onClick={handlePrevPlace}
                className="px-3 py-2 text-xs font-sans border border-brand-border rounded-xs bg-brand-gray hover:bg-white text-brand-charcoal flex items-center gap-1.5 transition-colors cursor-pointer"
                title="View previous place card"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Prev Place</span>
              </button>
              <button
                type="button"
                onClick={handleNextPlace}
                className="px-3 py-2 text-xs font-sans border border-brand-border rounded-xs bg-brand-gray hover:bg-white text-brand-charcoal flex items-center gap-1.5 transition-colors cursor-pointer"
                title="View next place card"
              >
                <span className="hidden sm:inline">Next Place</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-3.5 py-2 text-xs font-sans bg-brand-charcoal text-white hover:bg-brand-green rounded-xs flex items-center gap-2 transition-colors shadow-xs cursor-pointer ml-1"
                title="View full-screen transformation"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Enlarge</span>
              </button>
            </div>
          </div>

          {/* Place Name and Before/After Badges Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 bg-brand-gray/80 p-3 sm:p-4 rounded-xs border border-brand-border/60">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0"></span>
              <div className="text-xs font-sans">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium block">
                  Original Site State
                </span>
                <span className="text-brand-charcoal font-semibold">
                  {activePlace.beforeName}
                </span>
              </div>
            </div>
            <div className="flex items-center sm:justify-end gap-2.5">
              <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse flex-shrink-0"></span>
              <div className="text-xs font-sans sm:text-right">
                <span className="text-[10px] uppercase tracking-wider text-brand-green font-medium block">
                  SpacePro Refinement
                </span>
                <span className="text-brand-charcoal font-semibold">
                  {activePlace.afterName}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Dual-Image Canvas Container */}
          <div className="flex justify-center w-full">
            <div 
              id="slider-container"
              ref={containerRef}
              onMouseDown={() => setIsDragging(true)}
              onTouchStart={() => setIsDragging(true)}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              className="relative w-full max-w-[840px] aspect-[16/10] sm:aspect-[16/9] overflow-hidden shadow-2xl rounded-xs cursor-ew-resize select-none border border-brand-border group bg-brand-charcoal"
            >
              {/* AFTER IMAGE (Background - Full Layer) */}
              <img 
                id="after-image"
                src={activePlace.afterImage} 
                alt={`SpacePro Refined: ${activePlace.afterName}`} 
                className="absolute inset-0 h-full w-full object-cover pointer-events-none transition-opacity duration-300"
                referrerPolicy="no-referrer"
              />
              
              {/* After Place Card Floating Badge */}
              <div className="absolute right-3 sm:right-6 top-3 sm:top-6 bg-brand-charcoal/85 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-[11px] uppercase tracking-wider text-white rounded-xs z-20 font-sans border border-white/10 flex items-center gap-2 shadow-lg max-w-[45%] truncate">
                <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse flex-shrink-0"></span>
                <span className="truncate">AFTER: {activePlace.afterName}</span>
              </div>

              {/* BEFORE IMAGE (Foreground - Clipped via clipPath) */}
              <div 
                id="before-image-clip"
                className="absolute inset-0 h-full w-full pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                <img 
                  src={activePlace.beforeImage} 
                  alt={`Before Refinement: ${activePlace.beforeName}`} 
                  className="absolute inset-0 h-full w-full object-cover pointer-events-none"
                  referrerPolicy="no-referrer"
                />
                
                {/* Before Place Card Floating Badge */}
                <div className="absolute left-3 sm:left-6 top-3 sm:top-6 bg-brand-charcoal/85 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-[11px] uppercase tracking-wider text-white rounded-xs z-20 font-sans border border-white/10 shadow-lg max-w-[45%] truncate">
                  <span className="truncate">BEFORE: {activePlace.beforeName}</span>
                </div>
              </div>

              {/* SLIDER SEPARATOR BAR */}
              <div 
                id="slider-separator"
                className="absolute top-0 bottom-0 w-[2px] bg-brand-green cursor-ew-resize z-30 transition-colors pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                {/* Center Drag Knob */}
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white border-2 border-brand-green rounded-full shadow-2xl flex items-center justify-center z-40 transition-transform group-hover:scale-110 active:scale-95 duration-200 pointer-events-auto">
                  <ArrowLeftRight className="w-4 h-4 text-brand-green" />
                </div>
                
                {/* Soft pulse halos */}
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-16 h-16 sm:w-20 sm:h-20 bg-brand-green/15 rounded-full -z-10 animate-ping pointer-events-none"></div>
              </div>

              {/* Hover Instruction Overlay */}
              <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 bg-brand-charcoal/90 backdrop-blur-md px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-[11px] sm:text-xs text-white tracking-wider flex items-center gap-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl border border-white/10 whitespace-nowrap">
                <Eye className="w-3.5 h-3.5 text-brand-green" />
                <span>Drag separator to reveal {activePlace.placeName} transformation</span>
              </div>
            </div>
          </div>

          {/* Quick Slider Ratio Shortcuts */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-5 border-t border-brand-border/70 text-xs font-sans">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold mr-1">
                Quick View:
              </span>
              <button
                type="button"
                onClick={() => setSliderPosition(100)}
                className={`px-3 py-1.5 rounded-xs border transition-colors cursor-pointer text-xs ${
                  sliderPosition === 100 
                    ? 'bg-brand-charcoal text-white border-brand-charcoal font-medium' 
                    : 'bg-white hover:bg-gray-100 text-gray-600 border-brand-border'
                }`}
              >
                100% Before ({activePlace.beforeName.split(' ')[0]})
              </button>
              <button
                type="button"
                onClick={() => setSliderPosition(50)}
                className={`px-3 py-1.5 rounded-xs border transition-colors cursor-pointer text-xs flex items-center gap-1 ${
                  sliderPosition === 50 
                    ? 'bg-brand-green text-white border-brand-green font-medium' 
                    : 'bg-white hover:bg-gray-100 text-gray-600 border-brand-border'
                }`}
              >
                <RotateCcw className="w-3 h-3" />
                50 / 50 Split
              </button>
              <button
                type="button"
                onClick={() => setSliderPosition(0)}
                className={`px-3 py-1.5 rounded-xs border transition-colors cursor-pointer text-xs ${
                  sliderPosition === 0 
                    ? 'bg-brand-charcoal text-white border-brand-charcoal font-medium' 
                    : 'bg-white hover:bg-gray-100 text-gray-600 border-brand-border'
                }`}
              >
                100% After ({activePlace.afterName.split(' ')[0]})
              </button>
            </div>

            <div className="text-[11px] text-gray-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-green" />
              <span>Drag handle horizontally or click preset buttons</span>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* FULL-SCREEN EXPANDED MODAL (For High-Res Before & After Inspection) */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 md:p-8 animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between text-white pb-4 border-b border-white/10 max-w-7xl mx-auto w-full">
            <div>
              <div className="flex items-center gap-2 text-xs text-brand-green uppercase tracking-widest font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Place Card #{activeIndex + 1}: {activePlace.placeName}</span>
                <span className="text-white/40">•</span>
                <span className="text-white/70 font-normal">{activePlace.location}</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-display font-medium text-white tracking-tight mt-0.5">
                {activePlace.beforeName} <span className="text-brand-green">→</span> {activePlace.afterName}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center bg-white/10 p-0.5 rounded-xs border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setModalMode('slider')}
                  className={`px-3 py-1.5 rounded-2xs transition-colors cursor-pointer ${
                    modalMode === 'slider' ? 'bg-brand-green text-white font-medium' : 'text-white/70 hover:text-white'
                  }`}
                >
                  Interactive Slider
                </button>
                <button
                  type="button"
                  onClick={() => setModalMode('side-by-side')}
                  className={`px-3 py-1.5 rounded-2xs transition-colors cursor-pointer ${
                    modalMode === 'side-by-side' ? 'bg-brand-green text-white font-medium' : 'text-white/70 hover:text-white'
                  }`}
                >
                  Side by Side
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Content Stage */}
          <div className="flex-1 flex items-center justify-center py-4 max-w-7xl mx-auto w-full overflow-hidden">
            {modalMode === 'slider' ? (
              <div 
                ref={modalContainerRef}
                onMouseDown={() => setModalDragging(true)}
                onTouchStart={() => setModalDragging(true)}
                onMouseMove={handleModalMouseMove}
                onTouchMove={handleModalTouchMove}
                className="relative w-full max-w-5xl h-[65vh] max-h-[750px] overflow-hidden rounded-xs cursor-ew-resize select-none border border-white/20 bg-brand-charcoal shadow-2xl"
              >
                {/* Modal After */}
                <img 
                  src={activePlace.afterImage} 
                  alt={activePlace.afterName} 
                  className="absolute inset-0 h-full w-full object-contain pointer-events-none"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute right-4 top-4 bg-black/80 backdrop-blur-md px-3.5 py-1.5 text-xs uppercase tracking-wider text-white rounded-xs z-20 font-sans border border-white/20 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
                  <span>AFTER: {activePlace.afterName}</span>
                </div>

                {/* Modal Before */}
                <div 
                  className="absolute inset-0 h-full w-full pointer-events-none"
                  style={{ clipPath: `inset(0 ${100 - modalSliderPos}% 0 0)` }}
                >
                  <img 
                    src={activePlace.beforeImage} 
                    alt={activePlace.beforeName} 
                    className="absolute inset-0 h-full w-full object-contain pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute left-4 top-4 bg-black/80 backdrop-blur-md px-3.5 py-1.5 text-xs uppercase tracking-wider text-white rounded-xs z-20 font-sans border border-white/20">
                    <span>BEFORE: {activePlace.beforeName}</span>
                  </div>
                </div>

                {/* Modal Separator */}
                <div 
                  className="absolute top-0 bottom-0 w-[2px] bg-brand-green z-30 pointer-events-none"
                  style={{ left: `${modalSliderPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 bg-white border border-brand-green rounded-full shadow-2xl flex items-center justify-center z-40 pointer-events-auto">
                    <ArrowLeftRight className="w-4 h-4 text-brand-green" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-6xl h-[65vh] max-h-[750px]">
                {/* Full Before */}
                <div className="relative h-full rounded-xs overflow-hidden border border-white/20 bg-black/50 flex flex-col">
                  <div className="p-3 bg-white/5 border-b border-white/10 flex items-center justify-between text-xs text-white">
                    <span className="font-semibold text-gray-400">ORIGINAL SITE SHELL</span>
                    <span className="truncate max-w-[200px] text-white/80">{activePlace.beforeName}</span>
                  </div>
                  <div className="flex-1 relative">
                    <img 
                      src={activePlace.beforeImage} 
                      alt={activePlace.beforeName} 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {/* Full After */}
                <div className="relative h-full rounded-xs overflow-hidden border border-brand-green/40 bg-black/50 flex flex-col">
                  <div className="p-3 bg-brand-green/10 border-b border-brand-green/20 flex items-center justify-between text-xs text-white">
                    <span className="font-semibold text-brand-green">REFINED COMPLETION</span>
                    <span className="truncate max-w-[200px] text-white">{activePlace.afterName}</span>
                  </div>
                  <div className="flex-1 relative">
                    <img 
                      src={activePlace.afterImage} 
                      alt={activePlace.afterName} 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Place Selector */}
          <div className="max-w-7xl mx-auto w-full pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-white/80">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
              <span className="text-white/40 uppercase tracking-widest text-[10px] mr-1">Switch Place:</span>
              {resolvedPlaces.map((p, i) => (
                <button
                  key={`modal-tab-${p.id}`}
                  type="button"
                  onClick={() => {
                    setActiveIndex(i);
                    setModalSliderPos(50);
                  }}
                  className={`px-3 py-1.5 rounded-xs text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    i === activeIndex 
                      ? 'bg-brand-green text-white' 
                      : 'bg-white/10 hover:bg-white/20 text-white/80'
                  }`}
                >
                  {p.placeName}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevPlace}
                className="px-3 py-1.5 rounded-xs bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>
              <button
                type="button"
                onClick={handleNextPlace}
                className="px-3 py-1.5 rounded-xs bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 cursor-pointer"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
