import type { BirthData, ChartAnalysis, CategoryKey } from "@/lib/types";

const BRAND = "CELESTIAL INSIGHTS";
const TAGLINE = "Personal Birth Chart Report";

function pageStyle() {
  return `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Inter:wght@300;400;500&display=swap');

      * { margin: 0; padding: 0; box-sizing: border-box; }

      body {
        font-family: 'Inter', sans-serif;
        background: #0a0a14;
        color: #d4cfe8;
        min-height: 100vh;
        padding: 48px;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      @page {
        margin: 24mm 18mm;
        size: A4;
      }

      @media print {
        body { padding: 0; background: #0a0a14; }
        .no-print { display: none !important; }
        .page-break { page-break-before: always; }
      }

      .page {
        max-width: 760px;
        margin: 0 auto;
      }

      /* Header */
      .header {
        text-align: center;
        padding-bottom: 32px;
        border-bottom: 1px solid rgba(196,163,69,0.25);
        margin-bottom: 36px;
      }
      .brand {
        font-family: 'Cormorant Garamond', serif;
        font-size: 11px;
        letter-spacing: 0.5em;
        color: #b8952e;
        text-transform: uppercase;
        margin-bottom: 10px;
      }
      .report-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: 32px;
        font-weight: 300;
        color: #ede8d8;
        letter-spacing: 0.05em;
        line-height: 1.2;
        margin-bottom: 6px;
      }
      .report-subtitle {
        font-size: 12px;
        color: #7a738f;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        margin-bottom: 20px;
      }
      .birth-meta {
        display: inline-flex;
        gap: 0;
        background: rgba(196,163,69,0.06);
        border: 1px solid rgba(196,163,69,0.2);
        border-radius: 8px;
        overflow: hidden;
      }
      .birth-meta-item {
        padding: 8px 20px;
        font-size: 11.5px;
        color: #a89ec0;
        letter-spacing: 0.05em;
        border-right: 1px solid rgba(196,163,69,0.15);
      }
      .birth-meta-item:last-child { border-right: none; }
      .birth-meta-item span {
        display: block;
        font-size: 9px;
        color: #b8952e;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        margin-bottom: 3px;
      }
      .generated {
        margin-top: 12px;
        font-size: 10px;
        color: #4a4560;
        letter-spacing: 0.1em;
      }

      /* Section header */
      .section-header {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 20px;
      }
      .section-symbol {
        font-size: 22px;
        color: #c4a345;
        line-height: 1;
      }
      .section-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: 20px;
        font-weight: 400;
        color: #ede8d8;
        letter-spacing: 0.05em;
      }
      .section-divider {
        flex: 1;
        height: 1px;
        background: linear-gradient(to right, rgba(196,163,69,0.3), transparent);
      }

      /* Info blocks */
      .info-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        margin-bottom: 20px;
      }
      .info-pill {
        background: rgba(196,163,69,0.07);
        border: 1px solid rgba(196,163,69,0.18);
        border-radius: 10px;
        padding: 14px 16px;
        text-align: center;
      }
      .info-pill-label {
        font-size: 9px;
        color: #b8952e;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        margin-bottom: 6px;
      }
      .info-pill-value {
        font-family: 'Cormorant Garamond', serif;
        font-size: 18px;
        font-weight: 600;
        color: #e8d898;
      }

      .text-block {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 10px;
        padding: 16px 20px;
        margin-bottom: 12px;
      }
      .text-block-label {
        font-size: 9px;
        color: #b8952e;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        margin-bottom: 8px;
      }
      .text-block-content {
        font-size: 13.5px;
        line-height: 1.75;
        color: #b8b0cc;
      }

      /* Timeline items */
      .timeline-item {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.07);
        border-left: 3px solid rgba(196,163,69,0.5);
        border-radius: 0 10px 10px 0;
        padding: 16px 20px;
        margin-bottom: 12px;
      }
      .timeline-item.warning {
        border-left-color: rgba(220,60,60,0.6);
        background: rgba(180,30,30,0.06);
        border-color: rgba(200,60,60,0.15);
      }
      .timeline-item-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 8px;
        gap: 12px;
      }
      .timeline-item-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: 16px;
        color: #ede8d8;
      }
      .timeline-date {
        font-size: 10.5px;
        color: #7a738f;
        letter-spacing: 0.05em;
        white-space: nowrap;
        margin-top: 2px;
      }
      .badge {
        display: inline-block;
        padding: 2px 10px;
        border-radius: 20px;
        font-size: 9px;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        white-space: nowrap;
      }
      .badge-peak { background: rgba(196,163,69,0.15); color: #c4a345; border: 1px solid rgba(196,163,69,0.3); }
      .badge-high { background: rgba(140,80,200,0.15); color: #a87ce0; border: 1px solid rgba(140,80,200,0.3); }
      .badge-medium { background: rgba(60,120,200,0.12); color: #7aabdc; border: 1px solid rgba(60,120,200,0.25); }

      .timeline-desc {
        font-size: 13px;
        line-height: 1.7;
        color: #a09ab8;
        margin-bottom: 10px;
      }
      .action-step {
        background: rgba(196,163,69,0.07);
        border-radius: 6px;
        padding: 8px 12px;
        font-size: 12px;
        color: #c4a345;
        display: flex;
        gap: 8px;
        align-items: flex-start;
      }
      .action-step::before { content: "→"; flex-shrink: 0; }

      /* Sub-sections (Love/Money/Career) */
      .sub-section {
        margin-bottom: 24px;
      }
      .sub-section-header {
        font-size: 10px;
        letter-spacing: 0.3em;
        text-transform: uppercase;
        color: #c4a345;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .sub-section-header::after {
        content: '';
        flex: 1;
        height: 1px;
        background: rgba(196,163,69,0.15);
      }

      /* Insight card */
      .insight-card {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(120,80,200,0.18);
        border-radius: 10px;
        padding: 16px 20px;
        margin-bottom: 12px;
      }
      .insight-category {
        display: inline-block;
        padding: 2px 10px;
        border-radius: 20px;
        font-size: 9px;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        background: rgba(120,80,200,0.15);
        color: #a87ce0;
        border: 1px solid rgba(120,80,200,0.25);
        margin-bottom: 8px;
      }
      .insight-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: 16px;
        color: #ede8d8;
        margin-bottom: 8px;
      }
      .insight-desc {
        font-size: 13px;
        line-height: 1.7;
        color: #a09ab8;
        margin-bottom: 10px;
      }

      /* Footer */
      .footer {
        margin-top: 48px;
        padding-top: 20px;
        border-top: 1px solid rgba(196,163,69,0.15);
        text-align: center;
        font-size: 10px;
        color: #3a3550;
        letter-spacing: 0.1em;
      }

      /* Print button */
      .print-bar {
        position: fixed;
        bottom: 24px;
        right: 24px;
        display: flex;
        gap: 10px;
        z-index: 999;
      }
      .print-btn {
        background: linear-gradient(135deg, #c4a345, #e8c96a);
        color: #0a0a14;
        border: none;
        padding: 12px 24px;
        border-radius: 10px;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(196,163,69,0.35);
        font-family: 'Inter', sans-serif;
      }
      .close-btn {
        background: rgba(255,255,255,0.08);
        color: #a09ab8;
        border: 1px solid rgba(255,255,255,0.1);
        padding: 12px 20px;
        border-radius: 10px;
        font-size: 12px;
        cursor: pointer;
        font-family: 'Inter', sans-serif;
      }
    </style>
  `;
}

