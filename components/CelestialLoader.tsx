"use client";

export function CelestialLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-14 gap-10">
      {/* Orbital system */}
      <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
        {/* Outer glow pulse */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, oklch(0.78 0.13 55 / 0.08) 0%, transparent 70%)",
            animation: "pulse 3s ease-in-out infinite",
          }}
        />

        {/* Orbit ring 3 (outermost) */}
        <div
          className="absolute rounded-full border border-blue-400/10"
          style={{
            width: 152,
            height: 152,
            animation: "spin 12s linear infinite",
          }}
        >
          <div
            className="absolute rounded-full"
            style={{
              width: 5,
              height: 5,
              background: "#93c5fd",
              boxShadow: "0 0 8px #93c5fd",
              top: -2.5,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
        </div>

        {/* Orbit ring 2 */}
        <div
          className="absolute rounded-full border border-violet-400/15"
          style={{
            width: 108,
            height: 108,
            animation: "spin 7s linear infinite reverse",
          }}
        >
          <div
            className="absolute rounded-full"
            style={{
              width: 7,
              height: 7,
              background: "#c084fc",
              boxShadow: "0 0 12px #c084fc",
              top: -3.5,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
        </div>

        {/* Orbit ring 1 (innermost) */}
        <div
          className="absolute rounded-full border border-amber-400/20"
          style={{
            width: 68,
            height: 68,
            animation: "spin 3.5s linear infinite",
          }}
        >
          <div
            className="absolute rounded-full"
            style={{
              width: 9,
              height: 9,
              background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
              boxShadow: "0 0 14px oklch(0.78 0.13 55 / 0.9)",
              top: -4.5,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
        </div>

        {/* Center star */}
        <div
          className="relative flex items-center justify-center w-12 h-12 rounded-full"
          style={{
            background: "radial-gradient(circle at 35% 35%, #fde68a, #d97706)",
            boxShadow:
              "0 0 0 3px oklch(0.78 0.13 55 / 0.15), 0 0 20px oklch(0.78 0.13 55 / 0.5), 0 0 60px oklch(0.78 0.13 55 / 0.2)",
            animation: "pulse 2s ease-in-out infinite",
          }}
        >
          <span className="text-slate-900 text-lg leading-none select-none">✦</span>
        </div>
      </div>

      {/* Text area */}
      <div className="text-center space-y-2.5">
        <p
          className="gold-text font-semibold tracking-[0.4em] text-sm uppercase"
          style={{ animation: "pulse 2.5s ease-in-out infinite" }}
        >
          Reading the Stars
        </p>
        <p className="text-muted-foreground/50 text-xs tracking-[0.2em]">
          Calculating your celestial blueprint...
        </p>
      </div>

      {/* Animated dots */}
      <div className="flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-amber-400/50"
            style={{
              animation: `pulse 1.2s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
