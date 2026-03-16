"use client";

interface CelestialLogoProps {
  size?: number;
  /** "full" = animated rings + glow   "mark" = compact, no outer animation */
  variant?: "full" | "mark";
}

export function CelestialLogo({ size = 80, variant = "full" }: CelestialLogoProps) {
  const cx = 50;
  const cy = 50;

  // ── Helper: point on circle at angle θ (clockwise from top) ──
  function pt(r: number, deg: number) {
    const rad = (deg - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  // ── 8-pointed star (outer R=13, inner r=5) ──
  const starPoints: string[] = [];
  for (let i = 0; i < 16; i++) {
    const r = i % 2 === 0 ? 13 : 5;
    const deg = i * 22.5;
    const p = pt(r, deg);
    starPoints.push(`${p.x.toFixed(2)},${p.y.toFixed(2)}`);
  }
  const starPath = "M" + starPoints.join(" L") + " Z";

  // ── 12 tick marks on outer ring (r=43) ──
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const deg = i * 30;
    const isMajor = i % 3 === 0;
    const outer = pt(43, deg);
    const inner = pt(isMajor ? 38.5 : 40.5, deg);
    return { outer, inner, isMajor };
  });

  // ── 8 diamond dots on middle ring (r=28) ──
  const diamonds = Array.from({ length: 8 }, (_, i) => pt(28, i * 45));

  // ── 4 cross connectors: outer ring → middle ring ──
  const connectors = [0, 90, 180, 270].map((deg) => ({
    a: pt(38.5, deg),
    b: pt(30, deg),
  }));

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Celestial Insights Logo"
    >
      <defs>
        {/* Radial glow */}
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d4a843" stopOpacity="0.25" />
          <stop offset="60%" stopColor="#d4a843" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#d4a843" stopOpacity="0" />
        </radialGradient>

        {/* Star gradient */}
        <linearGradient id="starGrad" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="40%" stopColor="#d4a843" />
          <stop offset="100%" stopColor="#b8922e" />
        </linearGradient>

        {/* Inner ring gradient */}
        <linearGradient id="innerRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0cc6a" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#d4a843" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#b8922e" stopOpacity="0.9" />
        </linearGradient>

        {/* Outer ring rotation (full variant only) */}
        {variant === "full" && (
          <animateTransform
            xlinkHref="#outerRingGroup"
            attributeName="transform"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            dur="40s"
            repeatCount="indefinite"
          />
        )}
      </defs>

      {/* ── Background glow ── */}
      <circle cx="50" cy="50" r="48" fill="url(#glow)" />

      {/* ── Outer ring group (rotates in "full" variant) ── */}
      <g id="outerRingGroup">
        {variant === "full" && (
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            dur="40s"
            repeatCount="indefinite"
          />
        )}

        {/* Outer circle */}
        <circle cx="50" cy="50" r="44" stroke="#d4a843" strokeWidth="0.4" opacity="0.3" />

        {/* 12 tick marks */}
        {ticks.map((t, i) => (
          <line
            key={i}
            x1={t.outer.x}
            y1={t.outer.y}
            x2={t.inner.x}
            y2={t.inner.y}
            stroke="#d4a843"
            strokeWidth={t.isMajor ? "1.2" : "0.6"}
            strokeLinecap="round"
            opacity={t.isMajor ? "0.75" : "0.35"}
          />
        ))}
      </g>

      {/* ── Cross connectors (outer → middle ring) ── */}
      {connectors.map((c, i) => (
        <line
          key={i}
          x1={c.a.x}
          y1={c.a.y}
          x2={c.b.x}
          y2={c.b.y}
          stroke="#d4a843"
          strokeWidth="0.5"
          opacity="0.35"
        />
      ))}

      {/* ── Middle ring ── */}
      <circle cx="50" cy="50" r="28" stroke="#d4a843" strokeWidth="0.5" opacity="0.4" />

      {/* ── Diamond dots on middle ring ── */}
      {diamonds.map((d, i) => {
        const isCardinal = i % 2 === 0;
        const angle = i * 45; // rotation for each diamond
        return (
          <rect
            key={i}
            x={d.x - (isCardinal ? 1.6 : 1)}
            y={d.y - (isCardinal ? 1.6 : 1)}
            width={isCardinal ? 3.2 : 2}
            height={isCardinal ? 3.2 : 2}
            fill="#d4a843"
            opacity={isCardinal ? "0.75" : "0.4"}
            transform={`rotate(45 ${d.x} ${d.y})`}
          />
        );
      })}

      {/* ── Inner ring (counter-rotates slightly in "full" variant) ── */}
      <g>
        {variant === "full" && (
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 50 50"
            to="-360 50 50"
            dur="60s"
            repeatCount="indefinite"
          />
        )}
        <circle
          cx="50"
          cy="50"
          r="19"
          stroke="url(#innerRingGrad)"
          strokeWidth="0.9"
          opacity="0.65"
          strokeDasharray="2.5 2.5"
        />
      </g>

      {/* ── 8-pointed star ── */}
      <path d={starPath} fill="url(#starGrad)" />

      {/* ── Star inner highlight ── */}
      <path
        d={starPath}
        fill="none"
        stroke="#fde68a"
        strokeWidth="0.3"
        opacity="0.5"
      />

      {/* ── Center dot ── */}
      <circle
        cx="50"
        cy="50"
        r="2"
        fill="#fde68a"
        opacity="0.95"
      />
      <circle
        cx="50"
        cy="50"
        r="4"
        fill="none"
        stroke="#d4a843"
        strokeWidth="0.5"
        opacity="0.4"
      />

      {/* ── Subtle glow pulse on star (full variant) ── */}
      {variant === "full" && (
        <circle cx="50" cy="50" r="14" fill="#d4a843" opacity="0">
          <animate
            attributeName="opacity"
            values="0;0.06;0"
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values="13;17;13"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
      )}
    </svg>
  );
}