function reportHeader(birthData: BirthData, sectionTitle: string) {
  const generated = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return `
    <div class="header">
      <div class="brand">✦ ${BRAND} ✦</div>
      <div class="report-title">${sectionTitle}</div>
      <div class="report-subtitle">${TAGLINE}</div>
      <div class="birth-meta">
        <div class="birth-meta-item"><span>Date of Birth</span>${birthData.dateOfBirth}</div>
        <div class="birth-meta-item"><span>Time of Birth</span>${birthData.timeOfBirth}</div>
        <div class="birth-meta-item"><span>Place of Birth</span>${birthData.placeOfBirth}</div>
      </div>
      <div class="generated">Generated on ${generated}</div>
    </div>
  `;
}

function printButtons() {
  return `
    <div class="print-bar no-print">
      <button class="close-btn" onclick="window.close()">Close</button>
      <button class="print-btn" onclick="window.print()">⬇ Save as PDF</button>
    </div>
  `;
}

function openPrintWindow(html: string) {
  const win = window.open("", "_blank", "width=860,height=960");
  if (!win) return;
  win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Celestial Report</title>${pageStyle()}</head><body><div class="page">${html}${printButtons()}</div></body></html>`);
  win.document.close();
}

// ─── Per-category generators ────────────────────────────────────────────────

export function downloadQuickSummary(birthData: BirthData, analysis: ChartAnalysis) {
  const qs = analysis.quickSummary;
  const body = `
    ${reportHeader(birthData, "Quick Summary")}
    <div class="section-header">
      <span class="section-symbol">✦</span>
      <span class="section-title">Your Cosmic Blueprint</span>
      <div class="section-divider"></div>
    </div>

    <div class="info-grid">
      <div class="info-pill"><div class="info-pill-label">Sun Sign</div><div class="info-pill-value">${qs.sunSign}</div></div>
      <div class="info-pill"><div class="info-pill-label">Moon Sign</div><div class="info-pill-value">${qs.moonSign}</div></div>
      <div class="info-pill"><div class="info-pill-label">Ascendant</div><div class="info-pill-value">${qs.ascendant}</div></div>
    </div>

    <div class="text-block">
      <div class="text-block-label">Core Personality</div>
      <div class="text-block-content">${qs.corePersonality}</div>
    </div>
    <div class="text-block">
      <div class="text-block-label">Dominant Energy</div>
      <div class="text-block-content">${qs.dominantEnergy}</div>
    </div>
    <div class="text-block">
      <div class="text-block-label">Life Theme</div>
      <div class="text-block-content">${qs.lifeTheme}</div>
    </div>

    <div class="footer">Celestial Insights · Personal use only · celestialinsights.app</div>
  `;
  openPrintWindow(body);
}

export function downloadLuckyWeeks(birthData: BirthData, analysis: ChartAnalysis) {
  const weeks = analysis.luckyWeeks;
  const items = weeks.map((w) => `
    <div class="timeline-item">
      <div class="timeline-item-header">
        <div>
          <div class="timeline-item-title">${w.theme}</div>
          <div class="timeline-date">${w.startDate} — ${w.endDate}</div>
        </div>
        <span class="badge badge-${w.intensity}">${w.intensity}</span>
      </div>
      <div class="timeline-desc">${w.description}</div>
    </div>
  `).join("");

  const body = `
    ${reportHeader(birthData, "Lucky Weeks Countdown")}
    <div class="section-header">
      <span class="section-symbol">◐</span>
      <span class="section-title">Your Highest-Power Windows</span>
      <div class="section-divider"></div>
    </div>
    ${items}
    <div class="footer">Celestial Insights · Personal use only · celestialinsights.app</div>
  `;
  openPrintWindow(body);
}

export function downloadLoveMoneyCareer(birthData: BirthData, analysis: ChartAnalysis) {
  const { love, money, career } = analysis.loveMoneyCareer;

  function renderWindows(windows: typeof love) {
    return windows.map((w) => `
      <div class="timeline-item">
        <div class="timeline-item-header">
          <div>
            <div class="timeline-date">${w.startDate} — ${w.endDate}${w.peakDay ? ` &nbsp;·&nbsp; Peak: <strong style="color:#c4a345">${w.peakDay}</strong>` : ""}</div>
          </div>
        </div>
        <div class="timeline-desc">${w.description}</div>
        <div class="action-step">${w.actionableAdvice}</div>
      </div>
    `).join("");
  }

  const body = `
    ${reportHeader(birthData, "Love · Money · Career Timing")}
    <div class="section-header">
      <span class="section-symbol">◈</span>
      <span class="section-title">Best Timing for Each Domain</span>
      <div class="section-divider"></div>
    </div>

    <div class="sub-section">
      <div class="sub-section-header">♡ &nbsp; Love</div>
      ${renderWindows(love)}
    </div>

    <div class="sub-section">
      <div class="sub-section-header">◈ &nbsp; Money</div>
      ${renderWindows(money)}
    </div>

    <div class="sub-section">
      <div class="sub-section-header">◉ &nbsp; Career</div>
      ${renderWindows(career)}
    </div>

    <div class="footer">Celestial Insights · Personal use only · celestialinsights.app</div>
  `;
  openPrintWindow(body);
}

export function downloadWarnings(birthData: BirthData, analysis: ChartAnalysis) {
  const warnings = analysis.crucialWarnings;
  const items = warnings.map((w) => `
    <div class="timeline-item warning">
      <div class="timeline-item-header">
        <div>
          <div class="timeline-item-title" style="color:#e07070">⚠ &nbsp;${w.topic}</div>
          <div class="timeline-date">${w.startDate} — ${w.endDate}</div>
        </div>
      </div>
      <div class="timeline-desc">${w.description}</div>
      <div class="action-step" style="background:rgba(220,60,60,0.08);color:#e07070">${w.avoidance}</div>
    </div>
  `).join("");

  const body = `
    ${reportHeader(birthData, "Crucial Warnings")}
    <div class="section-header">
      <span class="section-symbol" style="color:#e07070">⚠</span>
      <span class="section-title">Dates to Tread Carefully</span>
      <div class="section-divider"></div>
    </div>
    ${items}
    <div class="footer">Celestial Insights · Personal use only · celestialinsights.app</div>
  `;
  openPrintWindow(body);
}

export function downloadPersonalInsights(birthData: BirthData, analysis: ChartAnalysis) {
  const insights = analysis.personalInsights;
  const items = insights.map((ins) => `
    <div class="insight-card">
      <div class="insight-category">${ins.category}</div>
      <div class="insight-title">${ins.title}</div>
      <div class="insight-desc">${ins.description}</div>
      <div class="action-step">${ins.actionableStep}</div>
    </div>
  `).join("");

  const body = `
    ${reportHeader(birthData, "Personal Insights")}
    <div class="section-header">
      <span class="section-symbol">◉</span>
      <span class="section-title">Actionable Steps Just for You</span>
      <div class="section-divider"></div>
    </div>
    ${items}
    <div class="footer">Celestial Insights · Personal use only · celestialinsights.app</div>
  `;
  openPrintWindow(body);
}

// ─── Category key → function map ────────────────────────────────────────────

export function downloadCategory(
  key: CategoryKey,
  birthData: BirthData,
  analysis: ChartAnalysis
) {
  switch (key) {
    case "quickSummary":      return downloadQuickSummary(birthData, analysis);
    case "luckyWeeks":        return downloadLuckyWeeks(birthData, analysis);
    case "loveMoneyCareer":   return downloadLoveMoneyCareer(birthData, analysis);
    case "crucialWarnings":   return downloadWarnings(birthData, analysis);
    case "personalInsights":  return downloadPersonalInsights(birthData, analysis);
  }
}
