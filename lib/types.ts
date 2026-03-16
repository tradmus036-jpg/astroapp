export interface BirthData {
  dateOfBirth: string;   // YYYY-MM-DD
  timeOfBirth: string;   // HH:MM
  placeOfBirth: string;
}

export interface QuickSummary {
  sunSign: string;
  moonSign: string;
  ascendant: string;
  corePersonality: string;
  dominantEnergy: string;
  lifeTheme: string;
}

export interface LuckyWeek {
  startDate: string;
  endDate: string;
  theme: string;
  description: string;
  intensity: "high" | "medium" | "peak";
}

export interface TimingWindow {
  startDate: string;
  endDate: string;
  description: string;
  actionableAdvice: string;
  peakDay?: string;
}

export interface LoveMoneyCareer {
  love: TimingWindow[];
  money: TimingWindow[];
  career: TimingWindow[];
}

export interface CrucialWarning {
  startDate: string;
  endDate: string;
  topic: string;
  description: string;
  avoidance: string;
}

export interface PersonalInsight {
  title: string;
  description: string;
  actionableStep: string;
  category: string;
}

export interface ChartAnalysis {
  quickSummary: QuickSummary;
  luckyWeeks: LuckyWeek[];
  loveMoneyCareer: LoveMoneyCareer;
  crucialWarnings: CrucialWarning[];
  personalInsights: PersonalInsight[];
}

export type CategoryKey = "quickSummary" | "luckyWeeks" | "loveMoneyCareer" | "crucialWarnings" | "personalInsights";

export interface Category {
  key: CategoryKey;
  title: string;
  subtitle: string;
  icon: string;
  locked: boolean;
  gradient: string;
}
