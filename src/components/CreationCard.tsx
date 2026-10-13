import { useState, useEffect, useMemo, useRef, MouseEvent, TouchEvent } from 'react';
import { ChevronLeft, ChevronRight, Images, ArrowUpRight } from 'lucide-react';
import { Project } from '../types';

interface CreationCardProps {
  key?: string | number;
  project: Project;
  cardIndex?: number;
  onSelect: (project: Project) => void;
  className?: string;
  autoPlayInterval?: number;
}

export default function CreationCard({
  project,
  cardIndex = 0,
  onSelect,
  className = '',
  autoPlayInterval
}: CreationCardProps) {
  // Aggregate all unique, high-resolution images for this creation
  const images = useMemo(() => {
    const rawList = [
      project.mainImage,
      ...(project.galleryImages || []),
      project.afterImage
    ];
    // Filter non-empty and remove duplicates while preserving order
    const seen = new Set<string>();
    const result: string[] = [];
    for (const url of rawList) {
      if (url && typeof url === 'string' && !seen.has(url)) {
        seen.add(url);
        result.push(url);
      }
    }
    return result.length > 0 ? result : [project.mainImage || ''];
  }, [project]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto-advance slideshow timer (staggered across cards so they don't slide simultaneously)
  useEffect(() => {
    if (images.length <= 1 || isHovered) return;

    // Use customized interval or stagger by card index (e.g., 3800ms, 4500ms, 5200ms)
    const intervalTime = autoPlayInterval ?? (3800 + (cardIndex % 3) * 700);

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [images.length, isHovered, cardIndex, autoPlayInterval]);

  const prevSlide = (e?: MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextSlide = (e?: MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToSlide = (idx: number, e?: MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex(idx);
  };

  // Touch Swipe Handlers for mobile gestures
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      // Swiped left -> next
      setCurrentIndex((prev) => (prev + 1) % images.length);
    } else if (diff < -45) {
      // Swiped right -> prev
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      onClick={() => onSelect(project)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group cursor-pointer text-left space-y-4 ${className}`}
    >
      {/* Sliding Viewport Container */}
      <div 
        className="relative h-96 w-full overflow-hidden bg-brand-gray border border-brand-border rounded-sm select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Horizontal Moving Sliding Track */}
        <div
          className="flex w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((imgUrl, idx) => (
            <div key={`${project.id}-img-${idx}`} className="w-full h-full shrink-0 relative">
              <img
                src={imgUrl}
                alt={`${project.title} - Showcase perspective ${idx + 1}`}
                className="w-full h-full object-cover select-none pointer-events-none"
                referrerPolicy="no-referrer"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/70 via-brand-charcoal/10 to-transparent pointer-events-none opacity-70 group-hover:opacity-50 transition-opacity duration-300"></div>

        {/* Floating Category Tag (Top Left) */}
        <div className="absolute left-5 top-5 bg-white/95 backdrop-blur-md px-3 py-1 text-[9px] uppercase tracking-widest text-brand-charcoal font-semibold rounded-xs border border-brand-border shadow-xs font-sans z-10 pointer-events-none">
          {project.category}
        </div>

        {/* Multi-Image Counter Pill (Top Right) */}
        {images.length > 1 && (
          <div className="absolute right-5 top-5 flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-white text-[10px] tracking-widest px-2.5 py-1 rounded-full border border-white/15 shadow-sm font-sans z-10 pointer-events-none">
            <Images className="w-3 h-3 text-brand-green" />
            <span className="font-mono font-medium">{currentIndex + 1}/{images.length}</span>
          </div>
        )}

        {/* Interactive Prev & Next Arrows (Revealed on hover / mobile touch) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-brand-green backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 border border-white/20 shadow-md opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 focus:opacity-100"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-brand-green backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 border border-white/20 shadow-md opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 focus:opacity-100"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </>
        )}

        {/* Bottom Elements: Case Study Info & Pagination Dashes */}
        <div className="absolute bottom-5 inset-x-5 flex items-end justify-between z-10 font-sans pointer-events-none">
          {/* Quick Reveal Indicator */}
          <div className="text-white space-y-0.5">
            <span className="text-[10px] uppercase tracking-wider text-brand-green font-semibold block">
              Case Study
            </span>
            <div className="text-xs tracking-wider flex items-center gap-1 font-medium">
              <span>Open Publication</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-brand-green group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Interactive Pagination Dashes */}
          {images.length > 1 && (
            <div className="flex items-center gap-1.5 pointer-events-auto pb-1">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Jump to image ${idx + 1}`}
                  onClick={(e) => goToSlide(idx, e)}
                  className={`h-1.5 rounded-full transition-all duration-300 focus:outline-none ${
                    idx === currentIndex
                      ? 'w-6 bg-brand-green shadow-xs'
                      : 'w-2 bg-white/50 hover:bg-white/90'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Creation Meta Information */}
      <div className="space-y-1 font-sans">
        <h3 className="text-xl font-display text-brand-charcoal group-hover:text-brand-green transition-colors font-medium">
          {project.title}
        </h3>
        <div className="flex justify-between text-xs text-gray-400">
          <span>{project.location}</span>
          <span>{project.year}</span>
        </div>
      </div>
    </div>
  );
}
