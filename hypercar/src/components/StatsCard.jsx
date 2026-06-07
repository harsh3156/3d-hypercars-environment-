import React, { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import TiltCard from './TiltCard';

function CountUp({ target, duration = 1600, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || !ref.current) return;
    let start = null;
    const isDecimal = String(target).includes('.');
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = isDecimal
        ? (eased * target).toFixed(1)
        : Math.round(eased * target);
      if (ref.current) ref.current.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

const stats = [
  { label: '0–100 KM/H', value: 2.4, suffix: 'S', delay: 0 },
  { label: 'TOP SPEED', value: 355, suffix: ' KM/H', delay: 0.1 },
  { label: 'TOTAL POWER', value: 1001, suffix: ' CV', delay: 0.2 },
  { label: 'DOWNFORCE', value: 585, suffix: ' KG', delay: 0.3 },
];

export default function StatsCard() {
  return (
    <TiltCard intensity={8} style={{ transformStyle: 'preserve-3d' }}>
      <motion.div
        initial={{ opacity: 0, y: 30, rotateX: -15 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: 'rgba(255,255,255,0.035)',
          border: '0.5px solid rgba(255,59,0,0.3)',
          borderRadius: 12,
          padding: '18px 22px',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          minWidth: 230,
          position: 'relative',
          overflow: 'hidden',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* top glow line */}
        <div style={{
          position: 'absolute', top: 0, left: '10%', right: '10%',
          height: 1,
          background: 'linear-gradient(90deg, transparent, #FF3B00, transparent)',
          opacity: 0.8,
        }} />

        {/* inner light reflection */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '40%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)',
          pointerEvents: 'none',
          borderRadius: '12px 12px 0 0',
        }} />

        {/* header */}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 7.5,
          fontWeight: 600,
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          marginBottom: 14,
          paddingBottom: 8,
          borderBottom: '0.5px solid rgba(255,59,0,0.15)',
        }}>
          PERFORMANCE DATA
        </div>

        {/* stats grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px 20px',
        }}>
          {stats.map(({ label, value, suffix, delay }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, translateZ: -20 }}
              animate={{ opacity: 1, translateZ: 0 }}
              transition={{ duration: 0.8, delay: 0.7 + delay }}
            >
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 7,
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: 3,
              }}>
                {label}
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 22,
                fontWeight: 900,
                color: '#FF3B00',
                lineHeight: 1,
                textShadow: '0 0 20px rgba(255,59,0,0.4)',
              }}>
                <CountUp target={value} suffix={suffix} duration={1800} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* bottom depth layer */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 12,
          boxShadow: 'inset 0 -1px 0 rgba(255,59,0,0.1)',
          pointerEvents: 'none',
        }} />
      </motion.div>
    </TiltCard>
  );
}
