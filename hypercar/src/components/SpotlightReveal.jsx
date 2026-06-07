import React, { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function SpotlightReveal({ onHoverChange }) {
  const containerRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const mx = useMotionValue(-999);
  const my = useMotionValue(-999);
  const sx = useSpring(mx, { stiffness: 130, damping: 22 });
  const sy = useSpring(my, { stiffness: 130, damping: 22 });

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  }, [mx, my]);

  const handleEnter = () => {
    setIsHovering(true);
    onHoverChange(true);
  };

  const handleLeave = () => {
    setIsHovering(false);
    onHoverChange(false);
    mx.set(-999);
    my.set(-999);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ position: 'absolute', inset: 0, zIndex: 5 }}
    >
      {/* Static car image */}
      <img
        src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1600&q=85&fit=crop"
        alt=""
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          opacity: 0.72,
          zIndex: 1,
          transition: 'opacity 0.5s ease',
          pointerEvents: 'none',
        }}
        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=85&fit=crop'; }}
      />

      {/* Video layer — revealed by spotlight */}
      <motion.div
        style={{
          position: 'absolute', inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          opacity: isHovering ? 1 : 0,
          transition: 'opacity 0.7s ease',
          WebkitMaskImage: isHovering
            ? `radial-gradient(circle 200px at ${sx.get()}px ${sy.get()}px, black 0%, transparent 100%)`
            : 'none',
          maskImage: isHovering
            ? `radial-gradient(circle 200px at ${sx.get()}px ${sy.get()}px, black 0%, transparent 100%)`
            : 'none',
        }}
      >
        <video
          autoPlay muted loop playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          src="https://cdn.coverr.co/videos/coverr-a-red-ferrari-on-a-highway-at-night-5063/1080p.mp4"
        />
      </motion.div>

      {/* CSS-driven mask (more performant approach) */}
      <motion.div
        style={{
          position: 'absolute', inset: 0,
          zIndex: 3,
          pointerEvents: 'none',
          background: `radial-gradient(circle 190px at ${sx.get()}px ${sy.get()}px, transparent 0%, rgba(0,0,0,0.88) 100%)`,
          opacity: isHovering ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      />

      {/* Spotlight glow ring */}
      <motion.div
        style={{
          position: 'absolute',
          width: 380,
          height: 380,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 6,
          x: sx,
          y: sy,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isHovering ? 1 : 0,
          transition: 'opacity 0.4s',
          background: 'radial-gradient(circle, rgba(255,59,0,0.12) 0%, rgba(255,100,0,0.05) 40%, transparent 70%)',
          boxShadow: 'inset 0 0 40px rgba(255,59,0,0.08)',
        }}
      />

      {/* Hover hint */}
      <motion.div
        animate={{ opacity: isHovering ? 0 : [0.3, 0.7, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          bottom: 90,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 8,
          fontFamily: 'var(--font-display)',
          fontSize: 8,
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        ▶ &nbsp; HOVER TO IGNITE
      </motion.div>
    </div>
  );
}
