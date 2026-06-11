/**
 * VELOX HYPERCRAFT — Cyberpunk Hypercar Landing Page
 * 
 * Dependencies:
 *   npm install framer-motion
 * 
 * Google Fonts (add to index.html <head>):
 *   <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;600;700&family=Orbitron:wght@400;600;700;900&family=Space+Mono&display=swap" rel="stylesheet"/>
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import { fetchCars, fetchPriceSummary } from './utils/api';

/* ═══════════════════════════════════════════════
   CONSTANTS & CONFIG
═══════════════════════════════════════════════ */
const ACCENT = '#FF3B00';
const ACCENT_GLOW = 'rgba(255,59,0,0.4)';
const FONT_DISPLAY = "'Orbitron', monospace";
const FONT_BODY = "'Rajdhani', sans-serif";
const FONT_MONO = "'Space Mono', monospace";

const STATS = [
  { label: '0–100 KM/H', value: 2.4, suffix: 'S' },
  { label: 'TOP SPEED', value: 355, suffix: ' KM/H' },
  { label: 'TOTAL POWER', value: 1001, suffix: ' CV' },
  { label: 'DOWNFORCE', value: 585, suffix: ' KG' },
];

const TICKER_ITEMS = [
  'REVUELTO V12 HYBRID', '1001 CV', '0–100 KM/H: 2.4s',
  'TOP SPEED: 355 KM/H', 'AERODYNAMIC DOWNFORCE: 585 KG',
  'LAUNCH YEAR: 2035', 'PRODUCTION: 88 UNITS',
];

const NAV_ITEMS = [
  { label: 'MODELS', targetId: 'models' },
  { label: 'TECH', targetId: 'tech' },
  { label: 'PERFORMANCE', targetId: 'performance' },
  { label: 'CONTACT', targetId: 'contact' },
];

const MODEL_CHOICES = [
  { name: 'REVUELTO', badge: 'V12 HYBRID', blurb: '1001 CV / 2.4s to 100' },
  { name: 'SF90', badge: 'PHEV', blurb: '986 CV / AWD precision' },
  { name: 'CHIRON', badge: 'W16', blurb: '1578 CV / ultimate luxury' },
];

const TECH_FEATURES = [
  { title: 'ACTIVE AERO', text: 'Adaptive wings and active ground effects keep the car pinned to the road.' },
  { title: 'INTELLIGENT TORQUE', text: 'Instant electric response blends with the combustion engine for seamless acceleration.' },
  { title: 'DIGITAL COCKPIT', text: 'Immersive HUDs, telemetry, and driver-focused controls keep every detail in sight.' },
];

const PERFORMANCE_POINTS = [
  { label: '0–100 KM/H', value: '2.4S' },
  { label: 'TOP SPEED', value: '355 KM/H' },
  { label: 'POWER', value: '1001 CV' },
  { label: 'DOWNFORCE', value: '585 KG' },
];

const CONTACT_DETAILS = [
  { label: 'EMAIL', value: 'hello@veloxhypercraft.com' },
  { label: 'PHONE', value: '+1 (800) 555-0148' },
  { label: 'SHOWROOM', value: 'Dubai, Monaco, Milan' },
];

const MODEL_SHOWCASES = [
  {
    name: 'REVUELTO V12 HYBRID',
    badge: 'ARRIVAL 2035',
    blurb: 'A 1001 CV hybrid weapon with active aero and a twin-layer carbon shell.',
    metrics: ['1001 CV', '2.4s 0-100', '355 KM/H'],
  },
  {
    name: 'AERON GT',
    badge: 'LIMITED SERIES',
    blurb: 'A sculpted grand tourer tuned for long-distance precision and silent electric thrust.',
    metrics: ['860 CV', '2.8s 0-100', '330 KM/H'],
  },
  {
    name: 'NOVA SPYDER',
    badge: 'TRACK EDITION',
    blurb: 'Low-drag, high-downforce engineering focused on razor-sharp corner entry.',
    metrics: ['910 CV', '2.5s 0-100', '340 KM/H'],
  },
];

const TECH_PILLARS = [
  {
    title: 'ACTIVE AERO',
    text: 'Adaptive wings, rear diffuser control, and predictive ground-effect mapping keep every curve planted.',
  },
  {
    title: 'AI TORQUE VECTORING',
    text: 'A neural-assisted torque map refines grip delivery in real time, from city launch to full-throttle exits.',
  },
  {
    title: 'IMMERSIVE COCKPIT',
    text: 'A panoramic HUD, biometric climate tuning, and gesture control create a cockpit that feels like a command deck.',
  },
];

const PERFORMANCE_TILES = [
  { label: 'LAUNCH CONTROL', value: '0.9s' },
  { label: 'BRAKING', value: '100-0: 31m' },
  { label: 'CHARGE TIME', value: '18m' },
  { label: 'RANGE', value: '690 KM' },
];

const CONTACT_OPTIONS = [
  { title: 'PRIVATE VIEWING', text: 'Meet our engineers and inspect the full carbon monocoque in person.' },
  { title: 'TEST DRIVE', text: 'Experience the launch and telemetry systems on a closed circuit.' },
  { title: 'COLLECTOR PROGRAM', text: 'Reserve an allocation for bespoke finishes, bespoke leather, and one-off trim.' },
];

const FOOTER_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'Mail', href: 'mailto:hello@veloxhypercraft.com' },
];

const HERO_WORDS = 'ENGINEERED BEYOND THE LIMITS OF MODERN PERFORMANCE'.split(' ');
const HIGHLIGHT_WORDS = new Set(['BEYOND', 'LIMITS']);

