"use client";

import { useState } from "react";
import { StarField } from "@/components/StarField";
import { AuroraBackground } from "@/components/AuroraBackground";
import { BirthForm } from "@/components/BirthForm";
import { Dashboard } from "@/components/Dashboard";
import type { BirthData, ChartAnalysis } from "@/lib/types";

export default function Home() {
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [analysis, setAnalysis] = useState<ChartAnalysis | null>(null);

  function handleResult(data: BirthData, chart: ChartAnalysis) {
    setBirthData(data);
    setAnalysis(chart);
  }

  function handleReset() {
    setBirthData(null);
    setAnalysis(null);
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16">
      {/* Backgrounds */}
      <StarField />
      <AuroraBackground />

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl">
        {birthData && analysis ? (
          <Dashboard
            birthData={birthData}
            analysis={analysis}
            onReset={handleReset}
          />
        ) : (
          <BirthForm onResult={handleResult} />
        )}
      </div>

      {/* Bottom watermark */}
      <div className="fixed bottom-5 left-0 right-0 flex justify-center pointer-events-none z-10">
        <p className="text-muted-foreground/15 text-[10px] tracking-[0.6em] uppercase select-none">
          celestial insights
        </p>
      </div>
    </main>
  );
}
