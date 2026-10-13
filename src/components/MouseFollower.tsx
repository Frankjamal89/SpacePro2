import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function MouseFollower() {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverText, setHoverText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  // Position motion values for fluid high-performance tracking
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring animations to create a luxurious lagging "follower" effect
  const springConfig = { stiffness: 220, damping: 28, mass: 0.6 };
  const followerX = useSpring(cursorX, springConfig);
  const followerY = useSpring(cursorY, springConfig);

  // Toggle body class to hide/show default cursor
  useEffect(() => {
    if (isVisible && !isTouchDevice) {
      document.body.classList.add('custom-cursor-active');
    } else {
      document.body.classList.remove('custom-cursor-active');
    }
    return () => {
      document.body.classList.remove('custom-cursor-active');
    };
  }, [isVisible, isTouchDevice]);

  useEffect(() => {
    // 1. Detect if the user is on a touch device
    const checkTouch = () => {
      const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouchDevice(coarsePointer || hasTouch);
    };

    checkTouch();
    window.addEventListener('resize', checkTouch);

    // 2. Event Handlers for pointer tracking
    const handlePointerMove = (e: PointerEvent) => {
      // If we detect physical mouse interaction, immediately unlock custom cursor
      if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
        setIsTouchDevice(false);
      } else if (e.pointerType === 'touch') {
        setIsTouchDevice(true);
        return;
      }
      
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handlePointerLeave = () => {
      setIsVisible(false);
    };

    const handlePointerEnter = () => {
      setIsVisible(true);
    };

    // 3. Dynamic Hover State Detection (Clickable / Special areas)
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Detect links, buttons, form elements, before-after slider elements, and anything marked interactive
      const interactive = target.closest('a, button, [role="button"], input, select, textarea, [data-cursor], .slider-handle, .case-study-card');
      
      if (interactive) {
        setIsHovered(true);
        // Look for custom text indicators, e.g. <div data-cursor="drag"> or <a data-cursor="view">
        const text = interactive.getAttribute('data-cursor');
        if (text) {
          setHoverText(text);
        } else if (interactive.classList.contains('slider-handle') || interactive.closest('.before-after-container')) {
          setHoverText('DRAG');
        } else if (interactive.classList.contains('case-study-card') || interactive.closest('.case-study-card')) {
          setHoverText('VIEW');
        } else {
          setHoverText('');
        }
      } else {
        setIsHovered(false);
        setHoverText('');
      }
    };

    // Bind event listeners
    window.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('mouseleave', handlePointerLeave);
    document.addEventListener('mouseenter', handlePointerEnter);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('resize', checkTouch);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      document.removeEventListener('mouseenter', handlePointerEnter);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

  // If mobile/tablet or touch pointer, don't render custom cursor to ensure a pristine mobile UX
  if (isTouchDevice) return null;

  return (
    <>
      {/* 1. Precise Core Point (Instant Tracking) */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-brand-green rounded-full pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isVisible ? (isHovered ? 0.5 : 1) : 0,
          opacity: isVisible ? 1 : 0
        }}
        transition={{ duration: 0.15 }}
      />

      {/* 2. Fluid Spring Follower Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-brand-green/40 pointer-events-none z-[9998] flex items-center justify-center bg-transparent overflow-hidden"
        style={{
          x: followerX,
          y: followerY,
          translateX: '-50%',
          translateY: '-50%',
          width: isHovered ? (hoverText ? 64 : 48) : 28,
          height: isHovered ? (hoverText ? 64 : 48) : 28,
        }}
        animate={{
          borderColor: isHovered ? 'rgba(31, 139, 90, 0.85)' : 'rgba(31, 139, 90, 0.35)',
          backgroundColor: isHovered ? 'rgba(31, 139, 90, 0.05)' : 'rgba(31, 139, 90, 0)',
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.4
        }}
        transition={{
          width: { type: 'spring', stiffness: 200, damping: 22 },
          height: { type: 'spring', stiffness: 200, damping: 22 },
          opacity: { duration: 0.2 },
          scale: { duration: 0.2 },
          borderColor: { duration: 0.2 },
          backgroundColor: { duration: 0.2 }
        }}
      >
        {/* Micro text inside the expanded ring (e.g. DRAG, VIEW, OPEN) */}
        {hoverText && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-[8px] font-sans font-semibold tracking-[0.15em] text-brand-green leading-none"
          >
            {hoverText}
          </motion.span>
        )}
      </motion.div>
    </>
  );
}