/* ═══════════════════════════════════════════════
   GLOBAL STYLES (injected once)
═══════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @keyframes hc-scan {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  @keyframes hc-ticker {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes hc-marquee {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-50%); }
  }
  @keyframes hc-progress {
    0% { width: 0%; opacity: 1; }
    85% { width: 100%; opacity: 1; }
    100% { width: 100%; opacity: 0; }
  }
  @keyframes hc-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
`;

function useGlobalStyles() {
  useEffect(() => {
    if (document.getElementById('hc-global-styles')) return;
    const style = document.createElement('style');
    style.id = 'hc-global-styles';
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
  }, []);
}

/* ═══════════════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════════════ */
function Cursor() {
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const trailX = useSpring(mx, { stiffness: 110, damping: 20 });
  const trailY = useSpring(my, { stiffness: 110, damping: 20 });
  const outerX = useSpring(mx, { stiffness: 60, damping: 18 });
  const outerY = useSpring(my, { stiffness: 60, damping: 18 });
  const ringScale = useSpring(1, { stiffness: 250, damping: 20 });

  useEffect(() => {
    const move = (e) => { mx.set(e.clientX); my.set(e.clientY); };
    const onEnter = () => ringScale.set(1.7);
    const onLeave = () => ringScale.set(1);
    window.addEventListener('mousemove', move);
    document.querySelectorAll('[data-hover]').forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });
    return () => window.removeEventListener('mousemove', move);
  }, [mx, my, ringScale]);

  const base = { position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9999 };

  return (
    <>
      <motion.div style={{ ...base, x: mx, y: my, translateX: '-50%', translateY: '-50%',
        width: 6, height: 6, borderRadius: '50%', background: ACCENT,
        boxShadow: `0 0 10px 3px ${ACCENT_GLOW}` }} />
      <motion.div style={{ ...base, x: trailX, y: trailY, translateX: '-50%', translateY: '-50%',
        scale: ringScale, width: 32, height: 32, borderRadius: '50%',
        border: `1px solid ${ACCENT}`, opacity: 0.65, zIndex: 9998 }} />
      <motion.div style={{ ...base, x: outerX, y: outerY, translateX: '-50%', translateY: '-50%',
        width: 60, height: 60, borderRadius: '50%',
        border: '0.5px solid rgba(255,59,0,0.2)', zIndex: 9997 }} />
    </>
  );
}

