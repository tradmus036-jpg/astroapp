"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { BorderBeam } from "@/components/ui/border-beam";
import type { ChartAnalysis, CategoryKey } from "@/lib/types";

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  category: CategoryKey | null;
  analysis: ChartAnalysis;
}

const CATEGORY_TAGS: Record<CategoryKey, string> = {
  quickSummary: "Foundation",
  luckyWeeks: "Timing",
  loveMoneyCareer: "Domains",
  crucialWarnings: "Caution",
  personalInsights: "Guidance",
};

const CATEGORY_TITLES: Record<CategoryKey, string> = {
  quickSummary: "Cosmic Identity Matrix",
  luckyWeeks: "Fortune Almanac",
  loveMoneyCareer: "Life Domain Forecast",
  crucialWarnings: "Shadow Transit Alerts",
  personalInsights: "Celestial Action Plan",
};

const CATEGORY_BEAMS: Record<CategoryKey, { from: string; to: string }> = {
  quickSummary: { from: "#d4a843", to: "#f0cc6a" },
  luckyWeeks: { from: "#8b5cf6", to: "#c084fc" },
  loveMoneyCareer: { from: "#f43f5e", to: "#fb7185" },
  crucialWarnings: { from: "#ef4444", to: "#f97316" },
  personalInsights: { from: "#0ea5e9", to: "#22d3ee" },
};

export function CategoryModal({ open, onClose, category, analysis }: CategoryModalProps) {
  const beam = category ? CATEGORY_BEAMS[category] : null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[82vh] overflow-y-auto mystic-card border-amber-400/15 text-foreground p-0 animate-scale-in">
        {/* Animated border beam */}
        {beam && (
          <BorderBeam duration={8} colorFrom={beam.from} colorTo={beam.to} size={120} />
        )}

        {/* Modal header */}
        <DialogHeader className="px-6 pt-6 pb-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] tracking-[0.35em] uppercase font-medium border border-amber-400/20 text-amber-400/70 bg-amber-400/5">
              {category && CATEGORY_TAGS[category]}
            </span>
          </div>
          <DialogTitle className="gold-text text-xl tracking-wide font-semibold leading-snug">
            {category && CATEGORY_TITLES[category]}
          </DialogTitle>
          <div className="mt-3 w-full h-px bg-gradient-to-r from-amber-400/30 via-amber-400/10 to-transparent" />
        </DialogHeader>

        <div className="px-6 pb-6 pt-5 space-y-1">
          {category === "quickSummary" && <QuickSummaryContent data={analysis.quickSummary} />}
          {category === "luckyWeeks" && <LuckyWeeksContent data={analysis.luckyWeeks} />}
          {category === "loveMoneyCareer" && <LoveMoneyCareerContent data={analysis.loveMoneyCareer} />}
          {category === "crucialWarnings" && <CrucialWarningsContent data={analysis.crucialWarnings} />}
          {category === "personalInsights" && <PersonalInsightsContent data={analysis.personalInsights} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function QuickSummaryContent({ data }: { data: ChartAnalysis["quickSummary"] }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Sun Sign", value: data.sunSign },
          { label: "Moon Sign", value: data.moonSign },
          { label: "Ascendant", value: data.ascendant },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl bg-amber-400/5 border border-amber-400/15 p-3 text-center group hover:border-amber-400/40 hover:bg-amber-400/8 transition-all duration-200"
          >
            <p className="text-muted-foreground/60 text-[10px] tracking-[0.25em] mb-1.5 uppercase">
              {item.label}
            </p>
            <p className="gold-text font-semibold text-lg">{item.value}</p>
          </div>
        ))}
      </div>
      <InfoBlock title="Character & Temperament" content={data.corePersonality} />
      <InfoBlock title="Dominant Planetary Influence" content={data.dominantEnergy} />
      <InfoBlock title="Soul Purpose & Life Trajectory" content={data.lifeTheme} />
    </div>
  );
}

function LuckyWeeksContent({ data }: { data: ChartAnalysis["luckyWeeks"] }) {
  const intensityConfig: Record<string, { className: string; dot: string }> = {
    peak: {
      className: "bg-amber-400/15 text-amber-300 border-amber-400/30",
      dot: "#fbbf24",
    },
    high: {
      className: "bg-purple-500/15 text-purple-300 border-purple-400/30",
      dot: "#c084fc",
    },
    medium: {
      className: "bg-blue-500/15 text-blue-300 border-blue-400/30",
      dot: "#60a5fa",
    },
  };

  return (
    <div className="space-y-3">
      {data.map((week, i) => {
        const cfg = intensityConfig[week.intensity] ?? intensityConfig.medium;
        return (
          <div
            key={i}
            className="rounded-xl bg-white/4 border border-white/8 p-4 hover:border-white/15 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-2 gap-2">
              <div>
                <p className="font-medium text-foreground text-sm leading-snug">{week.theme}</p>
                <p className="text-muted-foreground/50 text-xs mt-0.5">
                  {week.startDate} — {week.endDate}
                </p>
              </div>
              <Badge className={`text-[10px] border shrink-0 ${cfg.className}`}>
                {week.intensity.toUpperCase()}
              </Badge>
            </div>
            <p className="text-muted-foreground/70 text-sm leading-relaxed">{week.description}</p>
          </div>
        );
      })}
    </div>
  );
}

