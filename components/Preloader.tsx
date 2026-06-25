"use client";

import { useState, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

interface PreloaderProps {
  /** Total duration of the preloader in ms. */
  duration?: number;
  /** Called when the preloader finishes and exits. */
  onComplete?: () => void;
  /** Whether the preloader is visible. */
  isLoading?: boolean;
  /** Optional className for the container. */
  className?: string;
}

const bootMessages = [
  "Initializing Solana node...",
  "Syncing on-chain game index...",
  "Loading safety scoring engine...",
  "Fetching DexScreener feeds...",
  "Calculating holder distributions...",
  "Verifying token metadata...",
  "Rendering game cards...",
  "Establishing secure checkpoint...",
  "Welcome to SavePoint.",
];

function randomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function Particles({ count = 24 }: { count?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: `${randomRange(0, 100)}%`,
        size: randomRange(1, 3),
        delay: randomRange(0, 4),
        duration: randomRange(3, 7),
        opacity: randomRange(0.3, 0.8),
      })),
    [count]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-lime"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: 0,
          }}
          animate={{
            y: ["0vh", "-120vh"],
            opacity: [0, p.opacity, p.opacity, 0],
            scale: [0.8, 1.2, 0.6],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

function Scanlines() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 opacity-[0.035]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
        backgroundSize: "100% 4px",
      }}
    />
  );
}

function GlitchText({ text }: { text: string }) {
  return (
    <div className="relative inline-block">
      <span className="relative z-10">{text}</span>
      <span
        className="absolute left-0 top-0 -z-10 w-full text-lime/70"
        style={{ clipPath: "inset(0 0 50% 0)", transform: "translateX(-2px)" }}
      >
        {text}
      </span>
      <span
        className="absolute left-0 top-0 -z-10 w-full text-cyan-400/70"
        style={{ clipPath: "inset(50% 0 0 0)", transform: "translateX(2px)" }}
      >
        {text}
      </span>
    </div>
  );
}

export function Preloader({
  duration = 3500,
  onComplete,
  isLoading = true,
  className,
}: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [exiting, setExiting] = useState(false);
  const isLoadingRef = useRef(isLoading);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    if (!mounted) return;

    let raf = 0;
    let finished = false;
    const start = Date.now();

    const complete = () => {
      if (finished) return;
      finished = true;
      setTimeout(() => {
        setExiting(true);
        setTimeout(() => onComplete?.(), 600);
      }, 300);
    };

    const tick = () => {
      const elapsed = Date.now() - start;
      const next = isLoadingRef.current
        ? Math.min((elapsed / duration) * 100, 100)
        : 100;

      setProgress(next);
      setMessageIndex(
        Math.min(
          Math.floor((elapsed / duration) * bootMessages.length),
          bootMessages.length - 1
        )
      );

      if (next < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        complete();
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration, onComplete, mounted]);

  const circumference = 2 * Math.PI * 58;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-black",
            className
          )}
        >
          {/* Background mesh */}
          <div className="pointer-events-none absolute inset-0 bg-mesh opacity-40" />
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />

          {/* Particles */}
          <Particles count={32} />

          {/* Radial glow */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/5 blur-[120px]" />

          {/* Scanlines */}
          <Scanlines />

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo with orbit ring */}
            <div className="relative mb-8 flex h-40 w-40 items-center justify-center">
              {/* Outer rotating ring */}
              <motion.div
                className="absolute inset-0 rounded-full border border-lime/10"
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime shadow-[0_0_12px_rgba(204,255,0,0.8)]" />
              </motion.div>

              {/* Progress ring */}
              <svg className="absolute inset-0 h-full w-full -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="58"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="2"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="58"
                  fill="none"
                  stroke="#CCFF00"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="drop-shadow-[0_0_8px_rgba(204,255,0,0.6)]"
                />
              </svg>

              {/* Inner glow pulse */}
              <motion.div
                className="absolute inset-4 rounded-full bg-lime/5 blur-xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Logo */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Logo size={64} />
              </motion.div>
            </div>

            {/* Brand text */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-2 text-3xl font-bold tracking-tight text-white"
            >
              <GlitchText text="SAVEPOINT" />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mb-8 font-mono text-xs uppercase tracking-[0.3em] text-lime/70"
            >
              Solana Gaming Checkpoint
            </motion.p>

            {/* Terminal boot log */}
            <div className="mb-8 w-[320px] overflow-hidden rounded-lg border border-white/[0.08] bg-black/40 p-3 font-mono text-[10px] leading-5 text-foreground/60 backdrop-blur-sm sm:w-[380px]">
              <div className="mb-1.5 flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-foreground/30">
                <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse" />
                Boot sequence
              </div>
              <div className="h-[72px] space-y-1">
                {bootMessages.slice(0, messageIndex + 1).map((msg, i) => (
                  <motion.div
                    key={`${i}-${msg}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-lime/80">{`>`}</span>
                    <span className={i === messageIndex ? "text-lime" : ""}>{msg}</span>
                  </motion.div>
                ))}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block h-3 w-1.5 bg-lime"
                />
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-[320px] sm:w-[380px]">
              <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-foreground/50">
                <span>Loading</span>
                <span className="text-lime">{Math.round(progress)}%</span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  className="h-full bg-gradient-to-r from-lime via-lime to-cyan-400 shadow-[0_0_12px_rgba(204,255,0,0.5)]"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>
          </div>

          {/* Corner decorations */}
          <div className="pointer-events-none absolute bottom-6 left-6 font-mono text-[9px] uppercase tracking-widest text-foreground/20">
            SYS.READY
          </div>
          <div className="pointer-events-none absolute bottom-6 right-6 font-mono text-[9px] uppercase tracking-widest text-foreground/20">
            v0.1.0
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
