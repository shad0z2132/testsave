"use client";

import { useMemo } from "react";

const PARTICLE_COLORS = [{ r: 255, g: 42, b: 140 }]; // pink only

// Deterministic pseudo-random so SSR and CSR produce identical particles.
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999.98953) * 10000;
  return x - Math.floor(x);
}

function pickColor(seed: number) {
  return PARTICLE_COLORS[Math.floor(seededRandom(seed) * PARTICLE_COLORS.length)];
}

export function DustParticles() {
  // Core particles — dense field of tiny dots
  const particles = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => {
        const c = pickColor(i * 3);
        return {
          id: i,
          left: `${seededRandom(i * 3 + 1) * 100}%`,
          size: seededRandom(i * 3 + 2) * 2.5 + 0.5, // 0.5-3px
          duration: seededRandom(i * 3 + 3) * 12 + 12, // 12-24s
          delay: seededRandom(i * 3 + 4) * -25, // Start at random positions
          opacity: seededRandom(i * 3 + 5) * 0.6 + 0.25, // 0.25-0.85
          color: `rgba(${c.r}, ${c.g}, ${c.b}`,
        };
      }),
    []
  );

  // Larger glow particles — atmospheric
  const glowParticles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => {
        const seedBase = 300 + i * 4;
        const c = pickColor(seedBase);
        return {
          id: `glow-${i}`,
          left: `${seededRandom(seedBase + 1) * 100}%`,
          size: seededRandom(seedBase + 2) * 3 + 2, // 2-5px
          duration: seededRandom(seedBase + 3) * 15 + 18, // 18-33s
          delay: seededRandom(seedBase + 4) * -30,
          opacity: seededRandom(seedBase + 5) * 0.3 + 0.15,
          color: `rgba(${c.r}, ${c.g}, ${c.b}`,
        };
      }),
    []
  );

  // Rare cross particles — bright streaks
  const streakParticles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const seedBase = 500 + i * 4;
        const c = pickColor(seedBase);
        return {
          id: `streak-${i}`,
          left: `${seededRandom(seedBase + 1) * 100}%`,
          size: seededRandom(seedBase + 2) * 1.5 + 1,
          duration: seededRandom(seedBase + 3) * 8 + 10,
          delay: seededRandom(seedBase + 4) * -20,
          opacity: seededRandom(seedBase + 5) * 0.5 + 0.4,
          color: `rgba(${c.r}, ${c.g}, ${c.b}`,
        };
      }),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden hidden lg:block">
      {/* Core particles — tiny dots */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            bottom: "-10px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: `${p.color}, ${p.opacity})`,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}, ${p.opacity * 0.6})`,
            animation: `particle-rise ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Glow particles — larger, blurred */}
      {glowParticles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            bottom: "-20px",
            width: `${p.size * 2.5}px`,
            height: `${p.size * 2.5}px`,
            backgroundColor: `${p.color}, ${p.opacity})`,
            filter: `blur(${p.size}px)`,
            animation: `particle-rise ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Streak particles — brighter, longer glow */}
      {streakParticles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            bottom: "-15px",
            width: `${p.size}px`,
            height: `${p.size * 4}px`,
            background: `linear-gradient(to top, ${p.color}, 0), ${p.color}, ${p.opacity}), ${p.color}, 0))`,
            filter: "blur(0.5px)",
            animation: `particle-rise ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
