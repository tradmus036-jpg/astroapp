"use client";

import { useState } from "react";
import {
  Sparkles,
  TrendingUp,
  Compass,
  ShieldAlert,
  Lightbulb,
  Lock,
  Download,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { CategoryModal } from "@/components/CategoryModal";
import { BorderBeam } from "@/components/ui/border-beam";
import { CelestialLogo } from "@/components/CelestialLogo";
import { downloadCategory } from "@/lib/downloadReport";
import type { BirthData, ChartAnalysis, CategoryKey } from "@/lib/types";

interface DashboardProps {
  birthData: BirthData;
  analysis: ChartAnalysis;
  onReset: () => void;
}

const CATEGORIES: {
  key: CategoryKey;
  title: string;
  subtitle: string;
  tag: string;
  Icon: React.ElementType;
  locked: boolean;
  accent: string;
  iconBg: string;
  borderHover: string;
  beamFrom: string;
  beamTo: string;
}[] = [
  {
    key: "quickSummary",
    title: "Cosmic Identity Matrix",
    subtitle: "Sun, Moon & Ascendant decoded — your astrological fingerprint",
    tag: "Foundation",
    Icon: Sparkles,
    locked: false,
    accent: "from-amber-500/15 via-yellow-500/5 to-transparent",
    iconBg: "bg-amber-400/15 text-amber-300",
    borderHover: "hover:border-amber-400/50",
    beamFrom: "#d4a843",
    beamTo: "#f0cc6a",
  },
  {
    key: "luckyWeeks",
    title: "Fortune Almanac",
    subtitle: "12-month map of your highest-momentum cosmic windows",
    tag: "Timing",
    Icon: TrendingUp,
    locked: false,
    accent: "from-violet-500/15 via-purple-500/5 to-transparent",
    iconBg: "bg-violet-400/15 text-violet-300",
    borderHover: "hover:border-violet-400/50",
    beamFrom: "#8b5cf6",
    beamTo: "#c084fc",
  },
  {
    key: "loveMoneyCareer",
    title: "Life Domain Forecast",
    subtitle: "Precision timing for love, wealth & professional ascension",
    tag: "Domains",
    Icon: Compass,
    locked: false,
    accent: "from-rose-500/15 via-pink-500/5 to-transparent",
    iconBg: "bg-rose-400/15 text-rose-300",
    borderHover: "hover:border-rose-400/50",
    beamFrom: "#f43f5e",
    beamTo: "#fb7185",
  },
  {
    key: "crucialWarnings",
    title: "Shadow Transit Alerts",
    subtitle: "High-stakes periods that demand strategic caution",
    tag: "Caution",
    Icon: ShieldAlert,
    locked: false,
    accent: "from-red-600/15 via-orange-500/5 to-transparent",
    iconBg: "bg-red-500/15 text-red-300",
    borderHover: "hover:border-red-400/50",
    beamFrom: "#ef4444",
    beamTo: "#f97316",
  },
  {
    key: "personalInsights",
    title: "Celestial Action Plan",
    subtitle: "Bespoke prescriptions calibrated to your natal blueprint",
    tag: "Guidance",
    Icon: Lightbulb,
    locked: false,
    accent: "from-sky-500/15 via-cyan-500/5 to-transparent",
    iconBg: "bg-sky-400/15 text-sky-300",
    borderHover: "hover:border-sky-400/50",
    beamFrom: "#0ea5e9",
    beamTo: "#22d3ee",
  },
];

export function Dashboard({ birthData, analysis, onReset }: DashboardProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(null);

  function formatDate(d: string) {
    return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10 animate-fade-up">
        {/* Logo mark */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, oklch(0.78 0.13 55 / 0.15) 0%, transparent 70%)",
                transform: "scale(1.5)",
              }}
            />
            <CelestialLogo size={52} variant="mark" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-400/40" />
          <p className="text-[10px] tracking-[0.6em] uppercase text-amber-400/60 font-medium">
            Reading Complete
          </p>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-400/40" />
        </div>

        <h2 className="text-3xl font-light tracking-[0.25em] mb-1">
          <span className="gold-text font-semibold">YOUR CELESTIAL REPORT</span>
        </h2>

        <div className="mt-3 flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/40" />
          <span className="text-amber-400/50 text-xs">◆</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/40" />
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm">
          <span className="text-muted-foreground/70">{formatDate(birthData.dateOfBirth)}</span>
          <span className="text-amber-400/25">|</span>
          <span className="text-muted-foreground/70">{birthData.timeOfBirth}</span>
          <span className="text-amber-400/25">|</span>
          <span className="text-muted-foreground/70">{birthData.placeOfBirth}</span>
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {CATEGORIES.map((cat, index) => (
          <div
            key={cat.key}
            className={`animate-fade-up ${index === 4 ? "sm:col-span-2 sm:max-w-sm sm:mx-auto w-full" : ""}`}
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <div
              className={`relative rounded-2xl overflow-hidden border border-white/8 ${cat.borderHover} transition-all duration-300 group ${
                cat.locked ? "opacity-60" : "cursor-default"
              } hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:-translate-y-0.5`}
              style={{ background: "oklch(0.14 0.05 275 / 0.85)" }}
            >
              {/* Animated border beam on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <BorderBeam
                  duration={6}
                  colorFrom={cat.beamFrom}
                  colorTo={cat.beamTo}
                  size={70}
                />
              </div>

              {/* Gradient accent */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.accent} pointer-events-none`} />

              {/* Top shimmer line */}
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent group-hover:via-amber-400/50 transition-all duration-500" />

              {/* Content */}
              <div className="relative z-10 p-6">
                {/* Top row */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${cat.iconBg} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <cat.Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/50 font-medium">
                      {cat.tag}
                    </span>
                  </div>

                  {cat.locked ? (
                    <div className="flex items-center gap-1.5 bg-white/8 rounded-full px-2.5 py-1 border border-white/10">
                      <Lock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground tracking-wider">PRO</span>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadCategory(cat.key, birthData, analysis);
                      }}
                      title="Download PDF"
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-400/15 border border-white/10 hover:border-amber-400/40 text-muted-foreground/40 hover:text-amber-300 transition-all duration-200 group/btn"
                    >
                      <Download className="w-3 h-3 group-hover/btn:scale-110 transition-transform duration-200" />
                      <span className="text-[10px] tracking-widest uppercase">PDF</span>
                    </button>
                  )}
                </div>

                {/* Text + CTA */}
                <button
                  disabled={cat.locked}
                  onClick={() => !cat.locked && setActiveCategory(cat.key)}
                  className="w-full text-left"
                >
                  <h3 className="font-semibold text-foreground text-[15px] tracking-wide leading-snug mb-1.5 group-hover:text-amber-100 transition-colors duration-200">
                    {cat.title}
                  </h3>
                  <p className="text-muted-foreground/70 text-[13px] leading-relaxed mb-4">
                    {cat.subtitle}
                  </p>

                  {!cat.locked && (
                    <div className="flex items-center gap-1.5 text-amber-400/50 group-hover:text-amber-400 transition-colors duration-200">
                      <span className="text-[11px] tracking-[0.2em] uppercase font-medium">
                        Open Report
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  )}
                </button>
              </div>

              {/* Locked overlay */}
              {cat.locked && (
                <div className="absolute inset-0 backdrop-blur-[3px] bg-background/40 rounded-2xl flex items-center justify-center">
                  <p className="text-muted-foreground text-[10px] tracking-[0.4em] uppercase">
                    Upgrade to Pro
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Reset */}
      <div
        className="text-center mt-6 animate-fade-up"
        style={{ animationDelay: "0.5s" }}
      >
        <button
          onClick={onReset}
          className="group inline-flex items-center gap-2 text-muted-foreground/40 hover:text-muted-foreground/70 text-[11px] tracking-[0.3em] uppercase transition-all duration-200"
        >
          <RotateCcw className="w-3 h-3 group-hover:-rotate-45 transition-transform duration-300" />
          New Reading
        </button>
      </div>

      <CategoryModal
        open={activeCategory !== null}
        onClose={() => setActiveCategory(null)}
        category={activeCategory}
        analysis={analysis}
      />
    </div>
  );
}
