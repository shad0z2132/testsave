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
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    const gap = 8;

    let top = 0;
    let left = 0;

    if (side === "top") {
      top = rect.top + scrollY - gap;
      left = rect.left + scrollX + rect.width / 2;
    } else if (side === "bottom") {
      top = rect.bottom + scrollY + gap;
      left = rect.left + scrollX + rect.width / 2;
    } else if (side === "left") {
      top = rect.top + scrollY + rect.height / 2;
      left = rect.left + scrollX - gap;
    } else if (side === "right") {
      top = rect.top + scrollY + rect.height / 2;
      left = rect.right + scrollX + gap;
    }

    // Keep tooltip within viewport horizontally.
    const viewportWidth = window.innerWidth;
    let finalLeft = left;
    if (side === "top" || side === "bottom") {
      finalLeft = Math.max(gap, Math.min(left, viewportWidth - width - gap));
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

  const isHorizontalCenter = side === "top" || side === "bottom";

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
              transform: isHorizontalCenter ? "translateX(-50%)" : side === "left" ? "translateX(-100%) translateY(-50%)" : "translateY(-50%)",
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
