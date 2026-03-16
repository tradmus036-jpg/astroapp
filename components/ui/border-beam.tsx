"use client";

import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
  size?: number;
}

export function BorderBeam({
  className,
  duration = 10,
  colorFrom = "#d4a843",
  colorTo = "#9b59b6",
  size = 80,
}: BorderBeamProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      {/* Top beam */}
      <span
        className="absolute top-0 left-0 h-[1.5px] w-0"
        style={{
          width: `${size}px`,
          background: `linear-gradient(90deg, transparent, ${colorFrom}, ${colorTo})`,
          animation: `beam-x ${duration}s linear infinite`,
        }}
      />
      {/* Right beam */}
      <span
        className="absolute top-0 right-0 w-[1.5px] h-0"
        style={{
          height: `${size}px`,
          background: `linear-gradient(180deg, transparent, ${colorFrom}, ${colorTo})`,
          animation: `beam-y ${duration}s linear infinite`,
          animationDelay: `${duration * 0.25}s`,
        }}
      />
      {/* Bottom beam */}
      <span
        className="absolute bottom-0 right-0 h-[1.5px] w-0"
        style={{
          width: `${size}px`,
          background: `linear-gradient(270deg, transparent, ${colorFrom}, ${colorTo})`,
          animation: `beam-x-rev ${duration}s linear infinite`,
          animationDelay: `${duration * 0.5}s`,
        }}
      />
      {/* Left beam */}
      <span
        className="absolute bottom-0 left-0 w-[1.5px] h-0"
        style={{
          height: `${size}px`,
          background: `linear-gradient(0deg, transparent, ${colorFrom}, ${colorTo})`,
          animation: `beam-y-rev ${duration}s linear infinite`,
          animationDelay: `${duration * 0.75}s`,
        }}
      />
    </div>
  );
}
