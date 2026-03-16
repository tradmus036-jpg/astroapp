import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { BirthData, ChartAnalysis } from "@/lib/types";

// Fail fast if API key is missing
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is not set");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Simple in-memory rate limiter: 5 requests per IP per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count++;
  return false;
}

const SYSTEM_PROMPT = `You are an expert astrologer with deep knowledge of natal charts, transits, and predictive astrology.
When given a person's birth date, time, and place, you calculate their chart and provide a detailed analysis.
You ALWAYS respond in valid JSON matching the exact schema provided.
All content is in English. Be specific, actionable, and insightful — not generic.
Base all date predictions on the current year (${new Date().getFullYear()}) and next 12 months.`;

function buildUserPrompt(data: BirthData): string {
  return `Analyze the birth chart for:
- Date of Birth: ${data.dateOfBirth}
- Time of Birth: ${data.timeOfBirth}
- Place of Birth: ${data.placeOfBirth}

Respond with a JSON object matching this exact schema:
{
  "quickSummary": {
    "sunSign": "string",
    "moonSign": "string",
    "ascendant": "string",
    "corePersonality": "2-3 sentence description of core personality traits",
    "dominantEnergy": "2-3 sentences on the dominant planetary energy and how it manifests",
    "lifeTheme": "2-3 sentences on the overarching life theme and soul purpose"
  },
  "luckyWeeks": [
    {
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "theme": "short theme title",
      "description": "2-3 sentences describing this lucky window and what energies are active",
      "intensity": "peak | high | medium"
    }
  ],
  "loveMoneyCareer": {
    "love": [
      {
        "startDate": "YYYY-MM-DD",
        "endDate": "YYYY-MM-DD",
        "description": "2 sentences describing this love timing window",
        "actionableAdvice": "one concrete action to take",
        "peakDay": "YYYY-MM-DD or null"
      }
    ],
    "money": [
      {
        "startDate": "YYYY-MM-DD",
        "endDate": "YYYY-MM-DD",
        "description": "2 sentences describing this financial timing window",
        "actionableAdvice": "one concrete action to take",
        "peakDay": "YYYY-MM-DD or null"
      }
    ],
    "career": [
      {
        "startDate": "YYYY-MM-DD",
        "endDate": "YYYY-MM-DD",
        "description": "2 sentences describing this career timing window",
        "actionableAdvice": "one concrete action to take",
        "peakDay": "YYYY-MM-DD or null"
      }
    ]
  },
  "crucialWarnings": [
    {
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "topic": "short topic title (e.g. Financial Caution, Communication Breakdown)",
      "description": "2 sentences explaining the astrological challenge",
      "avoidance": "one concrete thing to avoid or be careful about"
    }
  ],
  "personalInsights": [
    {
      "title": "insight title",
      "description": "2-3 sentences of personal insight based on the natal chart",
      "actionableStep": "one specific, practical action step",
      "category": "Mindset | Relationships | Health | Finances | Creativity | Spirituality"
    }
  ]
}

Requirements:
- luckyWeeks: 4-6 entries spanning the next 12 months
- loveMoneyCareer: 2-3 entries each
- crucialWarnings: 3-4 entries
- personalInsights: 5 entries with varied categories
- All dates in YYYY-MM-DD format
- Be specific and personalized, not generic horoscope text`;
}

function isValidChartAnalysis(data: unknown): data is ChartAnalysis {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.quickSummary === "object" && d.quickSummary !== null &&
    Array.isArray(d.luckyWeeks) &&
    typeof d.loveMoneyCareer === "object" && d.loveMoneyCareer !== null &&
    Array.isArray(d.crucialWarnings) &&
    Array.isArray(d.personalInsights)
  );
}

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute before trying again." },
      { status: 429 }
    );
  }

  // Origin check (CSRF protection)
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host && !origin.includes(host)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body: BirthData = await req.json();

    if (!body.dateOfBirth || !body.timeOfBirth || !body.placeOfBirth) {
      return NextResponse.json(
        { error: "Missing required fields: dateOfBirth, timeOfBirth, placeOfBirth" },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitized: BirthData = {
      dateOfBirth: String(body.dateOfBirth).slice(0, 20),
      timeOfBirth: String(body.timeOfBirth).slice(0, 10),
      placeOfBirth: String(body.placeOfBirth).slice(0, 100),
    };

    // 60 second timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60_000);

    let raw: string | null = null;
    try {
      const completion = await openai.chat.completions.create(
        {
          model: "gpt-4o",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: buildUserPrompt(sanitized) },
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
          max_tokens: 3000,
        },
        { signal: controller.signal }
      );
      raw = completion.choices[0]?.message?.content ?? null;
    } finally {
      clearTimeout(timeout);
    }

    if (!raw) {
      return NextResponse.json({ error: "Empty response from model" }, { status: 502 });
    }

    let analysis: unknown;
    try {
      analysis = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: "Invalid response format from model" }, { status: 502 });
    }

    if (!isValidChartAnalysis(analysis)) {
      return NextResponse.json({ error: "Incomplete response from model. Please try again." }, { status: 502 });
    }

    return NextResponse.json(analysis);
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json({ error: "Request timed out. Please try again." }, { status: 504 });
    }
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
