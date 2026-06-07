import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function Cursor() {
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const trailX = useSpring(mx, { stiffness: 120, damping: 22 });
  const trailY = useSpring(my, { stiffness: 120, damping: 22 });
  const hovered = useRef(false);
  const scaleSpring = useSpring(1, { stiffness: 200, damping: 20 });

  useEffect(() => {
    const move = (e) => { mx.set(e.clientX); my.set(e.clientY); };
    const enter = () => { hovered.current = true; scaleSpring.set(1.6); };
    const leave = () => { hovered.current = false; scaleSpring.set(1); };

    window.addEventListener('mousemove', move);
    document.querySelectorAll('button, a, [data-hover]').forEach(el => {
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave);
    });
    return () => window.removeEventListener('mousemove', move);
  }, [mx, my, scaleSpring]);

  return (
    <>
      {/* dot */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0, left: 0,
          x: mx, y: my,
          translateX: '-50%', translateY: '-50%',
          width: 6, height: 6,
          borderRadius: '50%',
          background: 'var(--accent)',
          pointerEvents: 'none',
          zIndex: 9999,
          boxShadow: '0 0 8px 2px var(--accent-glow)',
        }}
      />
      {/* ring */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0, left: 0,
          x: trailX, y: trailY,
          translateX: '-50%', translateY: '-50%',
          scale: scaleSpring,
          width: 32, height: 32,
          borderRadius: '50%',
          border: '1px solid var(--accent)',
          pointerEvents: 'none',
          zIndex: 9998,
          opacity: 0.65,
        }}
      />
      {/* outer ring */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0, left: 0,
          x: trailX, y: trailY,
          translateX: '-50%', translateY: '-50%',
          width: 56, height: 56,
          borderRadius: '50%',
          border: '0.5px solid rgba(255,59,0,0.2)',
          pointerEvents: 'none',
          zIndex: 9997,
        }}
      />
    </>
  );
}