/* ═══════════════════════════════════════════════
   PARTICLE FIELD (3D star-warp)
═══════════════════════════════════════════════ */
function ParticleField({ isActive }) {
  const canvasRef = useRef(null);
  const activeRef = useRef(isActive);
  useEffect(() => { activeRef.current = isActive; }, [isActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * 900 + 50,
      vz: Math.random() * 1.4 + 0.4,
      size: Math.random() * 1.6 + 0.3,
      alpha: Math.random() * 0.6 + 0.2,
      orange: Math.random() > 0.72,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const spd = activeRef.current ? 4 : 0.9;
      const W = canvas.width, H = canvas.height;

      particles.forEach(p => {
        p.z -= spd * p.vz;
        if (p.z <= 0) { p.z = 950; p.x = Math.random() * W; p.y = Math.random() * H; }

        const persp = 600;
        const sc = persp / p.z;
        const sx = (p.x - W / 2) * sc + W / 2;
        const sy = (p.y - H / 2) * sc + H / 2;
        const sz = p.size * sc;
        const al = Math.min(1, p.alpha * (1 - p.z / 950) * (activeRef.current ? 1.3 : 0.85));

        if (sx < -10 || sx > W + 10 || sy < -10 || sy > H + 10) return;

        if (activeRef.current && p.z < 350) {
          const prevZ = p.z + spd * p.vz;
          const prevSc = persp / prevZ;
          const px = (p.x - W / 2) * prevSc + W / 2;
          const py = (p.y - H / 2) * prevSc + H / 2;
          const g = ctx.createLinearGradient(px, py, sx, sy);
          g.addColorStop(0, 'transparent');
          g.addColorStop(1, p.orange ? `rgba(255,59,0,${al})` : `rgba(255,255,255,${al * 0.65})`);
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(sx, sy);
          ctx.strokeStyle = g; ctx.lineWidth = sz * 0.75; ctx.stroke();
        } else {
          ctx.beginPath(); ctx.arc(sx, sy, Math.max(0.3, sz), 0, Math.PI * 2);
          ctx.fillStyle = p.orange ? `rgba(255,59,0,${al})` : `rgba(255,255,255,${al * 0.55})`;
          ctx.fill();
        }
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 4 }} />;
}

/* ═══════════════════════════════════════════════
   SPOTLIGHT REVEAL
═══════════════════════════════════════════════ */
function SpotlightReveal({ onHoverChange }) {
  const containerRef = useRef(null);
  const [hovering, setHovering] = useState(false);
  const mx = useMotionValue(-999);
  const my = useMotionValue(-999);
  const sx = useSpring(mx, { stiffness: 140, damping: 24 });
  const sy = useSpring(my, { stiffness: 140, damping: 24 });
  const [maskPos, setMaskPos] = useState({ x: -999, y: -999 });

  // Keep mask CSS in sync with spring
  useEffect(() => {
    const unsubX = sx.on('change', () => setMaskPos({ x: sx.get(), y: sy.get() }));
    const unsubY = sy.on('change', () => setMaskPos({ x: sx.get(), y: sy.get() }));
    return () => { unsubX(); unsubY(); };
  }, [sx, sy]);

  const onMove = useCallback((e) => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  }, [mx, my]);

  return (
    <div ref={containerRef} onMouseMove={onMove}
      onMouseEnter={() => { setHovering(true); onHoverChange(true); }}
      onMouseLeave={() => { setHovering(false); onHoverChange(false); mx.set(-999); my.set(-999); }}
      style={{ position: 'absolute', inset: 0, zIndex: 5, overflow: 'hidden' }}>

      {/* Static bg image */}
      <img src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1600&q=85&fit=crop"
        alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 35%', opacity: 0.72, zIndex: 1, pointerEvents: 'none' }}
        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=85&fit=crop'; }} />

      {/* Video layer with spotlight mask */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        opacity: hovering ? 1 : 0, transition: 'opacity 0.7s ease',
        WebkitMaskImage: `radial-gradient(circle 200px at ${maskPos.x}px ${maskPos.y}px, black 0%, transparent 100%)`,
        maskImage: `radial-gradient(circle 200px at ${maskPos.x}px ${maskPos.y}px, black 0%, transparent 100%)`,
      }}>
        <video autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          src="https://cdn.coverr.co/videos/coverr-a-red-ferrari-on-a-highway-at-night-5063/1080p.mp4" />
      </div>

      {/* Dark overlay with hole */}
      {hovering && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
          background: `radial-gradient(circle 195px at ${maskPos.x}px ${maskPos.y}px, transparent 0%, rgba(0,0,0,0.86) 100%)`,
        }} />
      )}

      {/* Orange glow ring */}
      <motion.div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        pointerEvents: 'none', zIndex: 6, x: sx, y: sy,
        translateX: '-50%', translateY: '-50%',
        opacity: hovering ? 1 : 0, transition: 'opacity 0.4s',
        background: 'radial-gradient(circle, rgba(255,59,0,0.11) 0%, rgba(255,100,0,0.04) 45%, transparent 70%)',
      }} />

      {/* Hover hint */}
      <motion.div animate={{ opacity: hovering ? 0 : [0.3, 0.7, 0.3] }}
        transition={{ duration: 2.6, repeat: Infinity }}
        style={{ position: 'absolute', bottom: 98, left: '50%', transform: 'translateX(-50%)',
          zIndex: 8, fontFamily: FONT_DISPLAY, fontSize: 8, color: 'rgba(255,255,255,0.38)',
          letterSpacing: '0.32em', textTransform: 'uppercase', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
        ▶ &nbsp; HOVER TO IGNITE
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CANVAS GAUGE HELPER
═══════════════════════════════════════════════ */
function drawGauge(ctx, cx, cy, r, value, max, color, unit, valueFontSize = 18) {
  const start = Math.PI * 0.75;
  const total = Math.PI * 1.5;
  const prog = Math.min(1, Math.max(0, value / max));
  const cur = start + total * prog;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // background track
  ctx.beginPath(); ctx.arc(cx, cy, r, start, start + total);
  ctx.strokeStyle = 'rgba(255,255,255,0.07)'; ctx.lineWidth = 5; ctx.lineCap = 'butt'; ctx.stroke();

  // tick marks
  for (let i = 0; i <= 10; i++) {
    const a = start + (total / 10) * i;
    ctx.beginPath();
    ctx.moveTo(cx + (r - 7) * Math.cos(a), cy + (r - 7) * Math.sin(a));
    ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
    ctx.strokeStyle = i % 5 === 0 ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.09)';
    ctx.lineWidth = i % 5 === 0 ? 1.4 : 0.7; ctx.stroke();
  }

  // value arc
  if (prog > 0.01) {
    const g = ctx.createLinearGradient(0, cy, ctx.canvas.width, cy);
    g.addColorStop(0, 'rgba(255,120,0,0.75)');
    g.addColorStop(0.5, color);
    g.addColorStop(1, prog > 0.82 ? '#ff1a00' : color);

    // glow pass
    ctx.beginPath(); ctx.arc(cx, cy, r, start, cur);
    ctx.strokeStyle = 'rgba(255,59,0,0.18)'; ctx.lineWidth = 13; ctx.lineCap = 'round'; ctx.stroke();
    // main arc
    ctx.beginPath(); ctx.arc(cx, cy, r, start, cur);
    ctx.strokeStyle = g; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.stroke();
  }

  // value label
  ctx.fillStyle = prog > 0.84 ? ACCENT : '#fff';
  ctx.font = `700 ${valueFontSize}px Orbitron, monospace`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(Math.round(value), cx, cy - 5);

  // unit
  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  ctx.font = `400 6px Orbitron, monospace`;
  ctx.fillText(unit, cx, cy + 11);
}

/* ═══════════════════════════════════════════════
   SPEEDO HUD
═══════════════════════════════════════════════ */
function SpeedoHUD({ isActive }) {
  const speedCanvas = useRef(null);
  const rpmCanvas = useRef(null);
  const sim = useRef({ t: 0, speed: 0, rpm: 800, raf: null });
  const gears = ['N', '1', '2', '3', '4', '5', '6', '7'];

  const updateGauge = useCallback((spd, rpm) => {
    if (speedCanvas.current) drawGauge(speedCanvas.current.getContext('2d'), 65, 65, 52, spd, 340, ACCENT, 'KM/H', 20);
    if (rpmCanvas.current) drawGauge(rpmCanvas.current.getContext('2d'), 45, 45, 35, rpm - 800, 8200, '#FF6600', 'RPM×K', 12);
  }, []);

  useEffect(() => {
    const s = sim.current;
    if (isActive) {
      const tick = () => {
        s.t += 0.014;
        const w1 = Math.sin(s.t * 0.58) * 0.5 + 0.5;
        const w2 = Math.sin(s.t * 1.1 + 0.9) * 0.45 + 0.55;
        const tSpd = Math.min(338, w1 * w2 * 355);
        const tRpm = 800 + (tSpd / 340) * 8100 + Math.sin(s.t * 4) * 270;
        s.speed += (tSpd - s.speed) * 0.045;
        s.rpm += (tRpm - s.rpm) * 0.055;
        updateGauge(s.speed, s.rpm);
        const g = Math.min(7, Math.max(1, Math.floor(tSpd / 50) + 1));
        const boost = (s.speed / 340 * 2.8 + Math.sin(s.t * 2) * 0.11).toFixed(1);
        const temp = Math.round(87 + s.speed / 340 * 28 + Math.sin(s.t) * 4);
        const batt = Math.max(18, Math.round(100 - s.t * 1.3));
        const latG = (Math.sin(s.t * 0.65) * 1.85).toFixed(2);
        const setEl = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
        setEl('hc-gear', gears[g] || '7'); setEl('hc-boost', boost + ' BAR');
        setEl('hc-temp', temp + '°C'); setEl('hc-batt', batt + '%'); setEl('hc-latg', latG + ' G');
        s.raf = requestAnimationFrame(tick);
      };
      s.raf = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(s.raf);
      s.t = 0; s.speed = 0; s.rpm = 800;
      updateGauge(0, 800);
      const setEl = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
      setEl('hc-gear', 'N'); setEl('hc-boost', '0.0 BAR');
      setEl('hc-temp', '85°C'); setEl('hc-batt', '100%'); setEl('hc-latg', '0.00 G');
    }
    return () => cancelAnimationFrame(s.raf);
  }, [isActive, updateGauge]);

  useEffect(() => { updateGauge(0, 800); }, [updateGauge]);

  const glass = {
    background: 'rgba(0,0,0,0.58)',
    border: '0.5px solid rgba(255,59,0,0.22)',
    borderRadius: 8,
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    padding: '10px 13px',
    minWidth: 115,
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 35 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'absolute', right: 28, top: '50%', transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', gap: 11, alignItems: 'flex-end',
        pointerEvents: 'none', zIndex: 20 }}>

      {/* Speedometer canvas */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}>
        <canvas ref={speedCanvas} width={130} height={130} style={{ display: 'block' }} />
      </motion.div>

      {/* RPM canvas */}
      <canvas ref={rpmCanvas} width={90} height={90} style={{ display: 'block', marginRight: 20 }} />

      {/* Telemetry panel */}
      <div style={glass}>
        <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(255,59,0,0.6), transparent)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 8, paddingBottom: 6, borderBottom: '0.5px solid rgba(255,59,0,0.12)' }}>
          <span style={{ fontFamily: FONT_MONO, fontSize: 7, color: 'rgba(255,255,255,0.2)',
            letterSpacing: '0.1em', textTransform: 'uppercase' }}>SYS TELEMETRY</span>
          <div style={{ width: 5, height: 5, borderRadius: '50%',
            background: isActive ? ACCENT : '#222',
            boxShadow: isActive ? `0 0 7px ${ACCENT}` : 'none',
            transition: 'all 0.4s', animation: isActive ? 'hc-blink 1.8s ease-in-out infinite' : 'none' }} />
        </div>
        {[['GEAR', 'hc-gear', 'N'], ['BOOST', 'hc-boost', '0.0 BAR'],
          ['ENG TEMP', 'hc-temp', '85°C'], ['HV BATT', 'hc-batt', '100%'],
          ['LAT G', 'hc-latg', '0.00 G']].map(([key, id, init]) => (
          <div key={id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
            <span style={{ fontFamily: FONT_MONO, fontSize: 7, color: 'rgba(255,255,255,0.28)',
              letterSpacing: '0.1em', textTransform: 'uppercase' }}>{key}</span>
            <span id={id} style={{ fontFamily: FONT_DISPLAY, fontSize: 8, fontWeight: 700, color: ACCENT }}>{init}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   3D TILT CARD WRAPPER
═══════════════════════════════════════════════ */
function TiltCard({ children, style, intensity = 11 }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sprx = useSpring(rx, { stiffness: 200, damping: 26 });
  const spry = useSpring(ry, { stiffness: 200, damping: 26 });
  const rotX = useTransform(sprx, [-0.5, 0.5], [intensity, -intensity]);
  const rotY = useTransform(spry, [-0.5, 0.5], [-intensity, intensity]);

  return (
    <motion.div ref={ref}
      onMouseMove={e => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        rx.set((e.clientX - r.left) / r.width - 0.5);
        ry.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { rx.set(0); ry.set(0); setHovered(false); }}
      style={{ rotateX: rotX, rotateY: rotY, scale: useSpring(hovered ? 1.02 : 1, { stiffness: 250, damping: 22 }),
        transformStyle: 'preserve-3d', ...style }}>
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   COUNT-UP NUMBER
═══════════════════════════════════════════════ */
function CountUp({ to, suffix = '', duration = 1800 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const isDecimal = String(to).includes('.');

  useEffect(() => {
    if (!inView || !ref.current) return;
    let start;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      if (ref.current) ref.current.textContent = (isDecimal ? (eased * to).toFixed(1) : Math.round(eased * to)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, to, duration, suffix, isDecimal]);

  return <span ref={ref}>0{suffix}</span>;
}

/* ═══════════════════════════════════════════════
   STATS CARD
═══════════════════════════════════════════════ */
function StatsCard() {
  return (
    <TiltCard intensity={9}>
      <motion.div
        initial={{ opacity: 0, y: 28, rotateX: -18 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
        style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,59,0,0.28)',
          borderRadius: 13, padding: '18px 22px', backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)', minWidth: 235, position: 'relative', overflow: 'hidden',
          transformStyle: 'preserve-3d' }}>
        {/* Top glow */}
        <div style={{ position: 'absolute', top: 0, left: '8%', right: '8%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(255,59,0,0.85), transparent)' }} />
        {/* Reflection */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '38%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.025) 0%, transparent 100%)',
          borderRadius: '13px 13px 0 0', pointerEvents: 'none' }} />

        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 7.5, fontWeight: 600,
          color: 'rgba(255,255,255,0.28)', letterSpacing: '0.22em', textTransform: 'uppercase',
          marginBottom: 14, paddingBottom: 8, borderBottom: '0.5px solid rgba(255,59,0,0.12)' }}>
          PERFORMANCE DATA
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '13px 22px' }}>
          {STATS.map(({ label, value, suffix }, i) => (
            <motion.div key={label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 + i * 0.1 }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 7, color: 'rgba(255,255,255,0.28)',
                letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 23, fontWeight: 900, color: ACCENT,
                lineHeight: 1, textShadow: `0 0 22px ${ACCENT_GLOW}` }}>
                <CountUp to={value} suffix={suffix} duration={1900} />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </TiltCard>
  );
}

/* ═══════════════════════════════════════════════
   EMBLEM
═══════════════════════════════════════════════ */
function Emblem() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <polygon points="24,2 44,12 44,36 24,46 4,36 4,12" fill="none" stroke={ACCENT} strokeWidth="1.2"/>
      <polygon points="24,8 38,16 38,32 24,40 10,32 10,16" fill="rgba(255,59,0,0.055)" stroke="rgba(255,59,0,0.35)" strokeWidth="0.5"/>
      <path d="M16,27 L24,14 L32,27 L24,33 Z" fill={ACCENT} opacity="0.92"/>
      <line x1="24" y1="2" x2="24" y2="8" stroke={ACCENT} strokeWidth="1.2"/>
      <line x1="24" y1="40" x2="24" y2="46" stroke={ACCENT} strokeWidth="1.2"/>
      <line x1="4" y1="12" x2="10" y2="16" stroke={ACCENT} strokeWidth="0.8" opacity="0.45"/>
      <line x1="44" y1="12" x2="38" y2="16" stroke={ACCENT} strokeWidth="0.8" opacity="0.45"/>
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   CTA BUTTON
═══════════════════════════════════════════════ */
function CTAButton({ children, id, onClick }) {
  return (
    <motion.button
      id={id}
      onClick={onClick}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97, y: 1 }}
      transition={{ type: 'spring', stiffness: 380, damping: 20 }}
      data-hover="true"
      style={{ fontFamily: FONT_DISPLAY, fontSize: 9, fontWeight: 700, color: '#000',
        background: ACCENT, border: 'none', padding: '11px 24px', letterSpacing: '0.24em',
        textTransform: 'uppercase', cursor: 'none',
        clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
        boxShadow: `0 8px 32px ${ACCENT_GLOW}, 0 2px 8px rgba(0,0,0,0.6)`,
        position: 'relative', overflow: 'hidden' }}>
      {children}
    </motion.button>
  );
}

