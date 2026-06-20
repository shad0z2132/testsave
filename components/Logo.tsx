import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 32 }: LogoProps) {
  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src="/savepointlogonobg.png"
        alt="SavePoint"
        fill
        sizes={`${size}px`}
        className="object-contain"
        priority
      />
    </div>
  );
}
