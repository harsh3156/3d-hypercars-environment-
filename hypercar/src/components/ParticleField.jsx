import React, { useEffect, useRef } from 'react';

export default function ParticleField({ isActive }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ particles: [], raf: null, isActive: false });

  useEffect(() => {
    stateRef.current.isActive = isActive;
  }, [isActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const NUM = 90;
    const state = stateRef.current;

    state.particles = Array.from({ length: NUM }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * 800 + 100,
      vz: Math.random() * 1.5 + 0.5,
      size: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.7 ? '#FF3B00' : '#ffffff',
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const speed = state.isActive ? 3.5 : 0.8;

      state.particles.forEach(p => {
        p.z -= speed * p.vz;
        if (p.z <= 0) {
          p.z = 900;
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
        }

        const perspective = 600;
        const scale = perspective / p.z;
        const sx = (p.x - canvas.width / 2) * scale + canvas.width / 2;
        const sy = (p.y - canvas.height / 2) * scale + canvas.height / 2;
        const size = p.size * scale;
        const alpha = p.alpha * (1 - p.z / 900) * (state.isActive ? 1.4 : 0.8);

        if (sx < -10 || sx > canvas.width + 10 || sy < -10 || sy > canvas.height + 10) return;

        if (state.isActive && p.z < 300) {
          // streak effect
          const streakLen = (300 - p.z) / 300 * 18 * scale;
          const prevZ = p.z + speed * p.vz;
          const prevScale = perspective / prevZ;
          const px = (p.x - canvas.width / 2) * prevScale + canvas.width / 2;
          const py = (p.y - canvas.height / 2) * prevScale + canvas.height / 2;

          const grad = ctx.createLinearGradient(px, py, sx, sy);
          grad.addColorStop(0, 'transparent');
          grad.addColorStop(1, p.color === '#FF3B00' ? `rgba(255,59,0,${Math.min(1, alpha)})` : `rgba(255,255,255,${Math.min(1, alpha * 0.7)})`);

          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(sx, sy);
          ctx.strokeStyle = grad;
          ctx.lineWidth = size * 0.8;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(sx, sy, Math.max(0.3, size), 0, Math.PI * 2);
          ctx.fillStyle = p.color === '#FF3B00'
            ? `rgba(255,59,0,${Math.min(1, alpha)})`
            : `rgba(255,255,255,${Math.min(1, alpha * 0.6)})`;
          ctx.fill();
        }
      });

      state.raf = requestAnimationFrame(draw);
    };

    state.raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(state.raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 4,
      }}
    />
  );
}
