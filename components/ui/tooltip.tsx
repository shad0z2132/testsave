"use client";

import { cn } from "@/lib/utils";
import { ReactNode, useRef, useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  className?: string;
  side?: "top" | "bottom" | "left" | "right";
  width?: number;
}

export function Tooltip({
  content,
  children,
  className,
  side = "top",
  width = 240,
}: TooltipProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const gap = 8;

    let top = 0;
    let left = 0;

    if (side === "top") {
      top = rect.top - gap;
      left = rect.left + rect.width / 2;
    } else if (side === "bottom") {
      top = rect.bottom + gap;
      left = rect.left + rect.width / 2;
    } else if (side === "left") {
      top = rect.top + rect.height / 2;
      left = rect.left - gap;
    } else if (side === "right") {
      top = rect.top + rect.height / 2;
      left = rect.right + gap;
    }

    // Keep tooltip within viewport horizontally.
    const viewportWidth = window.innerWidth;
    let finalLeft = left;
    if (side === "top" || side === "bottom") {
      finalLeft = Math.max(gap + width / 2, Math.min(left, viewportWidth - width / 2 - gap));
    }

    setPosition({ top, left: finalLeft });
  }, [side, width]);

  const show = useCallback(() => {
    updatePosition();
    setVisible(true);
  }, [updatePosition]);

  const hide = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    if (!visible) return;
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [visible, updatePosition]);

  const transformMap = {
    top: "translateX(-50%) translateY(-100%)",
    bottom: "translateX(-50%)",
    left: "translateX(-100%) translateY(-50%)",
    right: "translateY(-50%)",
  };

  return (
    <>
      <div
        ref={triggerRef}
        className={cn("inline-flex", className)}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </div>
      {mounted &&
        createPortal(
          <div
            className={cn(
              "pointer-events-none fixed z-[200] transition-opacity duration-200",
              visible ? "opacity-100" : "opacity-0"
            )}
            style={{
              top: position.top,
              left: position.left,
              width,
              transform: transformMap[side],
            }}
          >
            <div className="rounded-lg border border-border/60 bg-[#0f0f11] p-2.5 text-xs shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              {content}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
