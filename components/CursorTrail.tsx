"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

const COLORS = ["#ff2a8c", "#ff4d9e", "#00f0ff", "#ffffff"];

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, lastX: -1000, lastY: -1000 });
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      mouseRef.current.lastX = mouseRef.current.x;
      mouseRef.current.lastY = mouseRef.current.y;
      mouseRef.current.x = x;
      mouseRef.current.y = y;

      // Spawn particles along the movement vector for a smooth trail.
      const dx = x - mouseRef.current.lastX;
      const dy = y - mouseRef.current.lastY;
      const dist = Math.hypot(dx, dy);
      const steps = Math.min(Math.ceil(dist / 4), 8);

      for (let i = 0; i < steps; i++) {
        const t = i / steps;
        const px = mouseRef.current.lastX + dx * t;
        const py = mouseRef.current.lastY + dy * t;

        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.6 + 0.2;
        const size = Math.random() * 2.5 + 1;

        particlesRef.current.push({
          x: px + (Math.random() - 0.5) * 4,
          y: py + (Math.random() - 0.5) * 4,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.15,
          life: 1,
          maxLife: Math.random() * 0.5 + 0.4,
          size,
          color: randomColor(),
        });
      }

      // Limit total particles to keep performance high.
      if (particlesRef.current.length > 300) {
        particlesRef.current = particlesRef.current.slice(-300);
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= 0.015;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.002; // slight upward drift

        const progress = p.life / p.maxLife;
        const alpha = Math.max(0, progress * 0.8);
        const size = p.size * progress;

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Soft outer glow for pink/cyan particles.
        if (size > 0.8) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha * 0.15;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999]"
    />
  );
}
