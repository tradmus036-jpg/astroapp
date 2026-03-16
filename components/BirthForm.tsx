"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, Calendar, Clock, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { BorderBeam } from "@/components/ui/border-beam";
import { CelestialLoader } from "@/components/CelestialLoader";
import { CelestialLogo } from "@/components/CelestialLogo";
import type { BirthData, ChartAnalysis } from "@/lib/types";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function MonthPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const label = value ? MONTHS[parseInt(value) - 1] : "Month";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full h-11 px-3 rounded-lg border border-white/10 bg-white/5 text-sm text-left flex items-center justify-between transition-all duration-200 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/20 hover:border-white/20 hover:bg-white/8"
        style={{ color: value ? "inherit" : "rgba(255,255,255,0.3)" }}
      >
        <span>{label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-muted-foreground/50 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute z-50 mt-1.5 w-full rounded-xl border border-white/10 overflow-hidden shadow-2xl animate-scale-in"
          style={{ background: "#0d0a1e", backdropFilter: "blur(16px)" }}
        >
          <div className="max-h-52 overflow-y-auto">
            {MONTHS.map((m, i) => (
              <button
                key={m}
                type="button"
                onClick={() => { onChange(String(i + 1)); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-amber-400/10 hover:text-amber-200 ${
                  value === String(i + 1)
                    ? "text-amber-300 bg-amber-400/10 font-medium"
                    : "text-foreground"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface BirthFormProps {
  onResult: (data: BirthData, analysis: ChartAnalysis) => void;
}

interface FieldErrors {
  dateOfBirth?: string;
  timeOfBirth?: string;
  placeOfBirth?: string;
}

interface DateParts {
  day: string;
  month: string;
  year: string;
}

export function BirthForm({ onResult }: BirthFormProps) {
  const [dateParts, setDateParts] = useState<DateParts>({ day: "", month: "", year: "" });
  const [form, setForm] = useState<BirthData>({
    dateOfBirth: "",
    timeOfBirth: "",
    placeOfBirth: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  function buildDateString(parts: DateParts): string {
    if (!parts.year || !parts.month || !parts.day) return "";
    const y = parts.year.padStart(4, "0");
    const m = parts.month.padStart(2, "0");
    const d = parts.day.padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function handleDatePart(field: keyof DateParts, value: string) {
    const updated = { ...dateParts, [field]: value };
    setDateParts(updated);
    setForm((prev) => ({ ...prev, dateOfBirth: buildDateString(updated) }));
  }

  function validate(): boolean {
    const newErrors: FieldErrors = {};

    if (!form.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required.";
    } else {
      // Validate the date is actually real (e.g. not Feb 30)
      const parsed = new Date(form.dateOfBirth);
      if (isNaN(parsed.getTime())) {
        newErrors.dateOfBirth = "Please enter a valid date.";
      }
    }

    if (!form.timeOfBirth) {
      newErrors.timeOfBirth = "Exact birth time is required for accurate readings.";
    } else {
      const [hh, mm] = form.timeOfBirth.split(":").map(Number);
      if (isNaN(hh) || isNaN(mm) || hh < 0 || hh > 23 || mm < 0 || mm > 59) {
        newErrors.timeOfBirth = "Please enter a valid time (00:00 – 23:59).";
      }
    }

    if (!form.placeOfBirth.trim()) {
      newErrors.placeOfBirth = "Place of birth is required.";
    } else if (form.placeOfBirth.trim().length < 2) {
      newErrors.placeOfBirth = "Please enter a valid city and country.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return; // prevent duplicate submissions
    if (!validate()) return;

    setLoading(true);
    setApiError("");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60_000);

    try {
      const res = await fetch("/api/chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Something went wrong. Please try again.");
      }

      const analysis: ChartAnalysis = await res.json();
      onResult(form, analysis);
    } catch (err) {
      clearTimeout(timeout);
      if (err instanceof Error && err.name === "AbortError") {
        setApiError("Request timed out. Please try again.");
      } else {
        setApiError(err instanceof Error ? err.message : "Unexpected error occurred.");
      }
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto animate-fade-up">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex justify-center mb-5">
          <div className="relative">
            {/* Outer soft glow */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, oklch(0.78 0.13 55 / 0.18) 0%, transparent 70%)",
                transform: "scale(1.4)",
              }}
            />
            <CelestialLogo size={88} variant="full" />
          </div>
        </div>

        <h1 className="text-4xl font-light tracking-widest mb-2">
          <span className="gold-text font-semibold">CELESTIAL</span>
        </h1>
        <p className="text-muted-foreground text-sm tracking-[0.35em] uppercase">
          Celestial Intelligence, Personalized
        </p>

        <div className="mt-4 flex items-center justify-center gap-3">
          <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent to-amber-400/40" />
          <span className="text-amber-400/50 text-[10px]">◆</span>
          <div className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-transparent to-amber-400/40" />
        </div>

        <p className="mt-4 text-muted-foreground/70 text-sm leading-relaxed max-w-xs mx-auto">
          Enter your birth details to unlock a personalized reading of your cosmic blueprint.
        </p>
      </div>

      {/* Form card / Loader */}
      <div className="relative rounded-2xl mystic-card overflow-hidden">
        {/* BorderBeam animated border */}
        <BorderBeam duration={12} colorFrom="#d4a843" colorTo="#9b59b6" size={100} />

        {loading ? (
          <div className="animate-scale-in">
            <CelestialLoader />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Date of Birth */}
            <div className="space-y-2">
              <Label className="text-xs tracking-[0.25em] text-muted-foreground/80 flex items-center gap-2 uppercase">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Date of Birth
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  type="number"
                  placeholder="Day"
                  min={1}
                  max={31}
                  value={dateParts.day}
                  onChange={(e) => handleDatePart("day", e.target.value)}
                  className="bg-white/5 border-white/10 focus:border-amber-400/60 focus:ring-amber-400/20 text-foreground placeholder:text-muted-foreground/30 h-11 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none hover:border-white/20 transition-colors"
                />
                <MonthPicker value={dateParts.month} onChange={(v) => handleDatePart("month", v)} />
                <Input
                  type="number"
                  placeholder="Year"
                  min={1900}
                  max={new Date().getFullYear()}
                  value={dateParts.year}
                  onChange={(e) => handleDatePart("year", e.target.value)}
                  className="bg-white/5 border-white/10 focus:border-amber-400/60 focus:ring-amber-400/20 text-foreground placeholder:text-muted-foreground/30 h-11 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none hover:border-white/20 transition-colors"
                />
              </div>
              {errors.dateOfBirth && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <span>⚠</span> {errors.dateOfBirth}
                </p>
              )}
            </div>

            {/* Time of Birth */}
            <div className="space-y-2">
              <Label className="text-xs tracking-[0.25em] text-muted-foreground/80 flex items-center gap-2 uppercase">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Time of Birth
                <span className="ml-auto text-amber-400/80 text-[10px] font-medium tracking-widest border border-amber-400/30 rounded px-1.5 py-0.5">
                  REQUIRED
                </span>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="HH"
                  min={0}
                  max={23}
                  value={form.timeOfBirth ? form.timeOfBirth.split(":")[0] : ""}
                  onChange={(e) => {
                    const hh = e.target.value.padStart(2, "0");
                    const mm = form.timeOfBirth ? form.timeOfBirth.split(":")[1] || "00" : "00";
                    setForm({ ...form, timeOfBirth: `${hh}:${mm}` });
                  }}
                  className="bg-white/5 border-white/10 focus:border-amber-400/60 focus:ring-amber-400/20 text-foreground placeholder:text-muted-foreground/30 h-11 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none hover:border-white/20 transition-colors"
                />
                <span className="text-muted-foreground/40 text-xl font-light select-none">:</span>
                <Input
                  type="number"
                  placeholder="MM"
                  min={0}
                  max={59}
                  value={form.timeOfBirth ? form.timeOfBirth.split(":")[1] || "" : ""}
                  onChange={(e) => {
                    const hh = form.timeOfBirth ? form.timeOfBirth.split(":")[0] || "00" : "00";
                    const mm = e.target.value.padStart(2, "0");
                    setForm({ ...form, timeOfBirth: `${hh}:${mm}` });
                  }}
                  className="bg-white/5 border-white/10 focus:border-amber-400/60 focus:ring-amber-400/20 text-foreground placeholder:text-muted-foreground/30 h-11 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none hover:border-white/20 transition-colors"
                />
              </div>
              {errors.timeOfBirth ? (
                <p className="text-red-400 text-xs flex items-center gap-1">
                  <span>⚠</span> {errors.timeOfBirth}
                </p>
              ) : (
                <p className="text-muted-foreground/40 text-xs">
                  Exact birth time ensures accurate Ascendant & House calculations.
                </p>
              )}
            </div>

            {/* Place of Birth */}
            <div className="space-y-2">
              <Label
                htmlFor="placeOfBirth"
                className="text-xs tracking-[0.25em] text-muted-foreground/80 flex items-center gap-2 uppercase"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Place of Birth
              </Label>
              <Input
                id="placeOfBirth"
                type="text"
                placeholder="City, Country"
                value={form.placeOfBirth}
                onChange={(e) => setForm({ ...form, placeOfBirth: e.target.value })}
                className="bg-white/5 border-white/10 focus:border-amber-400/60 focus:ring-amber-400/20 text-foreground placeholder:text-muted-foreground/30 h-11 hover:border-white/20 transition-colors"
              />
              {errors.placeOfBirth && (
                <p className="text-red-400 text-xs flex items-center gap-1">
                  <span>⚠</span> {errors.placeOfBirth}
                </p>
              )}
            </div>

            {apiError && (
              <div className="rounded-xl bg-red-500/8 border border-red-500/20 px-4 py-3 text-red-400 text-sm flex items-start gap-2">
                <span className="mt-0.5 shrink-0">⚠</span>
                <span>{apiError}</span>
              </div>
            )}

            <ShimmerButton type="submit" disabled={loading}>
              REVEAL MY CHART
            </ShimmerButton>
          </form>
        )}
      </div>

      <p className="text-center text-muted-foreground/30 text-xs mt-5 tracking-wide">
        Your data is never stored or shared.
      </p>
    </div>
  );
}
