// Exchange rate gap calculator — compares an official/regulated rate against
// a parallel/P2P rate (Binance P2P, dólar blue, etc). Unlike PayPal fees or
// SDLT bands, these rates change constantly and have no fixed "current" value,
// so the user supplies both rates directly rather than the tool hardcoding a
// rate that would be stale within hours.
//
// Gap formula verified against multiple Spanish-language sources covering
// Venezuela (BCV vs Binance P2P) and Argentina (oficial vs blue/MEP):
// brecha = (paralelo − oficial) / oficial × 100

export interface GapResult {
  officialRate: number;
  parallelRate: number;
  gapPercent: number;
  gapAbsolute: number;
  amountInLocal: number;
  amountAtOfficial: number;
  amountAtParallel: number;
  differenceInLocal: number;
}

export function calculateExchangeGap(
  amountUSD: number,
  officialRate: number,
  parallelRate: number
): GapResult {
  const gapAbsolute = parallelRate - officialRate;
  const gapPercent = officialRate > 0 ? (gapAbsolute / officialRate) * 100 : 0;

  const amountAtOfficial = amountUSD * officialRate;
  const amountAtParallel = amountUSD * parallelRate;
  const differenceInLocal = amountAtParallel - amountAtOfficial;

  return {
    officialRate,
    parallelRate,
    gapPercent,
    gapAbsolute,
    amountInLocal: amountAtParallel,
    amountAtOfficial,
    amountAtParallel,
    differenceInLocal,
  };
}

export type GapCountry = "ve" | "ar" | "co" | "cl";

export interface GapCountryInfo {
  code: GapCountry;
  name: string;
  currency: string;
  officialLabel: string;
  parallelLabel: string;
}

export const GAP_COUNTRIES: GapCountryInfo[] = [
  {
    code: "ve",
    name: "Venezuela",
    currency: "VES",
    officialLabel: "Tasa BCV (oficial)",
    parallelLabel: "Tasa Binance P2P",
  },
  {
    code: "ar",
    name: "Argentina",
    currency: "ARS",
    officialLabel: "Dólar oficial",
    parallelLabel: "Dólar blue / MEP",
  },
  {
    code: "co",
    name: "Colombia",
    currency: "COP",
    officialLabel: "TRM oficial",
    parallelLabel: "Tasa Binance P2P",
  },
  {
    code: "cl",
    name: "Chile",
    currency: "CLP",
    officialLabel: "Dólar observado (oficial)",
    parallelLabel: "Tasa Binance P2P",
  },
];

export function formatLocalCurrency(value: number, currency: string): string {
  return `${value.toLocaleString("es-419", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
}
