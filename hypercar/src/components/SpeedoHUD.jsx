import React, { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

function drawArcGauge(ctx, cx, cy, r, value, max, color, label, unit, fontSize = 18) {
  const startA = Math.PI * 0.75;
  const totalA = Math.PI * 1.5;
  const prog = Math.min(1, Math.max(0, value / max));
  const curA = startA + totalA * prog;
  const w = r * 2 + 20;
  const h = r * 2 + 20;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // bg track
  ctx.beginPath();
  ctx.arc(cx, cy, r, startA, startA + totalA);
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 5;
  ctx.lineCap = 'butt';
  ctx.stroke();

  // tick marks
  for (let i = 0; i <= 10; i++) {
    const a = startA + (totalA / 10) * i;
    const x1 = cx + (r - 7) * Math.cos(a);
    const y1 = cy + (r - 7) * Math.sin(a);
    const x2 = cx + r * Math.cos(a);
    const y2 = cy + r * Math.sin(a);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = i % 5 === 0 ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)';
    ctx.lineWidth = i % 5 === 0 ? 1.5 : 0.8;
    ctx.stroke();
  }

  // gradient arc
  const grad = ctx.createLinearGradient(0, cy, w, cy);
  grad.addColorStop(0, 'rgba(255,120,0,0.7)');
  grad.addColorStop(0.6, color);
  grad.addColorStop(1, prog > 0.8 ? '#ff0000' : color);

  ctx.beginPath();
  ctx.arc(cx, cy, r, startA, curA);
  ctx.strokeStyle = grad;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.stroke();

  // glow
  if (prog > 0.05) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, startA, curA);
    ctx.strokeStyle = 'rgba(255,59,0,0.2)';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  // value text
  ctx.fillStyle = prog > 0.85 ? '#FF3B00' : '#ffffff';
  ctx.font = `700 ${fontSize}px Orbitron, monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(Math.round(value), cx, cy - 5);

  // unit
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = `400 7px Orbitron, monospace`;
  ctx.fillText(unit, cx, cy + 11);

  // label
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.font = `400 6px Orbitron, monospace`;
  ctx.fillText(label, cx, cy + 22);
}

export default function SpeedoHUD({ isActive }) {
  const speedRef = useRef(null);
  const rpmRef = useRef(null);
  const simRef = useRef({ t: 0, speed: 0, rpm: 800, targetSpeed: 0, targetRpm: 800, raf: null });
  const gears = ['N', '1', '2', '3', '4', '5', '6', '7'];

  const drawAll = useCallback((speed, rpm) => {
    if (speedRef.current) {
      const ctx = speedRef.current.getContext('2d');
      drawArcGauge(ctx, 65, 65, 52, speed, 340, '#FF3B00', 'SPEED', 'KM/H', 20);
    }
    if (rpmRef.current) {
      const ctx = rpmRef.current.getContext('2d');
      drawArcGauge(ctx, 45, 45, 35, (rpm - 800), 8200, '#FF6600', 'RPM', 'K×RPM', 12);
    }
  }, []);

  useEffect(() => {
    const sim = simRef.current;

    if (isActive) {
      const tick = () => {
        sim.t += 0.014;
        const wave = Math.sin(sim.t * 0.6) * 0.5 + 0.5;
        const wave2 = Math.sin(sim.t * 1.1 + 0.8) * 0.45 + 0.55;
        sim.targetSpeed = Math.min(338, wave * wave2 * 355);
        sim.targetRpm = 800 + (sim.targetSpeed / 340) * 8100 + Math.sin(sim.t * 4) * 280;

        sim.speed += (sim.targetSpeed - sim.speed) * 0.045;
        sim.rpm += (sim.targetRpm - sim.rpm) * 0.05;

        drawAll(sim.speed, sim.rpm);

        const g = Math.min(7, Math.max(1, Math.floor(sim.targetSpeed / 50) + 1));
        const boost = (sim.speed / 340 * 2.8 + Math.sin(sim.t * 2) * 0.12).toFixed(1);
        const temp = Math.round(87 + sim.speed / 340 * 28 + Math.sin(sim.t) * 4);
        const batt = Math.max(18, Math.round(100 - sim.t * 1.2));

        document.getElementById('hud-gear') && (document.getElementById('hud-gear').textContent = gears[g] || '7');
        document.getElementById('hud-boost') && (document.getElementById('hud-boost').textContent = boost + ' BAR');
        document.getElementById('hud-temp') && (document.getElementById('hud-temp').textContent = temp + '°C');
        document.getElementById('hud-batt') && (document.getElementById('hud-batt').textContent = batt + '%');
        document.getElementById('hud-lat') && (document.getElementById('hud-lat').textContent = (Math.sin(sim.t * 0.7) * 1.8).toFixed(2) + ' G');

        sim.raf = requestAnimationFrame(tick);
      };
      sim.raf = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(sim.raf);
      sim.t = 0; sim.speed = 0; sim.rpm = 800;
      drawAll(0, 800);
      document.getElementById('hud-gear') && (document.getElementById('hud-gear').textContent = 'N');
      document.getElementById('hud-boost') && (document.getElementById('hud-boost').textContent = '0.0 BAR');
      document.getElementById('hud-temp') && (document.getElementById('hud-temp').textContent = '85°C');
      document.getElementById('hud-batt') && (document.getElementById('hud-batt').textContent = '100%');
      document.getElementById('hud-lat') && (document.getElementById('hud-lat').textContent = '0.00 G');
    }

    return () => cancelAnimationFrame(sim.raf);
  }, [isActive, drawAll]);

  useEffect(() => { drawAll(0, 800); }, [drawAll]);

  const containerStyle = {
    position: 'absolute',
    right: 28,
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    alignItems: 'flex-end',
    pointerEvents: 'none',
    zIndex: 20,
  };

  const glassCard = {
    background: 'rgba(0,0,0,0.55)',
    border: '0.5px solid rgba(255,59,0,0.25)',
    borderRadius: 8,
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    padding: '10px 12px',
    minWidth: 110,
  };

  const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginBottom: 5,
  };

  const keyStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: 7,
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
  };

  const valStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: 8,
    fontWeight: 700,
    color: '#FF3B00',
    letterSpacing: '0.05em',
  };

  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Speedometer */}
      <motion.div
        animate={isActive ? { y: [0, -4, 0] } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <canvas
          ref={speedRef}
          width={130}
          height={130}
          style={{ display: 'block' }}
        />
      </motion.div>

      {/* RPM */}
      <canvas
        ref={rpmRef}
        width={90}
        height={90}
        style={{ display: 'block', alignSelf: 'flex-end', marginRight: 20 }}
      />

      {/* Telemetry card */}
      <div style={glassCard}>
        <div style={{ ...rowStyle, borderBottom: '0.5px solid rgba(255,59,0,0.12)', paddingBottom: 5, marginBottom: 7 }}>
          <span style={{ ...keyStyle, color: 'rgba(255,255,255,0.18)' }}>TELEMETRY</span>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: isActive ? '#FF3B00' : '#333', boxShadow: isActive ? '0 0 6px #FF3B00' : 'none', transition: 'all 0.4s' }} />
        </div>
        {[
          ['GEAR', 'hud-gear', 'N'],
          ['BOOST', 'hud-boost', '0.0 BAR'],
          ['TEMP', 'hud-temp', '85°C'],
          ['BATT', 'hud-batt', '100%'],
          ['LAT G', 'hud-lat', '0.00 G'],
        ].map(([label, id, init]) => (
          <div key={id} style={{ ...rowStyle, marginBottom: 4 }}>
            <span style={keyStyle}>{label}</span>
            <span id={id} style={valStyle}>{init}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
