"use client";

export function AuroraBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Base dark gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 100% 80% at 50% -10%, oklch(0.16 0.07 280 / 0.7) 0%, transparent 60%)",
          animation: "aurora-drift-1 18s ease-in-out infinite alternate",
        }}
      />

      {/* Aurora blob 1 — purple-violet */}
      <div
        className="absolute"
        style={{
          width: "70%",
          height: "60%",
          top: "-15%",
          left: "10%",
          background:
            "radial-gradient(ellipse, oklch(0.45 0.22 290 / 0.18) 0%, oklch(0.30 0.15 270 / 0.08) 50%, transparent 70%)",
          filter: "blur(60px)",
          animation: "aurora-drift-1 14s ease-in-out infinite alternate",
        }}
      />

      {/* Aurora blob 2 — amber/gold */}
      <div
        className="absolute"
        style={{
          width: "50%",
          height: "40%",
          top: "-5%",
          right: "5%",
          background:
            "radial-gradient(ellipse, oklch(0.78 0.13 55 / 0.10) 0%, oklch(0.60 0.10 50 / 0.04) 50%, transparent 70%)",
          filter: "blur(80px)",
          animation: "aurora-drift-2 20s ease-in-out infinite alternate",
        }}
      />

      {/* Aurora blob 3 — indigo (bottom) */}
      <div
        className="absolute"
        style={{
          width: "60%",
          height: "50%",
          bottom: "-10%",
          left: "20%",
          background:
            "radial-gradient(ellipse, oklch(0.35 0.18 260 / 0.15) 0%, transparent 70%)",
          filter: "blur(70px)",
          animation: "aurora-drift-3 16s ease-in-out infinite alternate",
        }}
      />

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
