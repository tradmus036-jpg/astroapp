"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group relative overflow-hidden",
          "h-12 w-full rounded-xl",
          "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600",
          "text-slate-900 font-semibold tracking-widest text-sm",
          "border border-amber-300/50",
          "transition-all duration-300",
          "hover:from-amber-400 hover:via-amber-300 hover:to-amber-500",
          "hover:shadow-[0_0_40px_oklch(0.78_0.13_55/0.6),0_0_80px_oklch(0.78_0.13_55/0.2)]",
          "hover:scale-[1.01]",
          "active:scale-[0.99]",
          "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100",
          className
        )}
        {...props}
      >
        {/* Shimmer sweep effect */}
        <span
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl"
          aria-hidden="true"
        >
          <span className="absolute top-0 left-[-100%] h-full w-[50%] bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] animate-[shimmer-sweep_3s_ease-in-out_infinite]" />
        </span>

        {/* Radial glow on hover */}
        <span
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,255,255,0.15) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";
