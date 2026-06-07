# VELOX HYPERCRAFT — Cyberpunk Hypercar Landing Page
### React + Framer Motion | 3D Motion | Spotlight Reveal | Live Telemetry HUD

---

## Quick Start

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## Dependencies

```bash
npm install react react-dom framer-motion
# react-scripts for dev server:
npm install --save-dev react-scripts
```

---

## File Structure

```
src/
├── index.js                  # React entry point
├── index.css                 # Global styles + keyframes
├── HypercarlLanding.jsx      # ★ MAIN COMPONENT (fully self-contained)
├── App.jsx                   # Thin wrapper
└── components/               # Optional split-file version
    ├── Cursor.jsx             # Custom 3-ring cursor
    ├── SpotlightReveal.jsx    # Mouse-tracked spotlight + video reveal
    ├── ParticleField.jsx      # 3D star-warp particle canvas
    ├── SpeedoHUD.jsx          # Canvas gauges + telemetry panel
    ├── StatsCard.jsx          # Glass card with CountUp numbers
    └── TiltCard.jsx           # Perspective 3D tilt wrapper
```

> **Recommended:** Use `HypercarlLanding.jsx` as a single self-contained drop-in.

---

## Google Fonts (required)

Add to `public/index.html` `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;600;700&family=Orbitron:wght@400;600;700;900&family=Space+Mono&display=swap" rel="stylesheet"/>
```

---

## Features

| Feature | Implementation |
|---|---|
| Custom 3-ring cursor | Framer Motion spring physics |
| 3D hero word reveal | `rotateX` + `perspective` entrance animations |
| Spotlight video reveal | CSS `mask-image` radial gradient tracking mouse |
| 3D star-warp particles | Canvas 2D perspective projection |
| Live speedometer | Canvas arc gauge with spring animation |
| Live RPM gauge | Canvas arc gauge, synced to speed sim |
| Telemetry HUD | RAF simulation, DOM updates |
| Stats card 3D tilt | `rotateX/Y` Framer Motion spring |
| CountUp numbers | `requestAnimationFrame` eased counter |
| Scrolling ticker | CSS `ticker` keyframe animation |
| Scan line effect | CSS `scan` keyframe animation |
| Progress bar | Framer Motion `animate` width |
| Emblem rotation | Framer Motion `rotateY` looping |
| CTA button | Framer Motion `whileHover` + `whileTap` |

---

## Customization

```jsx
// Change accent color (single source of truth)
const ACCENT = '#FF3B00';

// Swap car image
<img src="YOUR_CAR_IMAGE_URL" />

// Swap reveal video
<video src="YOUR_VIDEO_URL" />

// Edit hero text
const HERO_WORDS = 'YOUR HERO TEXT HERE'.split(' ');

// Edit highlighted words (shown in accent color)
const HIGHLIGHT_WORDS = new Set(['YOUR', 'WORDS']);

// Edit stats
const STATS = [
  { label: '0–100 KM/H', value: 2.4, suffix: 'S' },
  // ...
];
```

---

## Browser Support

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

`backdrop-filter` (glassmorphism) requires Chrome/Safari. Firefox fallback: semi-opaque dark background.

---

## License

Free to use for personal and commercial projects.