/* ═══════════════════════════════════════════════
   TICKER
═══════════════════════════════════════════════ */
function Ticker() {
  const t = [...TICKER_ITEMS, ...TICKER_ITEMS].join('   ·   ');
  return (
    <motion.footer
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.1 }}
      style={{ position: 'relative', zIndex: 20, marginTop: 'auto', padding: '18px 28px 24px',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(0,0,0,0.82) 100%)',
        borderTop: '1px solid rgba(255,59,0,0.22)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <motion.div animate={{ rotate: [0, 2, -2, 0], scale: [1, 1.04, 1] }} transition={{ duration: 4.2, repeat: Infinity }}>
            <Emblem />
          </motion.div>
          <div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '0.28em', textTransform: 'uppercase' }}>VELOX HYPERCRAFT</div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 7.5, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Luxury performance, reimagined.</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {FOOTER_LINKS.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : '_self'}
              rel="noreferrer"
              whileHover={{ y: -2, color: ACCENT, scale: 1.02 }}
              style={{ fontFamily: FONT_DISPLAY, fontSize: 8, fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none' }}>
              {link.label}
            </motion.a>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative', overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '8px 0', background: 'rgba(0,0,0,0.28)' }}>
        <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-flex', whiteSpace: 'nowrap', gap: '2.5rem', fontFamily: FONT_DISPLAY, fontSize: 7, fontWeight: 500, color: 'rgba(255,255,255,0.24)', letterSpacing: '0.26em', textTransform: 'uppercase' }}>
          <span>{t}</span>
          <span>{t}</span>
        </motion.div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 7.5, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          Crafted for those who demand presence, precision, and pulse.
        </div>
        <CTAButton id="footer-cta" onClick={() => window.location.href = 'mailto:hello@veloxhypercraft.com'}>BOOK A PRIVATE TOUR</CTAButton>
      </div>
    </motion.footer>
  );
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
export default function HypercarlLanding() {
  useGlobalStyles();
  const [isHovering, setIsHovering] = useState(false);
  const [cars, setCars] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState('');
  const [priceSummary, setPriceSummary] = useState(null);
  const [loadingCars, setLoadingCars] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadInventory = async () => {
      try {
        const inventory = await fetchCars();
        if (!cancelled) {
          setCars(inventory);
          if (inventory[0]) {
            setSelectedCarId(inventory[0]._id || inventory[0].id);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setErrorMessage(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoadingCars(false);
        }
      }
    };

    loadInventory();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedCarId) return;

    let cancelled = false;
    const refreshSummary = async () => {
      try {
        const summary = await fetchPriceSummary(selectedCarId, {});
        if (!cancelled) {
          setPriceSummary(summary);
        }
      } catch (err) {
        if (!cancelled) {
          setPriceSummary(null);
        }
      }
    };

    refreshSummary();
    return () => {
      cancelled = true;
    };
  }, [selectedCarId]);

  const selectedCar = cars.find((car) => (car._id || car.id) === selectedCarId) || cars[0] || null;

  const scrollToSection = (targetId) => {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh',
      background: '#000', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>

      <Cursor />

      <div style={{ position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 90% 55% at 50% 65%, #1c0800 0%, #000 75%)', zIndex: 0 }} />

      <div style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none', opacity: 0.043,
        backgroundImage: `linear-gradient(rgba(255,59,0,0.7) 1px, transparent 1px),linear-gradient(90deg, rgba(255,59,0,0.7) 1px, transparent 1px)`,
        backgroundSize: '62px 62px' }} />

      <div style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: '100%', height: 2,
          background: 'linear-gradient(90deg, transparent, rgba(255,59,0,0.13), transparent)',
          animation: 'hc-scan 7s linear infinite', top: 0 }} />
      </div>

      <ParticleField isActive={isHovering} />
      <SpotlightReveal onHoverChange={setIsHovering} />

      {[{ top:14,left:14,borderTop:'1.5px solid #FF3B00',borderLeft:'1.5px solid #FF3B00' },
        { top:14,right:14,borderTop:'1.5px solid #FF3B00',borderRight:'1.5px solid #FF3B00' },
        { bottom:14,left:14,borderBottom:'1.5px solid #FF3B00',borderLeft:'1.5px solid #FF3B00' },
        { bottom:14,right:14,borderBottom:'1.5px solid #FF3B00',borderRight:'1.5px solid #FF3B00' }
      ].map((s, i) => <div key={i} style={{ position:'absolute', width:22, height:22, zIndex:20, pointerEvents:'none', ...s }} />)}

      <motion.div style={{ position:'absolute', bottom:0, left:0, height:2,
        background:`linear-gradient(90deg, ${ACCENT}, #ff7a00)`, zIndex:25,
        boxShadow:`0 0 14px ${ACCENT_GLOW}` }}
        animate={{ width:['0%','100%','100%'], opacity:[1,1,0] }}
        transition={{ duration:8, ease:'easeInOut', repeat:Infinity, repeatDelay:0.5 }} />

      <SpeedoHUD isActive={isHovering} />

      <div style={{ position:'relative', zIndex:15, width:'100%', minHeight:'100vh',
        display:'flex', flexDirection:'column', padding:'28px 32px 80px', pointerEvents:'auto', perspective:'1200px' }}>

        <motion.div initial={{ opacity:0, y:-22 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.9, delay:0.1, ease:[0.16,1,0.3,1] }}
          style={{ display:'flex', alignItems:'center', justifyContent:'space-between', pointerEvents:'auto', position:'sticky', top:18, zIndex:30, padding:'10px 0 20px' }}>

          <div style={{ display:'flex', alignItems:'center', gap:13 }}>
            <motion.div animate={{ rotateY:[0,10,0,-10,0] }} transition={{ duration:9, repeat:Infinity, ease:'easeInOut' }}
              style={{ transformStyle:'preserve-3d' }}>
              <Emblem />
            </motion.div>
            <div>
              <div style={{ fontFamily:FONT_DISPLAY, fontSize:13, fontWeight:700, color:'#fff',
                letterSpacing:'0.32em', textTransform:'uppercase', lineHeight:1.2 }}>VELOX</div>
              <div style={{ fontFamily:FONT_DISPLAY, fontSize:7.5, fontWeight:400, color:ACCENT,
                letterSpacing:'0.46em', textTransform:'uppercase' }}>HYPERCRAFT</div>
            </div>
          </div>

          <div style={{ display:'flex', gap:28, flexWrap:'wrap', justifyContent:'flex-end' }}>
            {NAV_ITEMS.map((item, i) => (
              <motion.button key={item.label}
                initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:0.2+i*0.07 }}
                whileHover={{ color:ACCENT, y:-1 }}
                data-hover="true"
                onClick={() => scrollToSection(item.targetId)}
                style={{ fontFamily:FONT_DISPLAY, fontSize:9, fontWeight:500,
                  color:'rgba(255,255,255,0.42)', letterSpacing:'0.22em', textTransform:'uppercase',
                  cursor:'none', userSelect:'none', display:'inline-block', border:'none', padding:0,
                  background:'transparent', textAlign:'left' }}>
                {item.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <section id="hero" style={{ minHeight:'calc(100vh - 140px)', display:'flex', flexDirection:'column', justifyContent:'space-between', paddingTop:28, paddingBottom:32 }}>
          <div style={{ maxWidth:760 }}>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
              transition={{ delay:0.35 }}
              style={{ fontFamily:FONT_DISPLAY, fontSize:8.5, fontWeight:500, color:ACCENT,
                letterSpacing:'0.38em', textTransform:'uppercase', marginBottom:16 }}>
              — REVUELTO V12 HYBRID / 1001 CV —
            </motion.div>

            <div style={{ perspective:'900px', transformStyle:'preserve-3d' }}>
              {HERO_WORDS.map((word, i) => (
                <motion.span key={i}
                  initial={{ opacity:0, y:42, rotateX:-42 }}
                  animate={{ opacity:1, y:0, rotateX:0 }}
                  transition={{ duration:0.82, delay:0.48+i*0.085, ease:[0.16,1,0.3,1] }}
                  style={{ display:'inline-block', fontFamily:FONT_DISPLAY,
                    fontSize:'clamp(20px, 3.3vw, 44px)', fontWeight:900,
                    color: HIGHLIGHT_WORDS.has(word) ? ACCENT : '#fff',
                    letterSpacing:'0.04em', textTransform:'uppercase', lineHeight:1.1,
                    marginRight:'0.28em',
                    textShadow: HIGHLIGHT_WORDS.has(word) ? `0 0 40px ${ACCENT_GLOW}` : '0 2px 24px rgba(0,0,0,0.85)',
                    transformOrigin:'bottom center', transformStyle:'preserve-3d' }}>
                  {word}
                </motion.span>
              ))}
            </div>
          </div>

          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:20, flexWrap:'wrap', marginTop:24 }}>
            <div style={{ maxWidth:430, fontFamily:FONT_BODY, fontSize:14, color:'rgba(255,255,255,0.7)', lineHeight:1.6 }}>
              Shaping a new class of hypercar experience through a fusion of combustion force, electric refinement, and software-defined performance.
            </div>
            <StatsCard />
          </div>
        </section>

        <div style={{ display:'grid', gap:24, marginTop:14 }}>
          <section id="models" style={{ scrollMarginTop:90, background:'rgba(255,255,255,0.03)', border:'0.5px solid rgba(255,59,0,0.2)', borderRadius:24, padding:'28px', backdropFilter:'blur(18px)', WebkitBackdropFilter:'blur(18px)' }}>
            <div style={{ fontFamily:FONT_DISPLAY, fontSize:9, color:ACCENT, letterSpacing:'0.32em', textTransform:'uppercase', marginBottom:10 }}>
              MODELS / VISION LINEUP
            </div>
            <div style={{ fontFamily:FONT_DISPLAY, fontSize:24, fontWeight:700, color:'#fff', marginBottom:16 }}>
              Three sculpted machines, each tuned for a different kind of obsession.
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:16 }}>
              {MODEL_SHOWCASES.map((model) => (
                <motion.div key={model.name} whileHover={{ y:-6, scale:1.01 }} style={{ background:'rgba(0,0,0,0.28)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:16 }}>
                  <div style={{ fontFamily:FONT_MONO, fontSize:7, color:'rgba(255,255,255,0.38)', letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:8 }}>{model.badge}</div>
                  <div style={{ fontFamily:FONT_DISPLAY, fontSize:14, color:'#fff', letterSpacing:'0.16em', textTransform:'uppercase', marginBottom:8 }}>{model.name}</div>
                  <div style={{ fontFamily:FONT_BODY, fontSize:12, color:'rgba(255,255,255,0.7)', lineHeight:1.6, marginBottom:10 }}>{model.blurb}</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                    {model.metrics.map((metric) => (
                      <span key={metric} style={{ fontFamily:FONT_MONO, fontSize:7, color:ACCENT, border:'1px solid rgba(255,59,0,0.25)', padding:'5px 8px', borderRadius:999 }}>{metric}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
            <div style={{ marginTop:20, display:'grid', gridTemplateColumns:'1.1fr 0.9fr', gap:18, alignItems:'stretch' }}>
              <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:18, padding:18 }}>
                <div style={{ fontFamily:FONT_DISPLAY, fontSize:9, color:ACCENT, letterSpacing:'0.24em', textTransform:'uppercase', marginBottom:8 }}>
                  {loadingCars ? 'SYNCING WITH BACKEND…' : errorMessage ? 'BACKEND OFFLINE' : 'LIVE INVENTORY'}
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:10 }}>
                  {cars.map((car) => {
                    const carId = car._id || car.id;
                    return (
                      <button key={carId} onClick={() => setSelectedCarId(carId)} style={{ border: `1px solid ${selectedCar && (selectedCar._id || selectedCar.id) === carId ? ACCENT : 'rgba(255,255,255,0.14)'}`, background: selectedCar && (selectedCar._id || selectedCar.id) === carId ? 'rgba(255,59,0,0.12)' : 'rgba(255,255,255,0.04)', color: '#fff', padding:'7px 10px', fontFamily: FONT_MONO, fontSize: 7, letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'pointer' }}>
                        {car.brand}
                      </button>
                    );
                  })}
                </div>
                {selectedCar ? (
                  <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                    <div style={{ fontFamily: FONT_DISPLAY, fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                      {selectedCar.brand} {selectedCar.model}
                    </div>
                    <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: 'rgba(255,255,255,0.62)' }}>
                      {selectedCar.specs?.horsepower || '—'} hp • {selectedCar.specs?.topSpeed || '—'} km/h
                    </div>
                    {priceSummary ? (
                      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 9, color: ACCENT, letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: 4 }}>
                        EST. {priceSummary.totalPrice?.toLocaleString?.('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) || '—'}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
              <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:18, padding:18 }}>
                <div style={{ fontFamily:FONT_DISPLAY, fontSize:9, color:ACCENT, letterSpacing:'0.24em', textTransform:'uppercase', marginBottom:10 }}>CONFIGURATION</div>
                <div style={{ fontFamily:FONT_BODY, fontSize:12, color:'rgba(255,255,255,0.7)', lineHeight:1.7 }}>
                  Every Velox Hypercraft build can be tailored with forged wheels, ceramic braking, bespoke interior tone, and a personal launch theme driven by your signature profile.
                </div>
              </div>
            </div>
          </section>

          <section id="tech" style={{ scrollMarginTop:90, background:'rgba(255,255,255,0.03)', border:'0.5px solid rgba(255,59,0,0.2)', borderRadius:24, padding:'28px', backdropFilter:'blur(18px)', WebkitBackdropFilter:'blur(18px)' }}>
            <div style={{ fontFamily:FONT_DISPLAY, fontSize:9, color:ACCENT, letterSpacing:'0.32em', textTransform:'uppercase', marginBottom:10 }}>TECH / INTELLIGENCE</div>
            <div style={{ fontFamily:FONT_DISPLAY, fontSize:24, fontWeight:700, color:'#fff', marginBottom:18 }}>Software-defined performance, sculpted into the hardware.</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:16 }}>
              {TECH_PILLARS.map((item) => (
                <div key={item.title} style={{ background:'rgba(0,0,0,0.28)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:16 }}>
                  <div style={{ fontFamily:FONT_DISPLAY, fontSize:12, color:'#fff', letterSpacing:'0.16em', textTransform:'uppercase', marginBottom:8 }}>{item.title}</div>
                  <div style={{ fontFamily:FONT_BODY, fontSize:12, color:'rgba(255,255,255,0.7)', lineHeight:1.6 }}>{item.text}</div>
                </div>
              ))}
            </div>
          </section>

          <section id="performance" style={{ scrollMarginTop:90, background:'rgba(255,255,255,0.03)', border:'0.5px solid rgba(255,59,0,0.2)', borderRadius:24, padding:'28px', backdropFilter:'blur(18px)', WebkitBackdropFilter:'blur(18px)' }}>
            <div style={{ fontFamily:FONT_DISPLAY, fontSize:9, color:ACCENT, letterSpacing:'0.32em', textTransform:'uppercase', marginBottom:10 }}>PERFORMANCE / TRACK DNA</div>
            <div style={{ fontFamily:FONT_DISPLAY, fontSize:24, fontWeight:700, color:'#fff', marginBottom:18 }}>The numbers are impressive, but the feeling is what matters.</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:16, marginBottom:18 }}>
              {PERFORMANCE_TILES.map((item) => (
                <div key={item.label} style={{ background:'rgba(0,0,0,0.28)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:16 }}>
                  <div style={{ fontFamily:FONT_MONO, fontSize:7, color:'rgba(255,255,255,0.35)', letterSpacing:'0.16em', textTransform:'uppercase', marginBottom:6 }}>{item.label}</div>
                  <div style={{ fontFamily:FONT_DISPLAY, fontSize:18, color:'#fff', fontWeight:700 }}>{item.value}</div>
                </div>
              ))}
            </div>
            <div style={{ fontFamily:FONT_BODY, fontSize:13, color:'rgba(255,255,255,0.7)', lineHeight:1.8 }}>
              From launch control to high-speed stability, every system is calibrated to feel immediate and alive. The result is a machine that feels effortless at speed and cinematic at rest.
            </div>
          </section>

          <section id="contact" style={{ scrollMarginTop:90, background:'rgba(255,255,255,0.03)', border:'0.5px solid rgba(255,59,0,0.2)', borderRadius:24, padding:'28px', backdropFilter:'blur(18px)', WebkitBackdropFilter:'blur(18px)' }}>
            <div style={{ fontFamily:FONT_DISPLAY, fontSize:9, color:ACCENT, letterSpacing:'0.32em', textTransform:'uppercase', marginBottom:10 }}>CONTACT / EXPERIENCE</div>
            <div style={{ fontFamily:FONT_DISPLAY, fontSize:24, fontWeight:700, color:'#fff', marginBottom:18 }}>Reserve a private tour and step inside the next generation of hypercar design.</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:16, marginBottom:18 }}>
              {CONTACT_OPTIONS.map((option) => (
                <div key={option.title} style={{ background:'rgba(0,0,0,0.28)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:16 }}>
                  <div style={{ fontFamily:FONT_DISPLAY, fontSize:12, color:'#fff', letterSpacing:'0.16em', textTransform:'uppercase', marginBottom:8 }}>{option.title}</div>
                  <div style={{ fontFamily:FONT_BODY, fontSize:12, color:'rgba(255,255,255,0.7)', lineHeight:1.6 }}>{option.text}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:12, alignItems:'center' }}>
              {CONTACT_DETAILS.map((item) => (
                <div key={item.label} style={{ fontFamily:FONT_MONO, fontSize:8, color:'rgba(255,255,255,0.7)', letterSpacing:'0.16em', textTransform:'uppercase', padding:'10px 12px', border:'1px solid rgba(255,255,255,0.08)', borderRadius:999 }}>
                  <span style={{ color:'rgba(255,255,255,0.4)', marginRight:6 }}>{item.label}</span>{item.value}
                </div>
              ))}
              <CTAButton id="contact-cta" onClick={() => window.location.href = 'mailto:hello@veloxhypercraft.com'}>BOOK A PRIVATE TOUR</CTAButton>
            </div>
          </section>
        </div>
      </div>

      <Ticker />
    </div>
  );
}
