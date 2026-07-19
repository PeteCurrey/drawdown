import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "GBP") {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
  }).format(amount);
}

export async function copyToClipboard(text: string) {
  if (!navigator.clipboard) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    return false;
  }
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export function getAgentBias(agentData: any): string {
  if (!agentData) return "—";
  return agentData.technical_bias ?? agentData.flow_bias ?? agentData.news_momentum ?? agentData.momentum_signal ?? "—";
}

export function isBiasBullish(bias: string): boolean {
  if (!bias) return false;
  const b = bias.toUpperCase();
  return b === "BULLISH" || b === "ACCELERATING";
}

export function isBiasBearish(bias: string): boolean {
  if (!bias) return false;
  const b = bias.toUpperCase();
  return b === "BEARISH" || b === "FADING";
}
