const STORAGE_KEY = "wnetrzeai_usage";
const FREE_LIMIT = 3;

interface UsageData {
  count: number;
  month: string; // "YYYY-MM"
}

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function getUsageData(): UsageData {
  if (typeof window === "undefined") return { count: 0, month: getCurrentMonth() };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { count: 0, month: getCurrentMonth() };
    const data: UsageData = JSON.parse(raw);
    // Auto-reset if month changed
    if (data.month !== getCurrentMonth()) {
      return { count: 0, month: getCurrentMonth() };
    }
    return data;
  } catch {
    return { count: 0, month: getCurrentMonth() };
  }
}

function saveUsageData(data: UsageData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getRemainingRenders(): number {
  const data = getUsageData();
  return Math.max(0, FREE_LIMIT - data.count);
}

export function getUsedRenders(): number {
  return getUsageData().count;
}

export function canRender(): boolean {
  return getRemainingRenders() > 0;
}

export function incrementUsage(): void {
  const data = getUsageData();
  data.count += 1;
  saveUsageData(data);
}

export const FREE_RENDER_LIMIT = FREE_LIMIT;
