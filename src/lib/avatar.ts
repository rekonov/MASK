// ── Deterministic geometric avatar generator ─────────────────────────
// Generates a unique abstract avatar from a seed string.
// Runs entirely on canvas — no network, no external services.

/** Hash a string into a numeric seed. */
function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** Simple seeded PRNG (mulberry32). */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Monochrome-friendly palette (subtle, muted tones that work in both themes)
const PALETTES = [
  ["#2d2d2d", "#4a4a4a", "#6b6b6b", "#8c8c8c", "#b0b0b0"],
  ["#1a1a2e", "#16213e", "#0f3460", "#533483", "#e94560"],
  ["#212529", "#343a40", "#495057", "#6c757d", "#adb5bd"],
  ["#0d1b2a", "#1b263b", "#415a77", "#778da9", "#e0e1dd"],
  ["#10002b", "#240046", "#3c096c", "#5a189a", "#9d4edd"],
  ["#03071e", "#370617", "#6a040f", "#9d0208", "#dc2f02"],
  ["#001219", "#005f73", "#0a9396", "#94d2bd", "#e9d8a6"],
  ["#353535", "#3c6e71", "#ffffff", "#d9d9d9", "#284b63"],
] as const;

export function generateAvatar(seed: string, size: number = 200): string {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const h = hashSeed(seed);
  const rand = mulberry32(h);

  // Pick palette
  const palette = PALETTES[Math.floor(rand() * PALETTES.length)];
  const pickColor = () => palette[Math.floor(rand() * palette.length)];

  // Background
  ctx.fillStyle = palette[0];
  ctx.fillRect(0, 0, size, size);

  // Draw symmetric geometric shapes
  const shapeCount = 4 + Math.floor(rand() * 5);
  const half = size / 2;

  for (let i = 0; i < shapeCount; i++) {
    ctx.fillStyle = pickColor();
    ctx.globalAlpha = 0.4 + rand() * 0.5;

    const shapeType = Math.floor(rand() * 3);
    const x = rand() * half;
    const y = rand() * size;
    const w = 20 + rand() * (half - 20);
    const h2 = 20 + rand() * 60;

    if (shapeType === 0) {
      // Rectangle (mirrored)
      ctx.fillRect(x, y, w, h2);
      ctx.fillRect(size - x - w, y, w, h2);
    } else if (shapeType === 1) {
      // Circle (mirrored)
      const r = 10 + rand() * 30;
      ctx.beginPath();
      ctx.arc(x + r, y + r, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(size - x - r, y + r, r, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Triangle (mirrored)
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + w, y + h2 / 2);
      ctx.lineTo(x, y + h2);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(size - x, y);
      ctx.lineTo(size - x - w, y + h2 / 2);
      ctx.lineTo(size - x, y + h2);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Center accent circle
  ctx.globalAlpha = 0.6 + rand() * 0.3;
  ctx.fillStyle = pickColor();
  const cr = 15 + rand() * 20;
  ctx.beginPath();
  ctx.arc(half, size / 2, cr, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 1;

  return canvas.toDataURL("image/png");
}