function LoveMoneyCareerContent({ data }: { data: ChartAnalysis["loveMoneyCareer"] }) {
  const sections = [
    { icon: "♡", label: "Love", windows: data.love, color: "text-rose-400", border: "border-rose-400/20", bg: "bg-rose-400/5" },
    { icon: "◈", label: "Money", windows: data.money, color: "text-amber-400", border: "border-amber-400/20", bg: "bg-amber-400/5" },
    { icon: "◉", label: "Career", windows: data.career, color: "text-sky-400", border: "border-sky-400/20", bg: "bg-sky-400/5" },
  ];

  return (
    <div className="space-y-6">
      {sections.map(({ icon, label, windows, color, border, bg }) => (
        <div key={label}>
          <h3 className={`flex items-center gap-2 ${color} font-semibold tracking-wider mb-3 text-sm`}>
            <span className="text-base">{icon}</span>
            {label.toUpperCase()}
          </h3>
          <div className={`space-y-3 pl-4 border-l ${border}`}>
            {windows.map((w, i) => (
              <div key={i} className={`rounded-lg ${bg} border ${border} p-3.5`}>
                <p className="text-sm font-medium text-foreground/90 mb-1">
                  {w.startDate} — {w.endDate}
                  {w.peakDay && (
                    <span className="text-amber-400 ml-2 text-xs font-normal">
                      Peak: {w.peakDay}
                    </span>
                  )}
                </p>
                <p className="text-muted-foreground/70 text-sm mb-2.5 leading-relaxed">
                  {w.description}
                </p>
                <p className="text-xs text-amber-300/70 italic">→ {w.actionableAdvice}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function CrucialWarningsContent({ data }: { data: ChartAnalysis["crucialWarnings"] }) {
  return (
    <div className="space-y-3">
      {data.map((w, i) => (
        <div key={i} className="rounded-xl bg-red-950/25 border border-red-500/20 p-4 hover:border-red-500/35 transition-all duration-200">
          <div className="flex items-start gap-2 mb-2">
            <span className="text-red-400 mt-0.5 shrink-0">⚠</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className="font-medium text-foreground text-sm">{w.topic}</p>
                <span className="text-muted-foreground/50 text-xs shrink-0">
                  {w.startDate} — {w.endDate}
                </span>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground/70 text-sm mb-2.5 leading-relaxed pl-6">
            {w.description}
          </p>
          <p className="text-xs text-red-300/70 italic pl-6">→ {w.avoidance}</p>
        </div>
      ))}
    </div>
  );
}

function PersonalInsightsContent({ data }: { data: ChartAnalysis["personalInsights"] }) {
  return (
    <div className="space-y-3">
      {data.map((insight, i) => (
        <div key={i} className="rounded-xl bg-white/4 border border-purple-400/15 p-4 hover:border-purple-400/30 transition-all duration-200">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge className="bg-purple-500/15 text-purple-300 border-purple-400/30 border text-[10px] shrink-0">
              {insight.category}
            </Badge>
            <p className="font-medium text-foreground text-sm">{insight.title}</p>
          </div>
          <p className="text-muted-foreground/70 text-sm leading-relaxed mb-3">
            {insight.description}
          </p>
          <div className="rounded-lg bg-amber-400/8 border border-amber-400/20 px-3.5 py-2.5">
            <p className="text-[10px] text-amber-400/80 font-semibold tracking-widest uppercase mb-1">
              Action Step
            </p>
            <p className="text-sm text-amber-100/75">{insight.actionableStep}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function InfoBlock({ title, content }: { title: string; content: string }) {
  return (
    <div className="rounded-xl bg-white/4 border border-white/8 p-4 hover:border-white/15 transition-all duration-200">
      <p className="text-muted-foreground/50 text-[10px] tracking-[0.25em] uppercase mb-2">
        {title}
      </p>
      <p className="text-foreground/85 text-sm leading-relaxed">{content}</p>
    </div>
  );
}
